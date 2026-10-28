create or replace function public.generate_defense_short_id()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  candidate text;
  character_index integer;
begin
  loop
    candidate := '';
    for character_index in 1..8 loop
      candidate := candidate || substr(
        alphabet,
        1 + floor(random() * length(alphabet))::integer,
        1
      );
    end loop;

    exit when not exists (
      select 1
      from public.defenses as defense
      where defense.short_id = candidate
    );
  end loop;

  return candidate;
end;
$$;

alter table public.defenses
add column if not exists short_id text;

update public.defenses
set short_id = public.generate_defense_short_id()
where short_id is null;

alter table public.defenses
alter column short_id set default public.generate_defense_short_id(),
alter column short_id set not null;

alter table public.defenses
drop constraint if exists defenses_short_id_format_check;

alter table public.defenses
add constraint defenses_short_id_format_check
check (short_id ~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$');

create unique index if not exists defenses_short_id_key
on public.defenses (short_id);

revoke all on function public.generate_defense_short_id() from public, anon;
grant execute on function public.generate_defense_short_id() to authenticated, service_role;

create or replace function public.get_share_preview(
  p_kind text,
  p_key text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  normalized_kind text := lower(btrim(coalesce(p_kind, '')));
  normalized_key text := upper(btrim(coalesce(p_key, '')));
  result jsonb;
begin
  if normalized_kind = 'strategy' then
    select jsonb_build_object(
      'kind', 'strategy',
      'id', strategy.id,
      'shortId', strategy.short_id,
      'defenseShortId', defense.short_id,
      'player', strategy.player_name,
      'attack', to_jsonb(strategy.attack),
      'defense', to_jsonb(strategy.defense),
      'attackAlternatives', strategy.attack_alternatives,
      'defenseAlternatives', strategy.defense_alternatives,
      'safety', strategy.safety,
      'status', strategy.validation_status,
      'sections', strategy.sections,
      'updatedAt', strategy.updated_at,
      'positiveCount', (
        select count(*)
        from public.strategy_comments as comment
        where comment.strategy_id = strategy.id and comment.reaction = 1
      ),
      'negativeCount', (
        select count(*)
        from public.strategy_comments as comment
        where comment.strategy_id = strategy.id and comment.reaction = -1
      )
    )
    into result
    from public.strategies as strategy
    join public.defenses as defense on defense.id = strategy.defense_id
    where strategy.is_active
      and strategy.short_id = normalized_key
    limit 1;
  elsif normalized_kind = 'defense' then
    select jsonb_build_object(
      'kind', 'defense',
      'id', defense.id,
      'shortId', defense.short_id,
      'defense', to_jsonb(defense.monsters),
      'defenseAlternatives', defense.alternatives,
      'updatedAt', defense.updated_at,
      'counterCount', (
        select count(*)
        from public.strategies as counter
        where counter.defense_id = defense.id and counter.is_active
      ),
      'provenCount', (
        select count(*)
        from public.strategies as counter
        where counter.defense_id = defense.id
          and counter.is_active
          and counter.validation_status = 'proven'
      ),
      'strategies', coalesce((
        select jsonb_agg(ranked.item)
        from (
          select jsonb_build_object(
            'shortId', counter.short_id,
            'player', counter.player_name,
            'attack', to_jsonb(counter.attack),
            'attackAlternatives', counter.attack_alternatives,
            'safety', counter.safety,
            'status', counter.validation_status
          ) as item
          from public.strategies as counter
          where counter.defense_id = defense.id and counter.is_active
          order by
            case counter.validation_status
              when 'proven' then 3
              when 'recommended' then 2
              else 1
            end desc,
            case counter.safety
              when 'very_safe' then 4
              when 'safe' then 3
              when 'situational' then 2
              else 1
            end desc,
            counter.created_at desc
          limit 4
        ) as ranked
      ), '[]'::jsonb)
    )
    into result
    from public.defenses as defense
    where defense.short_id = normalized_key
      and exists (
        select 1
        from public.strategies as counter
        where counter.defense_id = defense.id and counter.is_active
      )
    limit 1;
  else
    return null;
  end if;

  return result;
end;
$$;

revoke all on function public.get_share_preview(text, text) from public;
grant execute on function public.get_share_preview(text, text) to anon, authenticated, service_role;
