update public.strategies
set sections = jsonb_set(
  jsonb_set(
    sections,
    '{idealStats}',
    to_jsonb('Use a lead de HP do Eladriel. Os valores da tabela são um piso para este matchup. Priorize artefato de dano recebido de Fogo no Eladriel e no Leo; no Chow, dano recebido de Vento. CD da S2 é valioso nos dois Dragon Knights, e recuperação da S2 ajuda o Eladriel.'::text),
    true
  ),
  '{builds}',
  '[{"monsterId":"eladriel","slot":0,"isAlternative":false,"runes":"Violent / Will · HP% / HP% / RES%","hp":28000,"def":850,"spd":40,"res":85,"acc":25},{"monsterId":"leo","slot":1,"isAlternative":false,"runes":"Vampire / Destroy · ATK% / CD% / HP%","hp":18000,"atk":700,"def":450,"cr":85,"cd":150,"acc":25},{"monsterId":"chow","slot":2,"isAlternative":false,"runes":"Violent / Destroy · ATK% / CD% / HP%","hp":20000,"atk":700,"def":550,"cr":85,"cd":150}]'::jsonb,
  true
)
where source_key = 'guild:kobrasw-eladriel-leo-chow-vs-sylvia-daphnis-zenitsu';
