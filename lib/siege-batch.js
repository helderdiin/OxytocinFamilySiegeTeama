import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

const STATE_VERSION = 1;
const CLICK_COMMANDS = new Set([
  "GetGuildSiegeBaseDefenseUnitList",
  "GetGuildSiegeBaseDefenseUnitListPreset",
]);

export async function runSiegeBatch(options = {}) {
  const capturesDir = resolve(expandHome(options.capturesDir));
  const catalogPath = resolve(expandHome(options.catalogPath));
  const stateFile = resolve(expandHome(options.stateFile));
  const reportFile = resolve(expandHome(options.reportFile));
  const dryRun = Boolean(options.dryRun);
  const includePresets = Boolean(options.includePresets);
  const requestedMatchId = numeric(options.matchId);

  const [catalog, captures, previousState] = await Promise.all([
    loadCatalog(catalogPath),
    loadCaptureRecords(capturesDir),
    loadState(stateFile),
  ]);
  const state = structuredClone(previousState);
  const context = buildContext(captures);
  const targetMatchId = selectTargetMatchId(context, requestedMatchId);
  const allClickRecords = captures.filter((record) =>
    CLICK_COMMANDS.has(record.command) &&
    (includePresets || record.command !== "GetGuildSiegeBaseDefenseUnitListPreset")
  );
  const contextualizedClicks = allClickRecords.map((record) => ({
    record,
    eventContext: selectContext(context, record, targetMatchId),
  }));
  const clickRecords = targetMatchId === null
    ? []
    : contextualizedClicks.filter(({ eventContext }) => eventContext.matchId === targetMatchId);

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    capturesDir,
    stateFile,
    reportFile,
    matchId: targetMatchId,
    totals: {
      captureFiles: captures.length,
      clickEvents: allClickRecords.length,
      matchingClickEvents: clickRecords.length,
      crossMatchClickEventsIgnored: allClickRecords.length - clickRecords.length,
      newFiles: 0,
      alreadyProcessedFiles: 0,
      alliedBasesIgnored: 0,
      enemyBasesQueued: 0,
      pendingBases: 0,
      unchangedEnemyBases: 0,
      equivalentEnemyBases: 0,
      unknownBases: 0,
    },
    actionableBases: [],
    ignored: [],
    warnings: [],
  };

  for (const { record, eventContext } of clickRecords) {
    const contextFingerprint = hashJson({
      ownGuildId: eventContext.ownGuildId,
      matchupHash: eventContext.matchup?.hash || null,
      matchId: eventContext.matchId,
    });
    const priorFile = state.files[record.name];
    if (
      priorFile?.hash === record.hash &&
      (priorFile.outcome !== "unknown" || priorFile.contextFingerprint === contextFingerprint)
    ) {
      report.totals.alreadyProcessedFiles += 1;
      continue;
    }
    report.totals.newFiles += 1;

    const bases = normalizeClickEvent(record, eventContext, catalog);
    if (!bases.length) {
      report.totals.unknownBases += 1;
      report.ignored.push({
        sourceFile: record.name,
        reason: "invalid-event",
        detail: "O evento não contém uma base e defesas reconstruíveis.",
      });
      rememberFile(state, record, "unknown", contextFingerprint);
      continue;
    }

    let fileOutcome = "processed";
    for (const base of bases) {
      if (base.ownership === "ally") {
        report.totals.alliedBasesIgnored += 1;
        report.ignored.push({
          sourceFile: record.name,
          baseNumber: base.baseNumber,
          reason: "ally",
        });
        continue;
      }
      if (base.ownership !== "enemy") {
        fileOutcome = "unknown";
        report.totals.unknownBases += 1;
        report.ignored.push({
          sourceFile: record.name,
          baseNumber: base.baseNumber,
          reason: "unknown-ownership",
          detail: "Faltou identificar a guilda própria ou a guilda dona da defesa.",
        });
        continue;
      }

      const baseKey = [base.matchId || "unknown", base.guildId || "unknown", base.baseNumber].join(":");
      const previousBase = state.bases[baseKey];
      if (previousBase?.researchFingerprint === base.researchFingerprint) {
        if (previousBase.exactFingerprint === base.exactFingerprint) {
          report.totals.unchangedEnemyBases += 1;
          report.ignored.push({
            sourceFile: record.name,
            baseNumber: base.baseNumber,
            reason: "unchanged",
          });
        } else {
          report.totals.equivalentEnemyBases += 1;
          report.ignored.push({
            sourceFile: record.name,
            baseNumber: base.baseNumber,
            reason: "equivalent-change",
            detail: "Mudaram nomes/skins equivalentes, mas não a assinatura de pesquisa.",
          });
        }
        state.bases[baseKey] = toStoredBase(base, record.name);
        if (state.pending[baseKey]) {
          state.pending[baseKey] = {
            ...state.pending[baseKey],
            ...base,
            sourceFile: record.name,
          };
        }
        continue;
      }

      const changeType = previousBase ? "changed" : "new";
      const changes = diffCompositions(
        previousBase?.researchCompositions || [],
        base.researchCompositions,
        previousBase?.researchDisplay || {},
        base.researchDisplay,
      );
      state.pending[baseKey] = {
        ...base,
        baseKey,
        changeType,
        changes,
        sourceFile: record.name,
        queuedAt: new Date().toISOString(),
      };
      report.totals.enemyBasesQueued += 1;
      state.bases[baseKey] = toStoredBase(base, record.name);
    }
    rememberFile(state, record, fileOutcome, contextFingerprint);
  }

  report.actionableBases = Object.values(state.pending)
    .filter((base) => numeric(base.matchId) === targetMatchId)
    .sort((a, b) => Number(a.displayBaseNumber ?? a.baseNumber) - Number(b.displayBaseNumber ?? b.baseNumber));
  report.totals.pendingBases = report.actionableBases.length;
  state.updatedAt = report.generatedAt;
  state.lastRun = {
    generatedAt: report.generatedAt,
    actionableCount: report.actionableBases.length,
    clickEventCount: clickRecords.length,
    matchId: targetMatchId,
  };
  if (targetMatchId === null) {
    report.warnings.push("Nenhum match_id ativo foi identificado; nenhum clique foi processado.");
  } else if (!clickRecords.length) {
    report.warnings.push("Nenhum clique de base ativo foi encontrado nas capturas.");
  }
  if (!context.participations.length && !context.matchups.some((record) => inferOwnGuildId(record.data) !== null)) {
    report.warnings.push("Não foi possível identificar a guilda própria; a posse pode ficar desconhecida.");
  }

  if (!dryRun) {
    await Promise.all([
      writeJsonAtomic(stateFile, state),
      writeJsonAtomic(reportFile, report),
    ]);
  }
  return report;
}

