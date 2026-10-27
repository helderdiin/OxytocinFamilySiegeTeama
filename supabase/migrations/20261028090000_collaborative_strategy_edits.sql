create table if not exists public.strategy_edits (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  editor_id uuid references public.profiles(id) on delete set null,
  editor_name text not null check (char_length(trim(editor_name)) between 2 and 64),
  edited_at timestamptz not null default now()
);

create index if not exists strategy_edits_strategy_edited_at_idx
on public.strategy_edits (strategy_id, edited_at desc);

create index if not exists strategy_edits_editor_id_idx
on public.strategy_edits (editor_id);

alter table public.strategy_edits enable row level security;

revoke all on table public.strategy_edits from anon, authenticated;
grant select on table public.strategy_edits to authenticated;

drop policy if exists "Authenticated users can read strategy edit history" on public.strategy_edits;
create policy "Authenticated users can read strategy edit history"
on public.strategy_edits for select
to authenticated
using (true);

drop policy if exists "Users can update their strategies" on public.strategies;
revoke update on table public.strategies from authenticated;

create or replace function public.update_strategy_collaboratively(
  p_strategy_id uuid,
  p_expected_updated_at timestamptz,
  p_attack text[],
  p_attack_alternatives jsonb,
  p_defense text[],
  p_defense_alternatives jsonb,
  p_safety text,
  p_validation_status text,
  p_sections jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  actor_name text;
  current_strategy public.strategies%rowtype;
  saved_strategy public.strategies%rowtype;
  saved_edit public.strategy_edits%rowtype;
begin
  if actor_id is null then
    raise exception 'authentication_required';
  end if;

  select profile.nick
    into actor_name
    from public.profiles as profile
    where profile.id = actor_id;

  if actor_name is null then
    raise exception 'profile_required';
  end if;

  select strategy.*
    into current_strategy
    from public.strategies as strategy
    where strategy.id = p_strategy_id
    for update;

  if not found then
    raise exception 'strategy_not_found';
  end if;

  if p_expected_updated_at is not null
    and current_strategy.updated_at is distinct from p_expected_updated_at then
    raise exception 'strategy_conflict';
  end if;

  update public.strategies
  set
    defense_id = null,
    attack = p_attack,
    attack_alternatives = p_attack_alternatives,
    defense = p_defense,
    defense_alternatives = p_defense_alternatives,
    safety = p_safety,
    validation_status = p_validation_status,
    sections = p_sections
  where id = p_strategy_id
  returning * into saved_strategy;

  insert into public.strategy_edits (
    strategy_id,
    editor_id,
    editor_name
  ) values (
    saved_strategy.id,
    actor_id,
    actor_name
  )
  returning * into saved_edit;

  return jsonb_build_object(
    'strategy', to_jsonb(saved_strategy),
    'edit', to_jsonb(saved_edit)
  );
end;
$$;

revoke all on function public.update_strategy_collaboratively(
  uuid,
  timestamptz,
  text[],
  jsonb,
  text[],
  jsonb,
  text,
  text,
  jsonb
) from public, anon;

grant execute on function public.update_strategy_collaboratively(
  uuid,
  timestamptz,
  text[],
  jsonb,
  text[],
  jsonb,
  text,
  text,
  jsonb
) to authenticated;
