import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { acknowledgePending, runSiegeBatch } from "../lib/siege-batch.js";

test("mantém estado, ignora aliadas e deduplica bases inimigas", async (context) => {
  const root = await mkdtemp(resolve(tmpdir(), "siege-batch-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const capturesDir = resolve(root, "captures");
  const catalogPath = resolve(root, "monsters.json");
  const stateFile = resolve(root, "state/state.json");
  const reportFile = resolve(root, "state/latest.json");
  await mkdir(capturesDir);
  await writeJson(catalogPath, {
    monsters: [
      monster(101, "Alpha", 1000),
      monster(201, "Alpha Permanente", 1000),
      monster(102, "Beta", 2000),
      monster(103, "Gamma", 3000),
      monster(104, "Delta", 4000),
    ],
  });
  await capture(capturesDir, 1000, "GetGuildSiegeParticipationInfo", {
    participation_info: { match_id: 9001, guild_id: 1 },
  });
  await capture(capturesDir, 1001, "GetGuildSiegeMatchupInfo", {
    match_info: { match_id: 9001 },
    guild_list: [
      { guild_id: 1, guild_name: "Nossa" },
      { guild_id: 2, guild_name: "Inimiga", color: "red" },
    ],
  });
  await capture(capturesDir, 1002, "GetGuildSiegeBaseDefenseUnitList", baseEvent(9001, 1, 1, [[101, 102, 103]]));
  await capture(capturesDir, 1003, "GetGuildSiegeBaseDefenseUnitList", baseEvent(9001, 7, 2, [
    [101, 102, 103],
    [101, 102, 104],
  ]));

  const options = { capturesDir, catalogPath, stateFile, reportFile };
  const first = await runSiegeBatch(options);
  assert.equal(first.totals.alliedBasesIgnored, 1);
  assert.equal(first.totals.enemyBasesQueued, 1);
  assert.equal(first.actionableBases[0].baseNumber, 7);
  assert.equal(first.actionableBases[0].enemySide, "red");
  assert.equal(first.actionableBases[0].defenses[0].display, "Alpha / Beta / Gamma");

  const second = await runSiegeBatch(options);
  assert.equal(second.totals.enemyBasesQueued, 0);
  assert.equal(second.totals.alreadyProcessedFiles, 2);
  assert.equal(second.totals.pendingBases, 1);
  assert.equal(second.actionableBases.length, 1);

  assert.equal(await acknowledgePending(stateFile), 1);
  const acknowledged = await runSiegeBatch(options);
  assert.equal(acknowledged.totals.pendingBases, 0);
  assert.equal(acknowledged.actionableBases.length, 0);

  await capture(capturesDir, 1004, "GetGuildSiegeBaseDefenseUnitList", baseEvent(9001, 7, 2, [
    [101, 102, 103],
    [101, 102, 104],
  ], 100));
  const duplicate = await runSiegeBatch(options);
  assert.equal(duplicate.totals.unchangedEnemyBases, 1);
  assert.equal(duplicate.totals.enemyBasesQueued, 0);
  assert.equal(duplicate.totals.pendingBases, 0);

  await capture(capturesDir, 1005, "GetGuildSiegeBaseDefenseUnitList", baseEvent(9001, 7, 2, [
    [201, 102, 103],
    [201, 102, 104],
  ], 200));
  const equivalent = await runSiegeBatch(options);
  assert.equal(equivalent.totals.equivalentEnemyBases, 1);
  assert.equal(equivalent.totals.enemyBasesQueued, 0);
  assert.equal(equivalent.totals.pendingBases, 0);

  await capture(capturesDir, 1006, "GetGuildSiegeBaseDefenseUnitList", baseEvent(9001, 7, 2, [
    [201, 102, 103],
    [201, 103, 104],
  ], 300));
  const changed = await runSiegeBatch(options);
  assert.equal(changed.totals.enemyBasesQueued, 1);
  assert.equal(changed.actionableBases[0].changeType, "changed");
  assert.equal(changed.actionableBases[0].changes.added.length, 1);
  assert.equal(changed.actionableBases[0].changes.removed.length, 1);
  assert.equal(changed.actionableBases[0].changes.added[0], "Alpha Permanente / Gamma / Delta");
  assert.equal(changed.actionableBases[0].changes.removed[0], "Alpha Permanente / Beta / Delta");

  const persisted = JSON.parse(await readFile(stateFile, "utf8"));
  assert.equal(persisted.version, 1);
  assert.equal(Object.keys(persisted.bases).length, 1);
  assert.equal(JSON.parse(await readFile(reportFile, "utf8")).totals.enemyBasesQueued, 1);
});

test("isola a partida ativa e converte o número interno para o número visível", async (context) => {
  const root = await mkdtemp(resolve(tmpdir(), "siege-batch-match-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const capturesDir = resolve(root, "captures");
  const catalogPath = resolve(root, "monsters.json");
  const stateFile = resolve(root, "state/state.json");
  const reportFile = resolve(root, "state/latest.json");
  await mkdir(capturesDir);
  await writeJson(catalogPath, {
    monsters: [monster(101, "Alpha", 1000), monster(102, "Beta", 2000), monster(103, "Gamma", 3000)],
  });

  await capture(capturesDir, 1000, "GetGuildSiegeMatchupInfo", matchupEvent(8001));
  await capture(capturesDir, 1001, "GetGuildSiegeBaseDefenseUnitList", baseEvent(8001, 18, 2, [[101, 102, 103]]));
  await capture(capturesDir, 2000, "GetGuildSiegeMatchupInfo", matchupEvent(9001));
  await capture(capturesDir, 2001, "GetGuildSiegeBaseDefenseUnitList", baseEvent(9001, 18, 2, [[101, 102, 103]]));
  await capture(capturesDir, 2002, "GetGuildSiegeBaseDefenseUnitList", baseEvent(9001, 22, 2, [[101, 102, 103]]));

  const report = await runSiegeBatch({ capturesDir, catalogPath, stateFile, reportFile });
  assert.equal(report.matchId, 9001);
  assert.equal(report.totals.clickEvents, 3);
  assert.equal(report.totals.matchingClickEvents, 2);
  assert.equal(report.totals.crossMatchClickEventsIgnored, 1);
  assert.equal(report.totals.enemyBasesQueued, 2);
  assert.deepEqual(report.actionableBases.map((base) => base.displayBaseNumber), [4, 5]);
  assert.deepEqual(report.actionableBases.map((base) => base.restriction), ["open", "nat4"]);
});

function monster(com2us, name, skillGroupId) {
  return {
    name,
    canonicalName: name,
    element: "wind",
    externalIds: { com2us },
    skillGroupId,
  };
}

function baseEvent(matchId, baseNumber, guildId, teams, deckOffset = 0) {
  const assignments = [];
  const units = [];
  teams.forEach((team, teamIndex) => {
    const deckId = deckOffset + teamIndex + 1;
    const wizardId = guildId * 1000 + teamIndex;
    assignments.push({ match_id: matchId, base_number: baseNumber, deck_id: deckId, wizard_id: wizardId });
    team.forEach((unitMasterId, position) => {
      units.push({ deck_id: deckId, unit_info: { unit_master_id: unitMasterId }, pos_id: position + 1 });
    });
  });
  return {
    match_id: matchId,
    defense_deck_assign_list: assignments,
    defense_unit_list: units,
    wizard_info_list: assignments.map((assignment) => ({
      wizard_id: assignment.wizard_id,
      guild_id: guildId,
    })),
  };
}

function matchupEvent(matchId) {
  return {
    match_info: { match_id: matchId },
    guild_list: [
      { guild_id: 1, guild_name: "Nossa" },
      { guild_id: 2, guild_name: "Inimiga" },
    ],
    my_defense_deck_unit_list: [{ guild_id: 1, deck_id: 999 }],
    visible_base_number_list: [25, 26, 18, 22, 23],
    base_list: [
      { base_number: 18, base_type: 2, guild_id: 2 },
      { base_number: 22, base_type: 3, guild_id: 2 },
    ],
  };
}

async function capture(directory, timestamp, command, payload) {
  await writeJson(resolve(directory, `${timestamp}-${command}.json`), { command, ...payload });
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
