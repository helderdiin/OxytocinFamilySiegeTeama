#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { acknowledgePending, formatBatchReport, runSiegeBatch } from "../lib/siege-batch.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaults = {
  capturesDir: "~/Library/Application Support/com.diegomn.swexng/profiles/captures",
  catalogPath: resolve(root, "dist/data/monsters.json"),
  stateFile: resolve(root, ".siege-batch/state.json"),
  reportFile: resolve(root, ".siege-batch/latest.json"),
  dryRun: false,
  includePresets: false,
  ackAll: false,
  json: false,
  matchId: null,
};

try {
  const options = parseArgs(process.argv.slice(2), defaults);
  if (options.ackAll) {
    const matchId = options.matchId ?? await matchIdFromReport(options.reportFile);
    if (matchId === null) throw new Error("Não foi possível identificar o match_id da fila a confirmar.");
    const acknowledged = await acknowledgePending(options.stateFile, matchId);
    console.log(`Fila da partida ${matchId} confirmada: ${acknowledged} base(s) removida(s) dos pendentes.`);
    process.exit(0);
  }
  const report = await runSiegeBatch(options);
  console.log(options.json ? JSON.stringify(report, null, 2) : formatBatchReport(report));
} catch (error) {
  console.error(`Erro no Siege batch: ${error.message}`);
  process.exitCode = 1;
}

function parseArgs(args, options) {
  const result = { ...options };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--json") result.json = true;
    else if (argument === "--ack-all") result.ackAll = true;
    else if (argument === "--dry-run") result.dryRun = true;
    else if (argument === "--include-presets") result.includePresets = true;
    else if (argument === "--match-id") result.matchId = requiredInteger(args, ++index, argument);
    else if (argument === "--captures-dir") result.capturesDir = requiredValue(args, ++index, argument);
    else if (argument === "--catalog") result.catalogPath = requiredValue(args, ++index, argument);
    else if (argument === "--state-file") result.stateFile = requiredValue(args, ++index, argument);
    else if (argument === "--report-file") result.reportFile = requiredValue(args, ++index, argument);
    else if (argument === "--help" || argument === "-h") {
      console.log(`Uso: npm run siege:batch -- [opções]

Opções:
  --json                 Imprime o relatório como JSON
  --ack-all              Confirma a fila atual sem varrer novas capturas
  --dry-run              Não atualiza estado nem relatório
  --include-presets      Inclui eventos de bases aliadas em modo preset
  --match-id ID          Processa ou confirma somente esta partida
  --captures-dir CAMINHO Sobrescreve a pasta de capturas
  --catalog CAMINHO      Sobrescreve o catálogo de monstros
  --state-file CAMINHO   Sobrescreve o arquivo de estado
  --report-file CAMINHO  Sobrescreve o relatório da última execução`);
      process.exit(0);
    } else throw new Error(`Opção desconhecida: ${argument}`);
  }
  return result;
}

async function matchIdFromReport(path) {
  try {
    const report = JSON.parse(await readFile(path, "utf8"));
    return Number.isFinite(Number(report.matchId)) ? Number(report.matchId) : null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function requiredInteger(args, index, flag) {
  const value = requiredValue(args, index, flag);
  const number = Number(value);
  if (!Number.isInteger(number)) throw new Error(`${flag} exige um número inteiro.`);
  return number;
}

function requiredValue(args, index, flag) {
  const value = args[index];
  if (!value || value.startsWith("--")) throw new Error(`${flag} exige um caminho.`);
  return value;
}