export async function acknowledgePending(stateFile, matchId = null) {
  const path = resolve(expandHome(stateFile));
  const state = await loadState(path);
  const targetMatchId = numeric(matchId);
  const keys = Object.entries(state.pending)
    .filter(([, base]) => targetMatchId === null || numeric(base.matchId) === targetMatchId)
    .map(([key]) => key);
  for (const key of keys) delete state.pending[key];
  const acknowledged = keys.length;
  state.updatedAt = new Date().toISOString();
  state.lastAcknowledgement = { acknowledged, matchId: targetMatchId, acknowledgedAt: state.updatedAt };
  await writeJsonAtomic(path, state);
  return acknowledged;
}

export function formatBatchReport(report) {
  const { totals } = report;
  const lines = [
    "SIEGE BATCH",
    `Partida: ${report.matchId ?? "não identificada"}`,
    `Eventos de base: ${totals.clickEvents} | novos: ${totals.newFiles} | já processados: ${totals.alreadyProcessedFiles}`,
    `Eventos desta partida: ${totals.matchingClickEvents} | outras partidas ignoradas: ${totals.crossMatchClickEventsIgnored}`,
    `Inimigas novas/alteradas: ${totals.enemyBasesQueued} | pendentes totais: ${totals.pendingBases} | aliadas ignoradas: ${totals.alliedBasesIgnored}`,
    `Repetidas: ${totals.unchangedEnemyBases} | equivalentes: ${totals.equivalentEnemyBases} | posse desconhecida: ${totals.unknownBases}`,
  ];

  for (const base of report.actionableBases) {
    const restriction = base.restriction === "unknown" ? "RESTRIÇÃO DESCONHECIDA" : base.restriction.toUpperCase();
    const side = base.enemySide === "unknown" ? "INIMIGA" : `INIMIGA ${base.enemySide.toUpperCase()}`;
    lines.push("", `🏰 BASE ${base.displayBaseNumber ?? base.baseNumber} — ${restriction} — ${side}`);
    lines.push(`${base.deckCount} defesas | ${base.defenses.length} composições únicas | ${base.changeType === "new" ? "nova" : "alterada"}`);
    base.defenses.forEach((defense, index) => {
      const suffix = defense.occurrences > 1 ? ` — ${defense.occurrences}x` : "";
      lines.push(`${index + 1}. ${defense.display}${suffix}`);
    });
    if (base.changeType === "changed") {
      if (base.changes.added.length) lines.push(`Novas: ${base.changes.added.join(" | ")}`);
      if (base.changes.removed.length) lines.push(`Removidas: ${base.changes.removed.join(" | ")}`);
    }
  }
  for (const warning of report.warnings) lines.push("", `⚠️ ${warning}`);
  lines.push("", `Relatório: ${report.reportFile}`);
  return lines.join("\n");
}

