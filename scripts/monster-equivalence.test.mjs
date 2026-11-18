import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { detectEquivalentMonsterGroups } from "../lib/monster-equivalence.js";
import { monsterForShare, teamSlots } from "../lib/share-preview.js";

const root = new URL("../", import.meta.url);
const catalog = JSON.parse(await readFile(new URL("dist/data/monsters.json", root), "utf8"));

function monster(overrides) {
  return {
    family_id: 29300,
    skill_group_id: 29300,
    com2us_id: 29315,
    element: "Dark",
    natural_stars: 4,
    awaken_level: 1,
    base_hp: 7380,
    base_attack: 581,
    base_defense: 379,
    speed: 106,
    crit_rate: 15,
    crit_damage: 50,
    resistance: 15,
    accuracy: 0,
    skill_ups_to_max: 12,
    leader_skill: { attribute: "Attack Speed", amount: 28, area: "Guild", element: null },
    ...overrides,
  };
}

test("liga a versão collab à versão original com a mesma assinatura de batalha", () => {
  const ciri = monster({ name: "Ciri" });
  const fiona = monster({
    name: "Fiona",
    family_id: 29700,
    com2us_id: 29715,
  });

  assert.deepEqual(detectEquivalentMonsterGroups([ciri, fiona]), [{
    key: "skill-29300-dark",
    skillGroupId: 29300,
    element: "dark",
    canonicalCom2usId: 29715,
    variantCom2usIds: [29715, 29315],
  }]);
});

test("não liga monstros que compartilham skill group mas têm stats diferentes", () => {
  const neal = monster({
    name: "Neal",
    family_id: 10100,
    skill_group_id: 10100,
    com2us_id: 10114,
    base_hp: 5700,
    base_attack: 368,
    base_defense: 232,
    speed: 101,
  });
  const fran = monster({
    name: "Fran",
    family_id: 19100,
    skill_group_id: 10100,
    com2us_id: 19114,
    base_hp: 5520,
    base_attack: 362,
    base_defense: 250,
    speed: 103,
  });

  assert.deepEqual(detectEquivalentMonsterGroups([neal, fran]), []);
});

test("não cria equivalência enquanto só existe uma das versões", () => {
  assert.deepEqual(detectEquivalentMonsterGroups([monster({ name: "Ciri" })]), []);
});

test("catálogo gerado mantém pares completos e uma única identidade canônica", () => {
  const paired = catalog.monsters.filter((entry) => entry.equivalence);
  const groups = Map.groupBy(paired, (entry) => entry.equivalence.key);

  assert.equal(groups.size, 188);
  for (const variants of groups.values()) {
    assert.equal(variants.length, 2);
    const canonicalId = variants[0].equivalence.canonicalId;
    assert.ok(variants.some((variant) => variant.id === canonicalId));
    assert.deepEqual(
      variants[0].equivalence.variantIds,
      variants.map((variant) => variant.id).sort((left, right) => (
        left === canonicalId ? -1 : right === canonicalId ? 1 : left.localeCompare(right)
      )),
    );
  }
});

test("Fiona e Ciri compartilham nome, retratos e identidade nas prévias", () => {
  const fiona = monsterForShare("ciri-dark");
  const [slot] = teamSlots(["ciri-dark"], [[], [], []], "defense");

  assert.equal(fiona.id, "fiona");
  assert.equal(fiona.displayName, "Fiona / Ciri");
  assert.equal(fiona.images.length, 2);
  assert.equal(slot.name, "Fiona / Ciri");
  assert.equal(slot.images.length, 2);
});

test("migração do banco contém exatamente os aliases gerados pelo catálogo", async () => {
  const sql = await readFile(new URL("supabase/migrations/20261118090000_collab_monster_equivalence.sql", root), "utf8");
  const encodedMap = sql.match(/select coalesce\(\s*'([^']+)'::jsonb ->> p_id/)?.[1];
  assert.ok(encodedMap, "mapa de aliases não encontrado na migração");

  const expected = Object.fromEntries(catalog.monsters
    .filter((entry) => entry.equivalence && entry.id !== entry.equivalence.canonicalId)
    .map((entry) => [entry.id, entry.equivalence.canonicalId]));
  assert.deepEqual(JSON.parse(encodedMap), expected);
});
