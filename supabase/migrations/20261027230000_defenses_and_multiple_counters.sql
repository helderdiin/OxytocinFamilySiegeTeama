create or replace function public.strategy_composition_fingerprint(
  primary_ids text[],
  alternatives jsonb
)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  slot_index integer;
  canonical_slots jsonb := '[]'::jsonb;
  canonical_alternatives jsonb;
begin
  if cardinality(primary_ids) <> 3
    or jsonb_typeof(alternatives) <> 'array'
    or jsonb_array_length(alternatives) <> 3 then
    return null;
  end if;

  for slot_index in 0..2 loop
    select coalesce(jsonb_agg(option_id order by option_id), '[]'::jsonb)
      into canonical_alternatives
      from jsonb_array_elements_text(alternatives -> slot_index) as option(option_id);

    canonical_slots := canonical_slots || jsonb_build_array(
      jsonb_build_object(
        'primary', primary_ids[slot_index + 1],
        'alternatives', canonical_alternatives
      )
    );
  end loop;

  return canonical_slots::text;
exception
  when others then
    return null;
end;
$$;

create table public.defenses (
  id uuid primary key default gen_random_uuid(),
  monsters text[] not null,
  alternatives jsonb not null default '[[], [], []]'::jsonb,
  fingerprint text generated always as (
    public.strategy_composition_fingerprint(monsters, alternatives)
  ) stored,
  created_by uuid references public.profiles(id) on delete set null,
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint defenses_composition_check check (
    cardinality(monsters) = 3
    and monsters[1] is not null and btrim(monsters[1]) <> '' and monsters[1] <> '*'
    and monsters[2] is not null and btrim(monsters[2]) <> '' and monsters[2] <> '*'
    and monsters[3] is not null and btrim(monsters[3]) <> ''
  ),
  constraint defenses_alternatives_check check (
    public.valid_strategy_slot_alternatives(monsters, alternatives)
  ),
  constraint defenses_owner_check check (
    (is_seed and created_by is null) or (not is_seed and created_by is not null)
  ),
  constraint defenses_fingerprint_key unique (fingerprint)
);

create index defenses_created_at_idx on public.defenses (created_at desc);
create index defenses_created_by_idx on public.defenses (created_by);

create trigger defenses_set_updated_at
before update on public.defenses
for each row execute function public.set_updated_at();

alter table public.strategies
add column if not exists defense_id uuid references public.defenses(id) on delete restrict;

insert into public.defenses (monsters, alternatives, created_by, is_seed, created_at)
select distinct on (public.strategy_composition_fingerprint(strategy.defense, strategy.defense_alternatives))
  strategy.defense,
  strategy.defense_alternatives,
  case when strategy.is_seed then null else strategy.owner_id end,
  strategy.is_seed,
  strategy.created_at
from public.strategies as strategy
where strategy.defense_id is null
order by
  public.strategy_composition_fingerprint(strategy.defense, strategy.defense_alternatives),
  strategy.is_seed desc,
  strategy.created_at asc
on conflict (fingerprint) do nothing;

update public.strategies as strategy
set defense_id = defense.id
from public.defenses as defense
where strategy.defense_id is null
  and defense.fingerprint = public.strategy_composition_fingerprint(
    strategy.defense,
    strategy.defense_alternatives
  );

alter table public.strategies
alter column defense_id set not null;

create index strategies_defense_id_idx on public.strategies (defense_id);

create or replace function public.sync_strategy_defense()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_defense_id uuid;
begin
  if new.defense_id is null then
    select defense.id
      into resolved_defense_id
      from public.defenses as defense
      where defense.fingerprint = public.strategy_composition_fingerprint(
        new.defense,
        coalesce(new.defense_alternatives, '[[], [], []]'::jsonb)
      );

    if resolved_defense_id is null then
      insert into public.defenses (
        monsters,
        alternatives,
        created_by,
        is_seed,
        created_at
      ) values (
        new.defense,
        coalesce(new.defense_alternatives, '[[], [], []]'::jsonb),
        case when new.is_seed then null else new.owner_id end,
        new.is_seed,
        coalesce(new.created_at, now())
      )
      on conflict (fingerprint) do update
      set updated_at = public.defenses.updated_at
      returning id into resolved_defense_id;
    end if;

    new.defense_id := resolved_defense_id;
  else
    select defense.monsters, defense.alternatives
      into new.defense, new.defense_alternatives
      from public.defenses as defense
      where defense.id = new.defense_id;

    if new.defense is null then
      raise exception 'Defesa não encontrada.' using errcode = '23503';
    end if;
  end if;

  return new;
end;
$$;

create trigger strategies_sync_defense
before insert or update of defense_id, defense, defense_alternatives
on public.strategies
for each row execute function public.sync_strategy_defense();

create or replace function public.propagate_defense_to_strategies()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.strategies
  set
    defense = new.monsters,
    defense_alternatives = new.alternatives
  where defense_id = new.id
    and (
      defense is distinct from new.monsters
      or defense_alternatives is distinct from new.alternatives
    );
  return new;
end;
$$;

create trigger defenses_propagate_to_strategies
after update of monsters, alternatives on public.defenses
for each row execute function public.propagate_defense_to_strategies();