async function loadCatalog(path) {
  const data = JSON.parse(await readFile(path, "utf8"));
  const byCom2us = new Map();
  for (const monster of data.monsters || []) {
    const id = Number(monster.externalIds?.com2us);
    if (Number.isFinite(id)) byCom2us.set(id, monster);
  }
  return byCom2us;
}

async function loadCaptureRecords(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") throw new Error(`Diretório de capturas não encontrado: ${directory}`);
    throw error;
  }
  const records = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const path = resolve(directory, entry.name);
    try {
      const [raw, metadata] = await Promise.all([readFile(path, "utf8"), stat(path)]);
      const data = JSON.parse(raw);
      records.push({
        name: entry.name,
        path,
        data,
        command: String(data.command || commandFromFilename(entry.name)),
        hash: createHash("sha256").update(raw).digest("hex"),
        timestamp: timestampFromFilename(entry.name) || metadata.mtimeMs,
      });
    } catch (error) {
      if (error instanceof SyntaxError) continue;
      throw error;
    }
  }
  return records.sort((a, b) => a.timestamp - b.timestamp || a.name.localeCompare(b.name));
}

function buildContext(captures) {
  return {
    participations: captures.filter((record) => record.command === "GetGuildSiegeParticipationInfo"),
    matchups: captures.filter((record) =>
      record.command === "GetGuildSiegeMatchupInfo" || record.command === "GetGuildSiegeMatchupInfoForFinished"
    ),
  };
}

function selectTargetMatchId(context, requestedMatchId) {
  if (requestedMatchId !== null) return requestedMatchId;
  const activeMatchup = [...context.matchups]
    .filter((record) => record.command === "GetGuildSiegeMatchupInfo")
    .sort((a, b) => b.timestamp - a.timestamp)[0];
  return extractMatchId(activeMatchup?.data);
}

function selectContext(context, clickRecord, preferredMatchId = null) {
  const directMatchId = extractMatchId(clickRecord.data);
  const nearbyMatchup = latestMatching(context.matchups, directMatchId, clickRecord.timestamp);
  const inferredMatchId = directMatchId || extractMatchId(nearbyMatchup?.data);
  const matchId = inferredMatchId || preferredMatchId;
  const participation = latestMatching(context.participations, matchId, clickRecord.timestamp);
  const matchup = latestMatching(context.matchups, matchId, clickRecord.timestamp);
  return {
    matchId: matchId || extractMatchId(matchup?.data) || null,
    ownGuildId: numeric((participation?.data.participation_info || {}).guild_id) ?? inferOwnGuildId(matchup?.data),
    matchup,
  };
}

