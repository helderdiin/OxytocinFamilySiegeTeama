-- Treat licensed collaboration monsters and their permanent Summoners War
-- counterparts as one logical monster. This map is generated from catalog
-- schema v4; the permanent Summoners War monster is always canonical.
create or replace function public.canonical_monster_id(p_id text)
returns text
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select coalesce(
    '{"altair":"frederic","aragorn-dark":"night-fang-dark","aragorn-light":"night-fang-light","aragorn":"night-fang","aragorn-wind":"night-fang-wind","bayek-dark":"salah","bayek-fire":"ashour","bayek-light":"ahmed","bayek":"omar","bayek-wind":"shahat","chun-li-dark":"vereesa","chun-li-fire":"berenice","chun-li-light":"leah","chun-li":"lariel","chun-li-wind":"cordelia","ciri-dark":"fiona","ciri-fire":"reyka","ciri-light":"birgitta","ciri":"rigna","ciri-wind":"tirsa","dhalsim-dark":"cayde","dhalsim-fire":"todd","dhalsim-light":"hekerson","dhalsim":"kyle","dhalsim-wind":"jarrett","eivor-dark":"sigrid","eivor-fire":"solveig","eivor-light":"berghild","eivor":"brita","eivor-wind":"astrid","espresso-cookie-dark":"lavender","espresso-cookie-fire":"hibiscus","espresso-cookie-light":"jasmine","espresso-cookie":"rosemary","espresso-cookie-wind":"chamomile","ezio-dark":"evan","ezio-fire":"patrick","ezio-light":"ian","ezio":"lionel","ezio-wind":"hector","fern-dark":"luen-dark","fern-fire":"luen-fire","fern-light":"luen-light","fern":"luen","fern-wind":"luen-wind","fire-aragorn":"night-fang-fire","frieren-dark":"freu-dark","frieren-fire":"freu-fire","frieren-light":"freu-light","frieren":"freu","frieren-wind":"freu-wind","frodo":"silver-tail","gandalf-dark":"old-wood-dark","gandalf":"old-wood-fire","gandalf-light":"old-wood-light","gandalf-wind":"old-wood-wind","geralt-dark":"valdemar","geralt-fire":"magnus","geralt-light":"lars","geralt":"anders","geralt-wind":"henrik","gingerbrave":"thomas","gollum-dark":"lob-ear-dark","gollum-fire":"lob-ear-fire","gollum-light":"lob-ear-light","gollum":"lob-ear","gollum-wind":"lob-ear-wind","gyomei-himejima":"black-tortoise-champion","heihachi-mishima":"daimon","himmel":"kiel","hollyberry-cookie-dark":"giselle","hollyberry-cookie-fire":"alice","hollyberry-cookie-light":"audrey","hollyberry-cookie":"manon","hollyberry-cookie-wind":"jade","hwoarang-dark":"taebaek-dark","hwoarang-fire":"taebaek-fire","hwoarang-light":"taebaek-light","hwoarang":"taebaek","hwoarang-wind":"taebaek-wind","inosuke-hashibira-dark":"white-tiger-blade-master-dark","inosuke-hashibira-fire":"white-tiger-blade-master-fire","inosuke-hashibira-light":"white-tiger-blade-master-light","inosuke-hashibira":"white-tiger-blade-master","inosuke-hashibira-wind":"white-tiger-blade-master-wind","jin-kazama-dark":"kai-dark","jin-kazama-fire":"kai-fire","jin-kazama-light":"kai-light","jin-kazama":"kai","jin-kazama-wind":"kai-wind","kassandra-dark":"kiara","kassandra-fire":"federica","kassandra-light":"aurelia","kassandra":"kalantatze","kassandra-wind":"eleni","ken":"bernadotte","legolas-dark":"elder-horn-dark","legolas-fire":"elder-horn-fire","legolas-light":"elder-horn-light","legolas":"elder-horn","legolas-wind":"elder-horn-wind","m-bison-dark":"gurkha","m-bison-fire":"karnal","m-bison-light":"craig","m-bison":"borgnine","m-bison-wind":"sagar","madeleine-cookie-dark":"truffle","madeleine-cookie-fire":"pave","madeleine-cookie-light":"fudge","madeleine-cookie":"ganache","madeleine-cookie-wind":"praline","megumi-fushiguro-dark":"tetsuya-dark","megumi-fushiguro-fire":"tetsuya-fire","megumi-fushiguro-light":"tetsuya-light","megumi-fushiguro":"tetsuya","megumi-fushiguro-wind":"tetsuya-wind","nezuko-kamado-dark":"vermilion-bird-dancer-dark","nezuko-kamado":"vermilion-bird-dancer-fire","nezuko-kamado-light":"vermilion-bird-dancer-light","nina-williams-dark":"shasha-dark","nina-williams-fire":"shasha-fire","nina-williams-light":"shasha-light","nina-williams":"shasha","nina-williams-wind":"shasha-wind","nobara-kugisaki-dark":"aya-dark","nobara-kugisaki-fire":"aya-fire","nobara-kugisaki-light":"aya-light","nobara-kugisaki":"aya","nobara-kugisaki-wind":"aya-wind","paul-phoenix-dark":"duke-dark","paul-phoenix-fire":"duke-fire","paul-phoenix-light":"duke-light","paul-phoenix":"duke","paul-phoenix-wind":"duke-wind","pure-vanilla-cookie-dark":"elena","pure-vanilla-cookie-fire":"lucia","pure-vanilla-cookie-light":"ariana","pure-vanilla-cookie":"adriana","pure-vanilla-cookie-wind":"angela","ryomen-sukuna":"hayato","ryu-dark":"vancliffe","ryu-fire":"douglas","ryu-light":"talisman","ryu":"moore","ryu-wind":"kashmir","satoru-gojo-dark":"werner-dark","satoru-gojo-fire":"werner-fire","satoru-gojo-light":"werner-light","satoru-gojo":"werner","satoru-gojo-wind":"werner-wind","stark-dark":"schporte-dark","stark-fire":"schporte-fire","stark-light":"schporte-light","stark":"schporte","stark-wind":"schporte-wind","tanjiro-kamado-dark":"azure-dragon-swordsman-dark","tanjiro-kamado-fire":"azure-dragon-swordsman-fire","tanjiro-kamado-light":"azure-dragon-swordsman-light","tanjiro-kamado":"azure-dragon-swordsman","tanjiro-kamado-wind":"azure-dragon-swordsman-wind","triss-dark":"celestara","triss-fire":"enshia","triss-light":"groa","triss":"lumina","triss-wind":"nobella","ubel-dark":"wieb-dark","ubel-fire":"wieb-fire","ubel-light":"wieb-light","ubel":"wieb","ubel-wind":"wieb-wind","water-gandalf":"old-wood","water-nezuko":"vermilion-bird-dancer","wind-nezuko":"vermilion-bird-dancer-wind","yennefer-dark":"hilda","yennefer-fire":"tarnisha","yennefer-light":"arcana","yennefer":"johanna","yennefer-wind":"hexarina","yuji-itadori-dark":"rick-dark","yuji-itadori-fire":"rick-fire","yuji-itadori-light":"rick-light","yuji-itadori":"rick","yuji-itadori-wind":"rick-wind","zenitsu":"qilin-slasher","zenitsu-agatsuma-dark":"qilin-slasher-dark","zenitsu-agatsuma":"qilin-slasher-fire","zenitsu-agatsuma-light":"qilin-slasher-light","wind-zenitsu":"qilin-slasher-wind"}'::jsonb ->> p_id,
    p_id
  );
