update public.strategies
set sections = jsonb_set(
  sections,
  '{referenceImage}',
  jsonb_build_object(
    'path', 'assets/counter-references/eladriel-leo-chow-v1-original-assets.png',
    'alt', 'Counter de Eladriel ou Briand, Leo e Chow contra Sylvia ou Moore, Daphnis e Zenitsu Agatsuma ou Savannah',
    'width', 1536,
    'height', 1024,
    'version', 1
  ),
  true
)
where source_key = 'guild:kobrasw-eladriel-leo-chow-vs-sylvia-daphnis-zenitsu';