function inferOwnGuildId(matchupData) {
  const candidates = arrayAt(matchupData, ["my_defense_deck_unit_list"])
    .map((deck) => numeric(deck.guild_id))
    .filter((value) => value !== null);
  return mostFrequent(candidates);
}

function latestMatching(records, matchId, sourceTimestamp) {
  const matching = matchId
    ? records.filter((record) => extractMatchId(record.data) === matchId)
    : records;
  if (!matching.length) return null;
  return [...matching].sort((a, b) => {
    const aDistance = Math.abs(a.timestamp - sourceTimestamp);
    const bDistance = Math.abs(b.timestamp - sourceTimestamp);
    return aDistance - bDistance || b.timestamp - a.timestamp;
  })[0];
}

function normalizeClickEvent(record, context, catalog) {
  const assignments = arrayAt(record.data, ["defense_deck_assign_list", "defense_deck_list"]);
  const baseNumbers = [...new Set(assignments.map(extractBaseNumber).filter(Number.isFinite))];
  if (!baseNumbers.length) return [];
  return baseNumbers.map((baseNumber) => normalizeBase(record, context, catalog, assignments, baseNumber));
}

function normalizeBase(record, context, catalog, assignments, baseNumber) {
  const baseAssignments = assignments.filter((assignment) => extractBaseNumber(assignment) === baseNumber);
  const deckIds = new Set(baseAssignments.map(extractDeckId).filter((value) => value !== null));
  const units = collectUnitRecords(record.data).filter((unit) => deckIds.has(extractDeckId(unit)));
  const unitsByDeck = groupBy(units, (unit) => String(extractDeckId(unit)));
  const wizardGuilds = new Map(
    arrayAt(record.data, ["wizard_info_list"]).map((wizard) => [String(wizard.wizard_id), numeric(wizard.guild_id)])
  );
  const guildCandidates = [];
  for (const assignment of baseAssignments) {
    const directGuild = numeric(assignment.guild_id);
    const wizardGuild = wizardGuilds.get(String(assignment.wizard_id));
    if (directGuild !== null) guildCandidates.push(directGuild);
    if (wizardGuild !== null && wizardGuild !== undefined) guildCandidates.push(wizardGuild);
  }
  if (!guildCandidates.length) {
    for (const wizard of arrayAt(record.data, ["wizard_info_list"])) {
      const guildId = numeric(wizard.guild_id);
      if (guildId !== null) guildCandidates.push(guildId);
    }
  }
  const guildId = mostFrequent(guildCandidates);
  const ownership = guildId === null || context.ownGuildId === null
    ? "unknown"
    : guildId === context.ownGuildId ? "ally" : "enemy";
  const matchupGuild = findGuild(context.matchup?.data, guildId);
  const enemySide = explicitEnemySide(matchupGuild);

  const deckTeams = baseAssignments.map((assignment, index) => {
    const deckId = extractDeckId(assignment);
    const deckUnits = [...(unitsByDeck.get(String(deckId)) || [])]
      .sort((a, b) => extractUnitPosition(a) - extractUnitPosition(b));
    const monsters = deckUnits.map((unit) => resolveMonster(extractUnitMasterId(unit), catalog));
    return {
      slot: extractAssignmentSlot(assignment) || index + 1,
      deckId,
      monsters,
      exactKey: monsters.map((monster) => monster.com2usId || monster.name).join(","),
      researchKey: monsters.map((monster) => monster.skillGroupId || monster.com2usId || monster.name).join(","),
      display: monsters.map((monster) => monster.name).join(" / ") || "Defesa não resolvida",
    };
  }).filter((deck) => deck.monsters.length);

  const grouped = new Map();
  for (const deck of deckTeams) {
    const existing = grouped.get(deck.exactKey) || {
      display: deck.display,
      monsters: deck.monsters,
      slots: [],
      deckIds: [],
      occurrences: 0,
      exactKey: deck.exactKey,
      researchKey: deck.researchKey,
    };
    existing.slots.push(deck.slot);
    existing.deckIds.push(deck.deckId);
    existing.occurrences += 1;
    grouped.set(deck.exactKey, existing);
  }
  const defenses = [...grouped.values()].sort((a, b) => Math.min(...a.slots) - Math.min(...b.slots));
  const exactCompositions = multiset(defenses, "exactKey");
  const researchCompositions = multiset(defenses, "researchKey");
  const researchDisplay = Object.fromEntries(defenses.map((defense) => [defense.researchKey, defense.display]));
  const restriction = detectRestriction(record.data, context.matchup?.data, baseNumber);
  const displayBaseNumber = resolveDisplayBaseNumber(context.matchup?.data, baseNumber);

  return {
    matchId: context.matchId,
    baseNumber,
    displayBaseNumber,
    ownership,
    guildId,
    guildName: matchupGuild?.guild_name || null,
    enemySide,
    restriction,
    deckCount: deckTeams.length,
    defenses: defenses.map(({ exactKey, researchKey, ...defense }) => defense),
    exactCompositions,
    researchCompositions,
    researchDisplay,
    exactFingerprint: hashJson({ baseNumber, guildId, restriction, compositions: exactCompositions }),
    researchFingerprint: hashJson({ baseNumber, guildId, restriction, compositions: researchCompositions }),
  };
}

