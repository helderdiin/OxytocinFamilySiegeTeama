create or replace function public.valid_strategy_builds(
  attack_ids text[],
  alternatives jsonb,
  strategy_sections jsonb
)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  builds jsonb;
  build jsonb;
  monster_id text;
  seen_ids text[] := array[]::text[];
  numeric_key text;
  numeric_value numeric;
begin
  builds := strategy_sections -> 'builds';
  if builds is null then
    return true;
  end if;

  if jsonb_typeof(builds) <> 'array' or jsonb_array_length(builds) > 15 then
    return false;
  end if;

  for build in select value from jsonb_array_elements(builds) loop
    if jsonb_typeof(build) <> 'object'
      or jsonb_typeof(build -> 'monsterId') <> 'string' then
      return false;
    end if;

    monster_id := build ->> 'monsterId';
    if monster_id = '' or monster_id = any(seen_ids) then
      return false;
    end if;

    if not (
      monster_id = any(attack_ids)
      or exists (
        select 1
        from jsonb_array_elements(alternatives) as slot(options)
        cross join jsonb_array_elements_text(slot.options) as option(value)
        where option.value = monster_id
      )
    ) then
      return false;
    end if;
    seen_ids := array_append(seen_ids, monster_id);

    if build ? 'runes' and (
      jsonb_typeof(build -> 'runes') <> 'string'
      or char_length(build ->> 'runes') > 80
    ) then
      return false;
    end if;

    foreach numeric_key in array array['hp', 'atk', 'def', 'spd', 'cr', 'cd', 'res', 'acc'] loop
      if build ? numeric_key then
        if jsonb_typeof(build -> numeric_key) <> 'number' then
          return false;
        end if;
        numeric_value := (build ->> numeric_key)::numeric;
        if numeric_value < 0 then
          return false;
        end if;
        if numeric_key in ('hp') and numeric_value > 200000 then return false; end if;
        if numeric_key in ('atk', 'def') and numeric_value > 10000 then return false; end if;
        if numeric_key = 'spd' and numeric_value > 1000 then return false; end if;
        if numeric_key in ('cr', 'res', 'acc') and numeric_value > 100 then return false; end if;
        if numeric_key = 'cd' and numeric_value > 400 then return false; end if;
      end if;
    end loop;

    if build ? 'slot' and (
      jsonb_typeof(build -> 'slot') <> 'number'
      or (build ->> 'slot')::integer not between 0 and 2
    ) then
      return false;
    end if;
    if build ? 'isAlternative' and jsonb_typeof(build -> 'isAlternative') <> 'boolean' then
      return false;
    end if;
  end loop;

  return true;
exception
  when others then
    return false;
end;
$$;

alter table public.strategies
add constraint strategies_build_recommendations_check check (
  public.valid_strategy_builds(attack, attack_alternatives, sections)
);

update public.strategies
set sections = jsonb_set(
  sections,
  '{builds}',
  '[{"monsterId":"fire-aragorn","slot":0,"isAlternative":false,"runes":"Revenge / Revenge / Will","hp":32000,"def":500},{"monsterId":"racuni","slot":1,"isAlternative":false,"runes":"Violent / Nemesis","hp":30000,"def":600},{"monsterId":"gyomei-himejima","slot":2,"isAlternative":false,"runes":"Violent / Seal","hp":30000,"def":1200}]'::jsonb,
  true
)
where source_key = 'siege-team-helper:aragorn-racuni-gyomei-vs-sylvia-daphnis';

revoke all on function public.valid_strategy_builds(text[], jsonb, jsonb) from public;
grant execute on function public.valid_strategy_builds(text[], jsonb, jsonb) to authenticated;
