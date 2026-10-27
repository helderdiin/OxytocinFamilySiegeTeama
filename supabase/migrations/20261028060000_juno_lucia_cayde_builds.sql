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
    if build ? 'speedTune' and (
      jsonb_typeof(build -> 'speedTune') <> 'string'
      or char_length(build ->> 'speedTune') > 80
    ) then
      return false;
    end if;
    if build ? 'artifacts' and (
      jsonb_typeof(build -> 'artifacts') <> 'string'
      or char_length(build ->> 'artifacts') > 180
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

update public.strategies
set sections = jsonb_set(
  jsonb_set(
    sections,
    '{idealStats}',
    to_jsonb('Juno e Lucia devem alcançar o tick 5 de SPD. Juno precisa de pelo menos 50% ACC total. Lucia precisa de pelo menos 50% RES total. Cayde não depende de SPD; qualquer ACC adicional é bem-vinda para aumentar a consistência da S2.'::text),
    true
  ),
  '{builds}',
  '[{"monsterId":"juno","slot":0,"isAlternative":false,"runes":"Violent / Destroy","speedTune":"Tick 5","hp":30000,"atk":700,"def":600,"acc":50,"artifacts":"Redução de dano / dano adicional"},{"monsterId":"lucia","slot":1,"isAlternative":false,"runes":"Violent / Will","speedTune":"Tick 5","hp":30000,"def":600,"res":50,"artifacts":"Redução de dano / recuperação da S2"},{"monsterId":"cayde","slot":2,"isAlternative":false,"runes":"Sem set obrigatório","speedTune":"SPD não é prioridade","hp":38000,"def":800,"res":50,"artifacts":"Redução de dano / precisão da S2"}]'::jsonb,
  true
)
where source_key = 'siege-team-helper:juno-lucia-cayde-vs-seara-robo-f29';

revoke all on function public.valid_strategy_builds(text[], jsonb, jsonb) from public;
grant execute on function public.valid_strategy_builds(text[], jsonb, jsonb) to authenticated;
