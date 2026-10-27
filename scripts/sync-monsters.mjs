import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = resolve(root, "dist/data/monsters.json");
const imageDirectory = resolve(root, "dist/assets/monsters");
const apiRoot = "https://swarfarm.com/api/v2/monsters/";
const imageRoot = "https://swarfarm.com/static/herders/images/monsters/";
const validElements = new Set(["fire", "water", "wind", "light", "dark"]);

const localCatalog = JSON.parse(await readFile(catalogPath, "utf8"));
const remote = await fetchAllMonsters();
const playable = remote.filter((monster) =>
  monster.obtainable === true &&
  monster.awaken_level >= 1 &&
  validElements.has(String(monster.element).toLowerCase()) &&
  monster.image_filename
);

const remoteByFamily = Map.groupBy(playable, (monster) => monster.family_id);
const existingByCom2us = new Map(localCatalog.monsters.map((monster) => [monster.externalIds.com2us, monster]));
const usedIds = new Set(localCatalog.monsters.map((monster) => monster.id));
const merged = [...localCatalog.monsters];

for (const remoteMonster of playable) {
  const existingMonster = existingByCom2us.get(remoteMonster.com2us_id);
  if (existingMonster) {
    if (remoteMonster.awaken_level === 2) {
      existingMonster.image = `assets/monsters/${basename(remoteMonster.image_filename)}`;
      existingMonster.gameData.awakenLevel = remoteMonster.awaken_level;
    }
    continue;
  }
  const element = remoteMonster.element.toLowerCase();
  const id = uniqueId(remoteMonster, usedIds);
  usedIds.add(id);
  const forms = (remoteByFamily.get(remoteMonster.family_id) || [])
    .filter((form) => form.com2us_id !== remoteMonster.com2us_id)
    .map(toRelatedForm);
  merged.push({
    id,
    name: remoteMonster.awaken_level === 2 ? `${remoteMonster.name} 2A` : remoteMonster.name,
    canonicalName: remoteMonster.name,
    element,
    image: `assets/monsters/${basename(remoteMonster.image_filename)}`,
    aliases: remoteMonster.awaken_level === 2 ? [remoteMonster.name] : [],
    externalIds: { com2us: remoteMonster.com2us_id, swarfarm: remoteMonster.id },
    familyId: remoteMonster.family_id,
    skillGroupId: remoteMonster.skill_group_id,
    bestiarySlug: remoteMonster.bestiary_slug,
    gameData: {
      awakenLevel: remoteMonster.awaken_level,
      obtainable: remoteMonster.obtainable,
      relatedForms: forms,
    },
    identitySource: { providerId: "swarfarm", matchedBy: "name_and_element" },
  });
}

merged.sort((a, b) => a.name.localeCompare(b.name, "en") || a.element.localeCompare(b.element));
const deduplicated = [...new Map(merged.map((monster) => [monster.externalIds.com2us, monster])).values()];

await mkdir(imageDirectory, { recursive: true });
const missingImages = deduplicated.filter((monster) => !existsSync(resolve(root, "dist", monster.image)));
let downloaded = 0;
await runPool(missingImages, 8, async (monster) => {
  const remoteMonster = remote.find((item) => item.com2us_id === monster.externalIds.com2us);
  if (!remoteMonster?.image_filename) return;
  const response = await fetch(`${imageRoot}${encodeURIComponent(basename(remoteMonster.image_filename))}`, {
    headers: { "User-Agent": "OxytocinSiegeTeams/0.2 catalog sync" },
  });
  if (!response.ok) throw new Error(`Imagem ${remoteMonster.image_filename}: HTTP ${response.status}`);
  await writeFile(resolve(imageDirectory, basename(remoteMonster.image_filename)), Buffer.from(await response.arrayBuffer()));
  downloaded += 1;
  if (downloaded % 100 === 0) console.log(`${downloaded}/${missingImages.length} imagens baixadas`);
});

const output = {
  schemaVersion: 2,
  metadata: {
    identityProvider: "swarfarm",
    synchronizedAt: new Date().toISOString(),
    remoteRecordCount: remote.length,
    selection: "obtainable awakened monsters, including second awakenings",
  },
  monsters: deduplicated,
};
await writeFile(catalogPath, `${JSON.stringify(output, null, 2)}\n`);

console.log(JSON.stringify({
  remoteRecords: remote.length,
  playableRecords: playable.length,
  previousCatalog: localCatalog.monsters.length,
  currentCatalog: deduplicated.length,
  downloadedImages: downloaded,
}, null, 2));

async function fetchAllMonsters() {
  const first = await fetchPage(1);
  const pageSize = first.results.length;
  const pageCount = Math.ceil(first.count / pageSize);
  const pages = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) => fetchPage(index + 2)));
  return [first, ...pages].flatMap((page) => page.results);
}

async function fetchPage(page) {
  const response = await fetch(`${apiRoot}?page=${page}`, {
    headers: { "User-Agent": "OxytocinSiegeTeams/0.2 catalog sync" },
  });
  if (!response.ok) throw new Error(`SWARFARM página ${page}: HTTP ${response.status}`);
  return response.json();
}

function uniqueId(monster, used) {
  const base = slugify(monster.name);
  const element = String(monster.element).toLowerCase();
  const candidates = [
    base,
    `${base}-${element}`,
    monster.awaken_level === 2 ? `${base}-${element}-2a` : `${base}-${element}-${monster.com2us_id}`,
    `${base}-${element}-${monster.com2us_id}`,
  ];
  return candidates.find((candidate) => !used.has(candidate));
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toRelatedForm(monster) {
  return {
    com2usId: monster.com2us_id,
    swarfarmId: monster.id,
    awakenLevel: monster.awaken_level,
    obtainable: monster.obtainable,
    bestiarySlug: monster.bestiary_slug,
  };
}

async function runPool(items, concurrency, worker) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift());
  });
  await Promise.all(workers);
}