alter table public.defenses enable row level security;

revoke all on table public.defenses from anon, authenticated;
grant select, insert, update, delete on table public.defenses to authenticated;

create policy "Authenticated users can read defenses"
on public.defenses for select
to authenticated
using (true);

create policy "Users can create defenses"
on public.defenses for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and is_seed = false
);

create policy "Creators can update defenses"
on public.defenses for update
to authenticated
using (created_by = (select auth.uid()) and is_seed = false)
with check (created_by = (select auth.uid()) and is_seed = false);

create policy "Creators can delete unused defenses"
on public.defenses for delete
to authenticated
using (
  created_by = (select auth.uid())
  and is_seed = false
  and not exists (
    select 1
    from public.strategies
    where strategies.defense_id = defenses.id
  )
);

create or replace function public.resolve_defense(
  p_monsters text[],
  p_alternatives jsonb default '[[], [], []]'::jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  resolved_id uuid;
  requested_fingerprint text;
begin
  if (select auth.uid()) is null then
    raise exception 'Autenticação necessária.' using errcode = '42501';
  end if;

  if not public.valid_strategy_slot_alternatives(p_monsters, p_alternatives) then
    raise exception 'Composição de defesa inválida.' using errcode = '23514';
  end if;

  requested_fingerprint := public.strategy_composition_fingerprint(
    p_monsters,
    p_alternatives
  );

  select defense.id
    into resolved_id
    from public.defenses as defense
    where defense.fingerprint = requested_fingerprint;

  if resolved_id is not null then
    return resolved_id;
  end if;

  begin
    insert into public.defenses (
      monsters,
      alternatives,
      created_by,
      is_seed
    ) values (
      p_monsters,
      p_alternatives,
      (select auth.uid()),
      false
    )
    returning id into resolved_id;
  exception
    when unique_violation then
      select defense.id
        into resolved_id
        from public.defenses as defense
        where defense.fingerprint = requested_fingerprint;
  end;

  return resolved_id;
end;
$$;

revoke all on function public.strategy_composition_fingerprint(text[], jsonb) from public;
grant execute on function public.strategy_composition_fingerprint(text[], jsonb) to authenticated;
revoke all on function public.resolve_defense(text[], jsonb) from public;
grant execute on function public.resolve_defense(text[], jsonb) to authenticated;

insert into public.strategies (
  source_key,
  owner_id,
  player_name,
  attack,
  attack_alternatives,
  defense,
  defense_alternatives,
  safety,
  validation_status,
  sections,
  is_seed,
  is_active,
  created_at
)
values (
  'guild:kobrasw-eladriel-leo-chow-vs-sylvia-daphnis-zenitsu',
  null,
  'KoBrAsw',
  array['eladriel', 'leo', 'chow'],
  '[["briand"], [], []]'::jsonb,
  array['sylvia', 'daphnis', 'wind-zenitsu'],
  '[["moore"], [], ["savannah"]]'::jsonb,
  'situational',
  'proven',
  jsonb_build_object(
    'gamePlan', 'Leo limita a velocidade da luta para retirar a vantagem da abertura inimiga. Eladriel ou Briand mantém o time de pé e recupera uma peça abatida, enquanto Chow sustenta o dano até desmontar a defesa.',
    'idealStats', 'O reviver precisa de bastante HP, DEF e RES para sobreviver ao primeiro ciclo. Leo deve ser montado como bruiser resistente, e Chow precisa equilibrar dano e sustain para conduzir a luta longa.',
    'turnOrder', 'Sem ordem rígida por causa da passiva do Leo. Priorize a recuperação com Eladriel ou Briand, use Leo para controlar o ritmo e deixe Chow converter a vantagem em abates.',
    'targetPriority', 'Daphnis primeiro para remover a maior ameaça de explosão. Depois elimine Zenitsu ou Savannah e deixe Sylvia ou Moore por último quando a luta estiver estabilizada.',
    'thirdVariations', 'Pensado para Sylvia ou Moore + Daphnis + Wind Zenitsu ou Savannah. Confirme o terceiro defensor antes de escolher a variação do reviver.',
    'risks', 'O plano perde muita segurança se Eladriel ou Briand cair antes de usar o revive. Evite quando o reviver não suportar a abertura ou quando a defesa tiver controle suficiente para impedir a recuperação.',
    'substitutions', 'Briand pode ocupar o slot do Eladriel apenas quando o Eladriel não estiver disponível. É uma alternativa de disponibilidade, não uma escolha por status ou build.',
    'evidence', 'Testado e comprovado por mais de um membro da guilda. KoBrAsw trouxe o counter a partir da recomendação de um youtuber conhecido.'
  ),
  true,
  true,
  '2026-10-27T14:00:00.000Z'
)
on conflict (source_key) do update
set
  player_name = excluded.player_name,
  attack = excluded.attack,
  attack_alternatives = excluded.attack_alternatives,
  defense = excluded.defense,
  defense_alternatives = excluded.defense_alternatives,
  safety = excluded.safety,
  validation_status = excluded.validation_status,
  sections = excluded.sections,
  is_active = excluded.is_active,
  updated_at = now();
