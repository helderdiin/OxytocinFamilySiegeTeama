update public.strategies
set sections = jsonb_set(
  jsonb_set(
    sections,
    '{idealStats}',
    to_jsonb('Use a lead de 24% SPD da Platy e mantenha o trio no tick 5, na ordem Platy → Shihwa → Elucia 2A. Os valores da tabela são pisos de referência para este matchup: Platy e Elucia precisam sobreviver à abertura e Shihwa não pode sacrificar toda a durabilidade para causar dano.'::text),
    true
  ),
  '{builds}',
  '[{"monsterId":"platy","slot":0,"isAlternative":false,"runes":"Violent / Will · SPD / HP% / RES%","speedTune":"Tick 5 · referência +149 SPD","hp":30000,"def":700,"res":100,"acc":45,"artifacts":"Redução de dano de Água / recuperação da S2"},{"monsterId":"shihwa","slot":1,"isAlternative":false,"runes":"Violent / Destroy · SPD / CR% / HP%","speedTune":"Tick 5 · referência +144 SPD","hp":20000,"atk":1000,"def":700,"acc":45,"artifacts":"Redução de dano de Água / dano da S3"},{"monsterId":"elucia","slot":2,"isAlternative":false,"runes":"Violent / Will · SPD / HP% / HP%","speedTune":"Tick 5 · referência +141 SPD","hp":25000,"atk":500,"def":700,"res":70,"artifacts":"Redução de dano de Água / recuperação da S2"}]'::jsonb,
  true
)
where source_key = 'guild:mittus-platy-shihwa-elucia-vs-morris-orion-trevor';
