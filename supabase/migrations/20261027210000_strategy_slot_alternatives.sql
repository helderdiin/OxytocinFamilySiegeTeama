create or replace function public.valid_strategy_slot_alternatives(
  primary_ids text[],
  alternatives jsonb
)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  slot_index integer;
  slot_options jsonb;
  option_id text;
  seen_ids text[] := array[]::text[];
begin
  if cardinality(primary_ids) <> 3
    or jsonb_typeof(alternatives) <> 'array'
    or jsonb_array_length(alternatives) <> 3 then
    return false;
  end if;

  for slot_index in 1..3 loop
    if primary_ids[slot_index] is null or btrim(primary_ids[slot_index]) = '' then
      return false;
    end if;

    if primary_ids[slot_index] <> '*' then
      if primary_ids[slot_index] = any(seen_ids) then
        return false;
      end if;
      seen_ids := array_append(seen_ids, primary_ids[slot_index]);
    end if;

    slot_options := alternatives -> (slot_index - 1);
    if jsonb_typeof(slot_options) <> 'array'
      or jsonb_array_length(slot_options) > 4
      or (primary_ids[slot_index] = '*' and jsonb_array_length(slot_options) > 0) then
      return false;
    end if;

    for option_id in select value from jsonb_array_elements_text(slot_options) loop
      if btrim(option_id) = '' or option_id = '*' or option_id = any(seen_ids) then
        return false;
      end if;
      seen_ids := array_append(seen_ids, option_id);
    end loop;
  end loop;

  return true;
exception
  when others then
    return false;
end;
$$;

alter table public.strategies
add column if not exists attack_alternatives jsonb not null default '[[], [], []]'::jsonb;

alter table public.strategies
add column if not exists defense_alternatives jsonb not null default '[[], [], []]'::jsonb;

alter table public.strategies
drop constraint if exists strategies_attack_alternatives_check;

alter table public.strategies
add constraint strategies_attack_alternatives_check check (
  public.valid_strategy_slot_alternatives(attack, attack_alternatives)
);

alter table public.strategies
drop constraint if exists strategies_defense_alternatives_check;

alter table public.strategies
add constraint strategies_defense_alternatives_check check (
  public.valid_strategy_slot_alternatives(defense, defense_alternatives)
);

revoke all on function public.valid_strategy_slot_alternatives(text[], jsonb) from public;
grant execute on function public.valid_strategy_slot_alternatives(text[], jsonb) to authenticated;
