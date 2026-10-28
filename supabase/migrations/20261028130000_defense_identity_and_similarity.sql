create or replace function public.strategy_slot_sets(
  primary_ids text[],
  alternatives jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  slot_index integer;
  slot_set jsonb;
  result jsonb := '[]'::jsonb;
begin
  if cardinality(primary_ids) <> 3
    or jsonb_typeof(alternatives) <> 'array'
    or jsonb_array_length(alternatives) <> 3 then
    return null;
  end if;

  for slot_index in 0..2 loop
    select coalesce(jsonb_agg(option_id order by option_id), '[]'::jsonb)
      into slot_set
      from (
        select distinct option_id
        from (
          select primary_ids[slot_index + 1] as option_id
          union all
          select option.value
          from jsonb_array_elements_text(alternatives -> slot_index) as option(value)
        ) as slot_options
        where option_id is not null and btrim(option_id) <> ''
      ) as canonical_options;

    result := result || jsonb_build_array(slot_set);
  end loop;

  return result;
exception
  when others then
    return null;
end;
$$;

create or replace function public.strategy_composition_fingerprint(
  primary_ids text[],
  alternatives jsonb
)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when public.strategy_slot_sets(primary_ids, alternatives) is null then null
    else (
      select jsonb_agg(slot_set order by slot_set::text)::text
      from jsonb_array_elements(
        public.strategy_slot_sets(primary_ids, alternatives)
      ) as slots(slot_set)
    )
  end;
$$;

alter table public.defenses
drop constraint if exists defenses_fingerprint_key;

-- Stored generated columns are recalculated on update after the canonical
-- fingerprint changes. Equivalent defenses can then be merged safely.
update public.defenses
set monsters = monsters;

with ranked_defenses as (
  select
    defense.id,
    first_value(defense.id) over (
      partition by defense.fingerprint
      order by defense.is_seed desc, defense.created_at asc, defense.id asc
    ) as keeper_id
  from public.defenses as defense
)
update public.strategies as strategy
set defense_id = ranked.keeper_id
from ranked_defenses as ranked
where strategy.defense_id = ranked.id
  and ranked.id <> ranked.keeper_id;

with duplicate_defenses as (
  select
    defense.id,
    row_number() over (
      partition by defense.fingerprint
      order by defense.is_seed desc, defense.created_at asc, defense.id asc
    ) as position
  from public.defenses as defense
)
delete from public.defenses as defense
using duplicate_defenses as duplicate
where defense.id = duplicate.id
  and duplicate.position > 1;

alter table public.defenses
add constraint defenses_fingerprint_key unique (fingerprint);

create or replace function public.strategy_slot_sets_overlap(
  left_slot jsonb,
  right_slot jsonb
)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select exists (
    select 1
    from jsonb_array_elements_text(left_slot) as left_option(value)
    join jsonb_array_elements_text(right_slot) as right_option(value)
      using (value)
  );
$$;

create or replace function public.find_similar_defenses(
  p_monsters text[],
  p_alternatives jsonb default '[[], [], []]'::jsonb,
  p_limit integer default 3
)
returns table (
  id uuid,
  monsters text[],
  alternatives jsonb,
  counter_count bigint,
  matching_slots integer,
  exact_slots integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  with requested as (
    select
      public.strategy_slot_sets(p_monsters, p_alternatives) as slots,
      public.strategy_composition_fingerprint(p_monsters, p_alternatives) as fingerprint
  )
  select
    defense.id,
    defense.monsters,
    defense.alternatives,
    coalesce(counter_total.counter_count, 0) as counter_count,
    best_match.matching_slots,
    best_match.exact_slots
  from public.defenses as defense
  cross join requested
  cross join lateral (
    select public.strategy_slot_sets(defense.monsters, defense.alternatives) as slots
  ) as existing
  cross join lateral (
    select scored.matching_slots, scored.exact_slots
    from (
      select
        (
          public.strategy_slot_sets_overlap(requested.slots -> 0, existing.slots -> permutation.slot_1)::integer
          + public.strategy_slot_sets_overlap(requested.slots -> 1, existing.slots -> permutation.slot_2)::integer
          + public.strategy_slot_sets_overlap(requested.slots -> 2, existing.slots -> permutation.slot_3)::integer
        ) as matching_slots,
        (
          ((requested.slots -> 0) = (existing.slots -> permutation.slot_1))::integer
          + ((requested.slots -> 1) = (existing.slots -> permutation.slot_2))::integer
          + ((requested.slots -> 2) = (existing.slots -> permutation.slot_3))::integer
        ) as exact_slots
      from (values
        (0, 1, 2), (0, 2, 1), (1, 0, 2),
        (1, 2, 0), (2, 0, 1), (2, 1, 0)
      ) as permutation(slot_1, slot_2, slot_3)
    ) as scored
    order by scored.matching_slots desc, scored.exact_slots desc
    limit 1
  ) as best_match
  left join lateral (
    select count(*)::bigint as counter_count
    from public.strategies as strategy
    where strategy.defense_id = defense.id
      and strategy.is_active = true
  ) as counter_total on true
  where (select auth.uid()) is not null
    and requested.slots is not null
    and defense.fingerprint is distinct from requested.fingerprint
    and best_match.matching_slots >= 2
  order by
    best_match.matching_slots desc,
    best_match.exact_slots desc,
    counter_total.counter_count desc,
    defense.created_at asc
  limit greatest(1, least(coalesce(p_limit, 3), 10));
$$;

comment on function public.strategy_composition_fingerprint(text[], jsonb) is
  'Canonical defense identity: slot order and primary-versus-alternative order do not change the fingerprint.';
comment on function public.find_similar_defenses(text[], jsonb, integer) is
  'Returns non-identical defenses sharing at least two logical slots, so the user can choose whether to reuse one.';

revoke all on function public.strategy_slot_sets(text[], jsonb) from public, anon;
grant execute on function public.strategy_slot_sets(text[], jsonb) to authenticated;
revoke all on function public.strategy_slot_sets_overlap(jsonb, jsonb) from public, anon;
grant execute on function public.strategy_slot_sets_overlap(jsonb, jsonb) to authenticated;
revoke all on function public.strategy_composition_fingerprint(text[], jsonb) from public, anon;
grant execute on function public.strategy_composition_fingerprint(text[], jsonb) to authenticated;
revoke all on function public.find_similar_defenses(text[], jsonb, integer) from public, anon;
grant execute on function public.find_similar_defenses(text[], jsonb, integer) to authenticated;
