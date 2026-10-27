update public.strategies
set
  attack_alternatives = '[[], [], ["windy"]]'::jsonb,
  sections = jsonb_set(
    sections,
    '{substitutions}',
    to_jsonb('Windy pode ocupar o slot do Gyomei Himejima somente quando o Gyomei não estiver disponível. É uma alternativa de disponibilidade, não a opção principal do counter.'::text),
    true
  )
where source_key = 'siege-team-helper:aragorn-racuni-gyomei-vs-sylvia-daphnis';
