update public.strategies
set sections = jsonb_set(
  sections,
  '{referenceImage}',
  jsonb_build_object(
    'path', 'assets/counter-references/juno-lucia-cayde-v1-original-assets.png',
    'alt', 'Counter de Juno, Lucia e Cayde contra Seara, ROBO-F29 ou Lionel e qualquer terceiro',
    'width', 1536,
    'height', 1024,
    'version', 1
  ),
  true
)
where source_key = 'siege-team-helper:juno-lucia-cayde-vs-seara-robo-f29';

update public.strategies
set sections = jsonb_set(
  sections,
  '{referenceImage}',
  jsonb_build_object(
    'path', 'assets/counter-references/platy-shihwa-elucia-v1-original-assets.png',
    'alt', 'Counter de Platy, Shihwa e Elucia 2A contra Morris, Orion e Trevor',
    'width', 1536,
    'height', 1024,
    'version', 1
  ),
  true
)
where source_key = 'guild:mittus-platy-shihwa-elucia-vs-morris-orion-trevor';
