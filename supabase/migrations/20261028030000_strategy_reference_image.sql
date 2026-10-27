create or replace function public.valid_strategy_reference_image(strategy_sections jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  reference_image jsonb;
  image_path text;
  image_alt text;
  image_version numeric;
begin
  if not (strategy_sections ? 'referenceImage') then
    return true;
  end if;

  reference_image := strategy_sections -> 'referenceImage';
  if jsonb_typeof(reference_image) <> 'object' then
    return false;
  end if;

  if not (
    reference_image ?& array['path', 'alt', 'width', 'height', 'version']
    and (reference_image - array['path', 'alt', 'width', 'height', 'version']) = '{}'::jsonb
  ) then
    return false;
  end if;

  if jsonb_typeof(reference_image -> 'path') <> 'string'
    or jsonb_typeof(reference_image -> 'alt') <> 'string'
    or jsonb_typeof(reference_image -> 'width') <> 'number'
    or jsonb_typeof(reference_image -> 'height') <> 'number'
    or jsonb_typeof(reference_image -> 'version') <> 'number' then
    return false;
  end if;

  image_path := btrim(reference_image ->> 'path');
  image_alt := btrim(reference_image ->> 'alt');
  image_version := (reference_image ->> 'version')::numeric;

  return image_path ~ '^assets/counter-references/[a-z0-9][a-z0-9-]*\.png$'
    and char_length(image_path) <= 180
    and char_length(image_alt) between 1 and 240
    and (reference_image ->> 'width')::numeric = 1536
    and (reference_image ->> 'height')::numeric = 1024
    and image_version = trunc(image_version)
    and image_version between 1 and 999;
exception
  when others then
    return false;
end;
$$;

alter table public.strategies
add constraint strategies_reference_image_check check (
  public.valid_strategy_reference_image(sections)
);

update public.strategies
set sections = jsonb_set(
  sections,
  '{referenceImage}',
  jsonb_build_object(
    'path', 'assets/counter-references/fire-aragorn-racuni-gyomei-v3-original-assets.png',
    'alt', 'Counter de Fire Aragorn, Racuni e Gyomei Himejima contra Sylvia ou Moore, Daphnis e Zenitsu Agatsuma ou Savannah',
    'width', 1536,
    'height', 1024,
    'version', 1
  ),
  true
)
where source_key = 'siege-team-helper:aragorn-racuni-gyomei-vs-sylvia-daphnis';

revoke all on function public.valid_strategy_reference_image(jsonb) from public;
grant execute on function public.valid_strategy_reference_image(jsonb) to authenticated;