$$;

create or replace function public.strategy_slot_sets(
  primary_ids text[],
  alternatives jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  slot_index integer;
  slot_set jsonb;
  result jsonb := '[]'::jsonb;
begin
  if cardinality(primary_ids) <> 3
    or jsonb_typeof(alternatives) <> 'array'
    or jsonb_array_length(alternatives) <> 3 then
    return null;
  end if;

  for slot_index in 0..2 loop
    select coalesce(jsonb_agg(option_id order by option_id), '[]'::jsonb)
      into slot_set
      from (
        select distinct public.canonical_monster_id(raw_option_id) as option_id
        from (
          select primary_ids[slot_index + 1] as raw_option_id
          union all
          select option.value
          from jsonb_array_elements_text(alternatives -> slot_index) as option(value)
        ) as slot_options
        where raw_option_id is not null and btrim(raw_option_id) <> ''
      ) as canonical_options;

    result := result || jsonb_build_array(slot_set);
  end loop;

  return result;
exception
  when others then
    return null;
end;
$$;

-- Recalculate stored fingerprints, merge duplicates, and keep the defense with
-- the most counters (seed records still win). Counter records are preserved.
alter table public.defenses
drop constraint if exists defenses_fingerprint_key;

update public.defenses
set monsters = monsters;

with counter_totals as (
  select strategy.defense_id, count(*) as counter_count
  from public.strategies as strategy
  group by strategy.defense_id
), ranked_defenses as (
  select
    defense.id,
    first_value(defense.id) over (
      partition by defense.fingerprint
      order by
        defense.is_seed desc,
        coalesce(counter_totals.counter_count, 0) desc,
        defense.created_at asc,
        defense.id asc
    ) as keeper_id
  from public.defenses as defense
  left join counter_totals on counter_totals.defense_id = defense.id
)
update public.strategies as strategy
set defense_id = ranked.keeper_id
from ranked_defenses as ranked
where strategy.defense_id = ranked.id
  and ranked.id <> ranked.keeper_id;

with duplicate_defenses as (
  select
    defense.id,
    row_number() over (
      partition by defense.fingerprint
      order by
        defense.is_seed desc,
        (select count(*) from public.strategies as strategy where strategy.defense_id = defense.id) desc,
        defense.created_at asc,
        defense.id asc
    ) as position
  from public.defenses as defense
)
delete from public.defenses as defense
using duplicate_defenses as duplicate
where defense.id = duplicate.id
  and duplicate.position > 1;

alter table public.defenses
add constraint defenses_fingerprint_key unique (fingerprint);

comment on function public.canonical_monster_id(text) is
  'Maps a licensed collaboration monster ID to its equivalent permanent Summoners War monster ID.';
comment on function public.strategy_composition_fingerprint(text[], jsonb) is
  'Canonical defense identity: slot order, option order, and licensed collaboration skins do not change the fingerprint.';

revoke all on function public.canonical_monster_id(text) from public, anon;
grant execute on function public.canonical_monster_id(text) to authenticated, service_role;
revoke all on function public.strategy_slot_sets(text[], jsonb) from public, anon;
grant execute on function public.strategy_slot_sets(text[], jsonb) to authenticated;

-- Trigger helpers are internal implementation details, not public RPCs.
revoke all on function public.sync_strategy_defense() from public, anon, authenticated, service_role;
revoke all on function public.propagate_defense_to_strategies() from public, anon, authenticated, service_role;