function collectUnitRecords(data) {
  const direct = arrayAt(data, ["defense_unit_list", "defense_deck_unit_list"]);
  const nested = [];
  for (const deck of arrayAt(data, ["defense_deck_list"])) {
    const deckId = extractDeckId(deck);
    for (const unit of arrayAt(deck, ["unit_list", "defense_unit_list"])) {
      nested.push({ ...unit, deck_id: unit.deck_id ?? deckId });
    }
  }
  return [...direct, ...nested];
}

function resolveMonster(com2usId, catalog) {
  const monster = catalog.get(com2usId);
  return {
    name: monster?.canonicalName || monster?.name || `ID ${com2usId ?? "desconhecido"}`,
    element: monster?.element || null,
    com2usId,
    skillGroupId: numeric(monster?.skillGroupId),
  };
}

function detectRestriction(clickData, matchupData, baseNumber) {
  const candidates = [];
  for (const value of [clickData.base_type, clickData.restriction, clickData.base_rule]) {
    if (value !== undefined && value !== null) candidates.push(value);
  }
  const base = (matchupData?.base_list || []).find((item) => extractBaseNumber(item) === baseNumber);
  for (const value of [base?.base_type, base?.restriction, base?.base_rule]) {
    if (value !== undefined && value !== null) candidates.push(value);
  }
  for (const value of candidates) {
    if (numeric(value) === 3) return "nat4";
    if (numeric(value) === 2) return "open";
    const text = String(value).toLowerCase();
    if (/nat\s*4|4\s*star|four/.test(text)) return "nat4";
    if (/open|all|unrestricted|aberta/.test(text)) return "open";
  }
  return "unknown";
}

function resolveDisplayBaseNumber(matchupData, internalBaseNumber) {
  const base = arrayAt(matchupData, ["base_list"])
    .find((item) => extractBaseNumber(item) === internalBaseNumber);
  if (numeric(base?.base_type) === 1) return 1;
  const visible = arrayAt(matchupData, ["visible_base_number_list"])
    .map(numeric)
    .filter((value) => value !== null);
  const visibleIndex = visible.indexOf(internalBaseNumber);
  return visibleIndex >= 0 ? visibleIndex + 2 : internalBaseNumber;
}

function findGuild(matchupData, guildId) {
  if (!matchupData || guildId === null) return null;
  return (matchupData.guild_list || []).find((guild) => numeric(guild.guild_id) === guildId) || null;
}

function explicitEnemySide(guild) {
  if (!guild) return "unknown";
  for (const value of [guild.color, guild.guild_color, guild.team_color, guild.side]) {
    const text = String(value || "").toLowerCase();
    if (text.includes("yellow") || text.includes("amarelo")) return "yellow";
    if (text.includes("red") || text.includes("vermelho")) return "red";
  }
  return "unknown";
}

