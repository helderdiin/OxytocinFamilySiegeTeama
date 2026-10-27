alter table public.strategies
drop constraint if exists strategies_attack_check;

alter table public.strategies
drop constraint if exists strategies_attack_composition_check;

alter table public.strategies
add constraint strategies_attack_composition_check check (
  cardinality(attack) = 3
  and attack[1] is not null and btrim(attack[1]) <> '' and attack[1] <> '*'
  and attack[2] is not null and btrim(attack[2]) <> '' and attack[2] <> '*'
  and attack[3] is not null and btrim(attack[3]) <> ''
);

alter table public.strategies
drop constraint if exists strategies_defense_check;

alter table public.strategies
drop constraint if exists strategies_defense_composition_check;

alter table public.strategies
add constraint strategies_defense_composition_check check (
  cardinality(defense) = 3
  and defense[1] is not null and btrim(defense[1]) <> '' and defense[1] <> '*'
  and defense[2] is not null and btrim(defense[2]) <> '' and defense[2] <> '*'
  and defense[3] is not null and btrim(defense[3]) <> ''
);
