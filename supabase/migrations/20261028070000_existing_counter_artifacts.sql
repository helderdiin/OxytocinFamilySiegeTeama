update public.strategies
set sections = jsonb_set(
  sections,
  '{builds}',
  '[{"monsterId":"fire-aragorn","slot":0,"isAlternative":false,"runes":"Revenge / Revenge / Will","hp":32000,"def":500,"artifacts":"Redução de dano de Água / recuperação da S3"},{"monsterId":"racuni","slot":1,"isAlternative":false,"runes":"Violent / Nemesis","hp":30000,"def":600,"artifacts":"Redução de dano de Água / recuperação da S3"},{"monsterId":"gyomei-himejima","slot":2,"isAlternative":false,"runes":"Violent / Seal","hp":30000,"def":1200,"artifacts":"Redução de dano de Fogo / precisão da S2"},{"monsterId":"windy","slot":2,"isAlternative":true,"artifacts":"Redução de dano de Fogo / dano adicional por DEF"}]'::jsonb,
  true
)
where source_key = 'siege-team-helper:aragorn-racuni-gyomei-vs-sylvia-daphnis';

update public.strategies
set sections = jsonb_set(
  sections,
  '{builds}',
  '[{"monsterId":"eladriel","slot":0,"isAlternative":false,"runes":"Violent / Will · HP% / HP% / RES%","hp":28000,"def":850,"spd":40,"res":85,"acc":25,"artifacts":"Redução de dano de Fogo / recuperação da S2"},{"monsterId":"briand","slot":0,"isAlternative":true,"artifacts":"Redução de dano de Fogo / precisão da S2"},{"monsterId":"leo","slot":1,"isAlternative":false,"runes":"Vampire / Destroy · ATK% / CD% / HP%","hp":18000,"atk":700,"def":450,"cr":85,"cd":150,"acc":25,"artifacts":"Redução de dano de Fogo / dano crítico da S2"},{"monsterId":"chow","slot":2,"isAlternative":false,"runes":"Violent / Destroy · ATK% / CD% / HP%","hp":20000,"atk":700,"def":550,"cr":85,"cd":150,"artifacts":"Redução de dano de Vento / dano crítico da S2"}]'::jsonb,
  true
)
where source_key = 'guild:kobrasw-eladriel-leo-chow-vs-sylvia-daphnis-zenitsu';