function diffCompositions(previous, current, previousDisplay = {}, currentDisplay = {}) {
  const before = countValues(previous);
  const after = countValues(current);
  return {
    added: expandCountDiff(after, before, currentDisplay),
    removed: expandCountDiff(before, after, previousDisplay),
  };
}

function expandCountDiff(primary, secondary, display) {
  const output = [];
  for (const [key, count] of primary) {
    const difference = count - (secondary.get(key) || 0);
    for (let index = 0; index < difference; index += 1) output.push(display[key] || key);
  }
  return output;
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function multiset(defenses, key) {
  return defenses.flatMap((defense) => Array(defense.occurrences).fill(defense[key])).sort();
}

function toStoredBase(base, sourceFile) {
  return {
    matchId: base.matchId,
    baseNumber: base.baseNumber,
    displayBaseNumber: base.displayBaseNumber,
    guildId: base.guildId,
    exactFingerprint: base.exactFingerprint,
    researchFingerprint: base.researchFingerprint,
    exactCompositions: base.exactCompositions,
    researchCompositions: base.researchCompositions,
    researchDisplay: base.researchDisplay,
    defenses: base.defenses,
    sourceFile,
    updatedAt: new Date().toISOString(),
  };
}

function rememberFile(state, record, outcome, contextFingerprint) {
  state.files[record.name] = {
    hash: record.hash,
    outcome,
    contextFingerprint,
    processedAt: new Date().toISOString(),
  };
}

async function loadState(path) {
  try {
    const state = JSON.parse(await readFile(path, "utf8"));
    if (state.version !== STATE_VERSION) throw new Error(`Versão de estado incompatível: ${state.version}`);
    state.files ||= {};
    state.bases ||= {};
    state.pending ||= {};
    return state;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { version: STATE_VERSION, createdAt: new Date().toISOString(), files: {}, bases: {}, pending: {} };
  }
}

async function writeJsonAtomic(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, path);
}

function extractMatchId(data) {
  const candidates = [
    data.match_id,
    data.match_info?.match_id,
    data.participation_info?.match_id,
    data.defense_deck_assign_list?.[0]?.match_id,
    data.guild_list?.[0]?.match_id,
    data.log_list?.[0]?.guild_info_list?.[0]?.match_id,
  ];
  return candidates.map(numeric).find((value) => value !== null) || null;
}

function extractBaseNumber(value) {
  return numeric(value?.base_number ?? value?.base_no ?? value?.baseNumber);
}

function extractDeckId(value) {
  return numeric(value?.deck_id ?? value?.defense_deck_id ?? value?.deckId);
}

function extractUnitPosition(value) {
  return numeric(value?.pos_id ?? value?.position ?? value?.slot_id) ?? Number.MAX_SAFE_INTEGER;
}

function extractUnitMasterId(value) {
  return numeric(
    value?.unit_master_id ??
    value?.unit_info?.unit_master_id ??
    value?.unit?.unit_master_id
  );
}

function extractAssignmentSlot(value) {
  return numeric(value?.pos_id ?? value?.deck_pos_id ?? value?.slot_id ?? value?.deck_number);
}

function arrayAt(object, keys) {
  for (const key of keys) if (Array.isArray(object?.[key])) return object[key];
  return [];
}

function numeric(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function mostFrequent(values) {
  if (!values.length) return null;
  const counts = countValues(values);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function groupBy(values, keyFn) {
  const groups = new Map();
  for (const value of values) {
    const key = keyFn(value);
    const group = groups.get(key) || [];
    group.push(value);
    groups.set(key, group);
  }
  return groups;
}

function hashJson(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function timestampFromFilename(name) {
  const match = basename(name).match(/^(\d+)-/);
  return match ? Number(match[1]) : null;
}

function commandFromFilename(name) {
  return basename(name).replace(/^\d+-/, "").replace(/\.json$/, "");
}

function expandHome(path) {
  if (!path) throw new Error("Caminho obrigatório não informado.");
  return path.startsWith("~/") ? resolve(process.env.HOME || "", path.slice(2)) : path;
}
