const STORAGE_KEYS = {
  user: "oxytocin-siege-user",
  strategies: "oxytocin-siege-strategies",
};
const MAX_SLOT_ALTERNATIVES = 4;

const seedStrategies = [
  {
    id: "seed-1",
    player: "MestreOx",
    attack: ["skogul", "chloe", "kahli"],
    defense: ["conrad", "robo-r40", "*"],
    safety: "safe",
    status: "proven",
    sections: {
      gamePlan: "Usar a proteção da Chloe para preparar o Skogul e eliminar a principal ameaça com a Kahli enquanto a pedra cai.",
      idealStats: "Chloe deve abrir o time. Kahli precisa de dano suficiente para finalizar o alvo prioritário.",
      turnOrder: "Chloe → Kahli → Skogul.",
      targetPriority: "Eliminar primeiro o monstro que ameaça remover a proteção ou controlar o Skogul.",
      thirdVariations: "Bom contra Conrad + ROBO-R40 + vários terceiros sem sustain pesado.",
      risks: "Nunca usar contra Hyanes + Vigor + Kinki ou contra strip consistente com anti-crítico.",
      substitutions: "A Kahli pode variar por outro nuker protegido, desde que mantenha a condição de abate.",
      evidence: "Vitória confirmada contra Conrad + ROBO-R40 + terceiro neutro.",
    },
    createdAt: "2026-10-22T18:30:00.000Z",
  },
  {
    id: "seed-2",
    player: "LunaSW",
    attack: ["ashour", "racuni", "talc"],
    defense: ["miles", "nora", "*"],
    safety: "situational",
    status: "recommended",
    sections: {
      gamePlan: "Direcionar a ameaça principal para o tanque elemental e sustentar a luta com Racuni.",
      idealStats: "Racuni rápido e resistente; o tanque precisa suportar a pressão prolongada.",
      turnOrder: "Ashour aplica pressão, Racuni acelera e limpa, Talc absorve o dano.",
      targetPriority: "Remover primeiro a fonte de dano que não é controlada pelo tanque.",
      thirdVariations: "O terceiro define qual tanque usar e pode exigir a variante com Nickel.",
      risks: "Evitar dano que ignore DEF ou ameaças que não possam ser direcionadas ao tanque escolhido.",
      substitutions: "Nickel pode substituir Talc contra ameaça Wind.",
      evidence: "A variante com Nickel venceu Tarnisha + Miles + Shahat.",
    },
    createdAt: "2026-10-24T21:10:00.000Z",
  },
  {
    id: "seed-3",
    player: "TheoBR",
    attack: ["seara", "orion", "perna"],
    defense: ["chandra", "byungchul", "*"],
    safety: "experimental",
    status: "needs_testing",
    sections: {
      gamePlan: "Ganhar a abertura com Orion, aplicar bomba com Seara e usar Perna para concluir o abate.",
      idealStats: "Orion deve ser o mais rápido; Seara joga antes de Perna.",
      turnOrder: "Orion S3 → Seara S2 → Perna no alvo principal.",
      targetPriority: "Focar o suporte ou reviver que ficar vulnerável após o strip.",
      thirdVariations: "Funciona melhor quando o terceiro não traz cleanse forte.",
      risks: "Evitar defesa muito rápida, anti-bomba ou com cleanse confiável.",
      substitutions: "Ainda não validado.",
      evidence: "Precisa de mais testes antes de ser recomendada pela guilda.",
    },
    createdAt: "2026-10-25T15:45:00.000Z",
  },
  {
    id: "seed-4",
    defenseId: "seed-defense-sylvia-daphnis-zenitsu",
    player: "KoBrAsw",
    attack: ["eladriel", "leo", "chow"],
    defense: ["sylvia", "daphnis", "wind-zenitsu"],
    attackAlternatives: [["briand"], [], []],
    defenseAlternatives: [["moore"], [], ["savannah"]],
    safety: "situational",
    status: "proven",
    sections: {
      gamePlan: "Leo limita a velocidade da luta para retirar a vantagem da abertura inimiga. Eladriel ou Briand mantém o time de pé e recupera uma peça abatida, enquanto Chow sustenta o dano até desmontar a defesa.",
      idealStats: "Use a lead de HP do Eladriel. Os valores da tabela são um piso para este matchup. Priorize artefato de dano recebido de Fogo no Eladriel e no Leo; no Chow, dano recebido de Vento. CD da S2 é valioso nos dois Dragon Knights, e recuperação da S2 ajuda o Eladriel.",
      referenceImage: {
        path: "assets/counter-references/eladriel-leo-chow-v1-original-assets.png",
        alt: "Counter de Eladriel ou Briand, Leo e Chow contra Sylvia ou Moore, Daphnis e Zenitsu Agatsuma ou Savannah",
        width: 1536,
        height: 1024,
        version: 1,
      },
      builds: [
        {
          monsterId: "eladriel",
          slot: 0,
          isAlternative: false,
          runes: "Violent / Will · HP% / HP% / RES%",
          hp: 28000,
          def: 850,
          spd: 40,
          res: 85,
          acc: 25,
          artifacts: "Redução de dano de Fogo / recuperação da S2",
        },
        {
          monsterId: "briand",
          slot: 0,
          isAlternative: true,
          artifacts: "Redução de dano de Fogo / precisão da S2",
        },
        {
          monsterId: "leo",
          slot: 1,
          isAlternative: false,
          runes: "Vampire / Destroy · ATK% / CD% / HP%",
          hp: 18000,
          atk: 700,
          def: 450,
          cr: 85,
          cd: 150,
          acc: 25,
          artifacts: "Redução de dano de Fogo / dano crítico da S2",
        },
        {
          monsterId: "chow",
          slot: 2,
          isAlternative: false,
          runes: "Violent / Destroy · ATK% / CD% / HP%",
          hp: 20000,
          atk: 700,
          def: 550,
          cr: 85,
          cd: 150,
          artifacts: "Redução de dano de Vento / dano crítico da S2",
        },
      ],
      turnOrder: "Sem ordem rígida por causa da passiva do Leo. Priorize a recuperação com Eladriel ou Briand, use Leo para controlar o ritmo e deixe Chow converter a vantagem em abates.",
      targetPriority: "Daphnis primeiro para remover a maior ameaça de explosão. Depois elimine Zenitsu ou Savannah e deixe Sylvia ou Moore por último quando a luta estiver estabilizada.",
      thirdVariations: "Pensado para Sylvia ou Moore + Daphnis + Wind Zenitsu ou Savannah. Confirme o terceiro defensor antes de escolher a variação do reviver.",
      risks: "O plano perde muita segurança se Eladriel ou Briand cair antes de usar o revive. Evite quando o reviver não suportar a abertura ou quando a defesa tiver controle suficiente para impedir a recuperação.",
      substitutions: "Briand pode ocupar o slot do Eladriel apenas quando o Eladriel não estiver disponível. É uma alternativa de disponibilidade, não uma escolha por status ou build.",
      evidence: "Testado e comprovado por mais de um membro da guilda. KoBrAsw trouxe o counter a partir da recomendação de um youtuber conhecido.",
    },
    createdAt: "2026-10-27T14:00:00.000Z",
  },
  {
    id: "seed-5",
    player: "Mittus",
    attack: ["platy", "shihwa", "elucia"],
    defense: ["morris", "orion", "trevor"],
    safety: "safe",
    status: "proven",
    sections: {
      gamePlan: "Use a lead de 24% SPD da Platy para entrar no ciclo com segurança. Shihwa e Elucia 2A alternam sono e congelamento sobre Trevor, enquanto Platy sustenta o time com cura, aumento de ATB, strip, controle de cooldown e revive. Com Trevor fora da rotação, elimine Orion e depois Morris antes de finalizar Trevor.",
      idealStats: "Use a lead de 24% SPD da Platy e mantenha o trio no tick 5, na ordem Platy → Shihwa → Elucia 2A. Os valores da tabela são pisos de referência para este matchup: Platy e Elucia precisam sobreviver à abertura e Shihwa não pode sacrificar toda a durabilidade para causar dano.",
      referenceImage: {
        path: "assets/counter-references/platy-shihwa-elucia-v1-original-assets.png",
        alt: "Counter de Platy, Shihwa e Elucia 2A contra Morris, Orion e Trevor",
        width: 1536,
        height: 1024,
        version: 1,
      },
      builds: [
        {
          monsterId: "platy",
          slot: 0,
          isAlternative: false,
          runes: "Violent / Will · SPD / HP% / RES%",
          speedTune: "Tick 5 · referência +149 SPD",
          hp: 30000,
          def: 700,
          res: 100,
          acc: 45,
          artifacts: "Redução de dano de Água / recuperação da S2",
        },
        {
          monsterId: "shihwa",
          slot: 1,
          isAlternative: false,
          runes: "Violent / Destroy · SPD / CR% / HP%",
          speedTune: "Tick 5 · referência +144 SPD",
          hp: 20000,
          atk: 1000,
          def: 700,
          acc: 45,
          artifacts: "Redução de dano de Água / dano da S3",
        },
        {
          monsterId: "elucia",
          slot: 2,
          isAlternative: false,
          runes: "Violent / Will · SPD / HP% / HP%",
          speedTune: "Tick 5 · referência +141 SPD",
          hp: 25000,
          atk: 500,
          def: 700,
          res: 70,
          artifacts: "Redução de dano de Água / recuperação da S2",
        },
      ],
      turnOrder: "Platy → Shihwa → Elucia 2A como referência. Platy pressiona Orion com a S3 quando possível; Shihwa coloca Trevor para dormir e ganha o turno extra; Elucia mantém Trevor dormindo ou congelado, ou guarda a S2 para limpar e recuperar o aliado afetado pelo Orion. Mais importante que uma sequência rígida é nunca liberar Trevor.",
      targetPriority: "Orion → Morris → Trevor. Remover Orion reduz strip, DEF Break e a variação da abertura; depois elimine Morris para impedir sustain e revive. Trevor fica controlado e morre por último, evitando ativar cedo o pico da passiva e o contra-ataque da S2.",
      thirdVariations: "Registro validado especificamente contra Morris + Orion + Trevor em torre Nat4. O plano depende de Trevor ser a ameaça mantida sob controle; não extrapole automaticamente para uma defesa com imunidade, cleanse ou passivas anti-controle.",
      risks: "Não use se Shihwa e Elucia não tiverem velocidade e durabilidade para manter Trevor travado. Procs Violent de Orion ou Morris, uma falha de controle, imunidade inesperada ou Trevor saindo do sono já abaixo de 30% podem disparar a S2 e o contra-ataque e virar a luta. Evite dano incidental em Trevor enquanto ele estiver dormindo e não o deixe com pouca vida antes de Orion e Morris morrerem.",
      substitutions: "Sem substituição comprovada nesta variação. Há registros do núcleo Platy + Shihwa com Iona ou Betta, mas a troca muda sustain, controle e recuperação; não trate essas opções como equivalentes à Elucia 2A sem testar.",
      evidence: "Comprovado pela guilda. Uma base comunitária documenta a mesma defesa e confirma o núcleo Platy + Shihwa, o controle do Trevor e a ordem Orion → Morris → Trevor; bases de Siege G3 também registram Shihwa + Elucia 2A juntas em ataques.",
    },
    createdAt: "2026-10-27T15:00:00.000Z",
  },
];

const elementNames = {
  water: "Água",
  fire: "Fogo",
  wind: "Vento",
  light: "Luz",
  dark: "Trevas",
  neutral: "Neutro",
};

const safetyNames = {
  very_safe: "Muito seguro",
  safe: "Seguro",
  situational: "Situacional",
  experimental: "Experimental",
};

const statusNames = {
  proven: "Testada",
  recommended: "Recomendada",
  needs_testing: "Precisa de testes",
};

const sectionDefinitions = [
  ["gamePlan", "Plano de jogo", "primary"],
  ["idealStats", "Observações de build", ""],
  ["turnOrder", "Ordem de turno", ""],
  ["targetPriority", "Prioridade de alvo", ""],
  ["thirdVariations", "Variações do terceiro monstro", ""],
  ["risks", "Riscos — nunca use contra", "warning"],
  ["substitutions", "Substituições possíveis", ""],
  ["evidence", "Experiência comprovada", ""],
];

const buildStatDefinitions = [
  { key: "runes", label: "Runas", kind: "text", placeholder: "Violent / Will", maxLength: 80 },
  { key: "speedTune", label: "Ajuste de SPD", kind: "text", placeholder: "Tick 5 / sem prioridade", maxLength: 80 },
  { key: "hp", label: "HP", hint: "bônus", kind: "bonus", step: 100, max: 200000 },
  { key: "atk", label: "ATK", hint: "bônus", kind: "bonus", step: 50, max: 10000 },
  { key: "def", label: "DEF", hint: "bônus", kind: "bonus", step: 50, max: 10000 },
  { key: "spd", label: "SPD", hint: "bônus", kind: "bonus", step: 1, max: 1000 },
  { key: "cr", label: "CR", hint: "total", kind: "percent", step: 1, max: 100 },
  { key: "cd", label: "CD", hint: "total", kind: "percent", step: 1, max: 400 },
  { key: "res", label: "RES", hint: "total", kind: "percent", step: 1, max: 100 },
  { key: "acc", label: "ACC", hint: "total", kind: "percent", step: 1, max: 100 },
  { key: "artifacts", label: "Artefatos", kind: "text", placeholder: "Redução de dano / recuperação da S2", maxLength: 180 },
];

let currentUser = localStorage.getItem(STORAGE_KEYS.user) || "";
let activeSafety = "all";
let activeStatus = "all";
let activeElement = "all";
let strategies = [];
let currentUserId = null;
let monsters = [];
let monsterById = new Map();
let monsterByName = new Map();
let pickerSlot = null;
let selection = emptySelection();
let buildDraft = new Map();
let dialogDefenseId = null;
let editingStrategyId = null;
let editingCommentId = null;
let approvedNewDefenseFingerprint = null;
let pendingDefenseMatches = [];

function readShareLocation() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const counterMatch = path.match(/^\/counter\/([23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/i);
  const defenseMatch = path.match(/^\/defense\/([23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/i);
  return {
    strategy: counterMatch?.[1] || null,
    defense: defenseMatch?.[1] || null,
  };
}

const initialShareLocation = readShareLocation();
let sharedStrategyId = initialShareLocation.strategy;
let sharedDefenseKey = initialShareLocation.defense;
let selectedDefenseId = null;
let sharedStrategyOpened = false;

const $ = (selector) => document.querySelector(selector);
const loginScreen = $("#loginScreen");
const appShell = $("#appShell");
const strategyDialog = $("#strategyDialog");
const monsterDialog = $("#monsterDialog");
const database = window.oxytocinDb;
const cloudEnabled = Boolean(database?.isConfigured());

function configureCollaborativeMode() {
  [$("#openFormButton"), $("#emptyAddButton")].forEach((button) => {
    if (!button) return;
    button.disabled = false;
    button.removeAttribute("aria-disabled");
    button.removeAttribute("title");
  });
}

function readStoredStrategies() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.strategies));
    const records = Array.isArray(parsed) ? parsed : parsed?.strategies;
    return Array.isArray(records) ? records : seedStrategies;
  } catch {
    return seedStrategies;
  }
}

function migrateStrategies(records) {
  return records.map((strategy) => {
    const { notes, ...rest } = strategy;
    const attack = [toMonsterId(strategy.attack[0]), toMonsterId(strategy.attack[1]), toMonsterId(strategy.attack[2] || "*")];
    const defense = [toMonsterId(strategy.defense[0]), toMonsterId(strategy.defense[1]), toMonsterId(strategy.defense[2] || "*")];
    const attackAlternatives = normalizeSlotAlternatives(strategy.attackAlternatives || strategy.attack_alternatives, attack);
    const defenseAlternatives = normalizeSlotAlternatives(strategy.defenseAlternatives || strategy.defense_alternatives, defense);
    return {
      ...rest,
      shortId: strategy.shortId || strategy.short_id || fallbackShortId(strategy.id),
      defenseId: strategy.defenseId || strategy.defense_id || `local:${compositionFingerprint(defense, defenseAlternatives)}`,
      defenseShortId: strategy.defenseShortId || strategy.defense_short_id || fallbackShortId(strategy.defenseId || strategy.defense_id || compositionFingerprint(defense, defenseAlternatives)),
      attack,
      defense,
      attackAlternatives,
      defenseAlternatives,
      safety: safetyNames[strategy.safety] ? strategy.safety : "situational",
      status: statusNames[strategy.status] ? strategy.status : "needs_testing",
      comments: Array.isArray(strategy.comments) ? strategy.comments.map(normalizeComment) : [],
      edits: Array.isArray(strategy.edits) ? strategy.edits.map(normalizeStrategyEdit) : [],
      sections: {
        gamePlan: strategy.sections?.gamePlan || notes || "",
        idealStats: strategy.sections?.idealStats || "",
        builds: normalizeBuildRecommendations(strategy.sections?.builds, attack, attackAlternatives),
        videoUrl: normalizeYouTubeUrl(strategy.sections?.videoUrl),
        referenceImage: normalizeReferenceImage(strategy.sections?.referenceImage),
        turnOrder: strategy.sections?.turnOrder || "",
        targetPriority: strategy.sections?.targetPriority || "",
        thirdVariations: strategy.sections?.thirdVariations || "",
        risks: strategy.sections?.risks || "",
        substitutions: strategy.sections?.substitutions || "",
        evidence: strategy.sections?.evidence || "",
      },
    };
  });
}

function fallbackShortId(id) {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const source = String(id || "local");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  let result = "";
  for (let index = 0; index < 8; index += 1) {
    hash = Math.imul(hash ^ (hash >>> 13), 2246822519) >>> 0;
    result += alphabet[hash % alphabet.length];
  }
  return result;
}

function strategyByShareKey(key) {
  const normalizedKey = String(key || "").trim().toUpperCase();
  if (!normalizedKey) return null;
  return strategies.find((strategy) => String(strategy.shortId || "").toUpperCase() === normalizedKey) || null;
}

function defenseByShareKey(key) {
  const normalizedKey = String(key || "").trim().toUpperCase();
  if (!normalizedKey) return null;
  return strategies.find((strategy) => String(strategy.defenseShortId || "").toUpperCase() === normalizedKey) || null;
}

function normalizeReferenceImage(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const path = typeof value.path === "string" ? value.path.trim() : "";
  const alt = typeof value.alt === "string" ? value.alt.trim() : "";
  const version = Number(value.version);
  if (!/^assets\/counter-references\/[a-z0-9][a-z0-9-]*\.png$/.test(path)) return null;
  if (!alt || alt.length > 240) return null;
  if (Number(value.width) !== 1536 || Number(value.height) !== 1024) return null;
  if (!Number.isInteger(version) || version < 1) return null;
  return { path, alt, width: 1536, height: 1024, version };
}

function compositionFingerprint(primaryIds, alternatives = [[], [], []]) {
  const slotSets = [0, 1, 2].map((index) => (
    [...new Set([
      toMonsterId(primaryIds[index] || "*"),
      ...(alternatives[index] || []).map(toMonsterId),
    ].filter(Boolean))].sort()
  ));
  return JSON.stringify(slotSets.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))));
}

function slotSets(primaryIds, alternatives = [[], [], []]) {
  return [0, 1, 2].map((index) => new Set([
    toMonsterId(primaryIds[index] || "*"),
    ...(alternatives[index] || []).map(toMonsterId),
  ].filter(Boolean)));
}

const slotPermutations = [
  [0, 1, 2], [0, 2, 1], [1, 0, 2],
  [1, 2, 0], [2, 0, 1], [2, 1, 0],
];

function defenseSimilarity(left, right) {
  const leftSlots = slotSets(left.defense, left.defenseAlternatives);
  const rightSlots = slotSets(right.defense, right.defenseAlternatives);
  return slotPermutations.reduce((best, permutation) => {
    const score = leftSlots.reduce((result, slot, index) => {
      const candidate = rightSlots[permutation[index]];
      const hasOverlap = [...slot].some((id) => candidate.has(id));
      const isExact = slot.size === candidate.size && [...slot].every((id) => candidate.has(id));
      return {
        matchingSlots: result.matchingSlots + Number(hasOverlap),
        exactSlots: result.exactSlots + Number(isExact),
      };
    }, { matchingSlots: 0, exactSlots: 0 });
    if (score.matchingSlots > best.matchingSlots) return score;
    if (score.matchingSlots === best.matchingSlots && score.exactSlots > best.exactSlots) return score;
    return best;
  }, { matchingSlots: 0, exactSlots: 0 });
}

function emptySelection() {
  return {
    attack: [null, null, "*"],
    defense: [null, null, "*"],
    attackAlternatives: [[], [], []],
    defenseAlternatives: [[], [], []],
  };
}

function normalizeSlotAlternatives(value, primaryIds) {
  const slots = Array.isArray(value) ? value : [[], [], []];
  const seen = new Set(primaryIds.filter((id) => id && id !== "*"));
  return [0, 1, 2].map((slotIndex) => {
    if (!primaryIds[slotIndex] || primaryIds[slotIndex] === "*") return [];
    const normalized = [];
    const options = Array.isArray(slots[slotIndex]) ? slots[slotIndex] : [];
    options.forEach((value) => {
      const id = toMonsterId(value);
      if (!id || id === "*" || seen.has(id) || normalized.length >= MAX_SLOT_ALTERNATIVES) return;
      seen.add(id);
      normalized.push(id);
    });
    return normalized;
  });
}

function attackMonsterReferences(attack, alternatives = [[], [], []]) {
  return [0, 1, 2].flatMap((slot) => {
    const primaryId = attack[slot];
    if (!primaryId || primaryId === "*") return [];
    return [
      { monsterId: primaryId, slot, isAlternative: false },
      ...(alternatives[slot] || []).map((monsterId) => ({ monsterId, slot, isAlternative: true })),
    ];
  });
}

function sanitizeBuildValue(value, definition) {
  if (definition.kind === "text") return String(value || "").trim().slice(0, definition.maxLength);
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.min(Math.round(number), definition.max);
}

function buildHasContent(build) {
  return buildStatDefinitions.some((definition) => {
    const value = build?.[definition.key];
    return definition.kind === "text" ? Boolean(String(value || "").trim()) : Number.isFinite(value);
  });
}

function normalizeBuildRecommendations(value, attack, alternatives) {
  const source = Array.isArray(value) ? value : [];
  const sourceByMonster = new Map(source.map((build) => [String(build?.monsterId || build?.monster_id || ""), build]));
  return attackMonsterReferences(attack, alternatives).map((reference) => {
    const raw = sourceByMonster.get(reference.monsterId) || {};
    const normalized = { ...reference };
    buildStatDefinitions.forEach((definition) => {
      normalized[definition.key] = sanitizeBuildValue(raw[definition.key], definition);
    });
    return normalized;
  }).filter(buildHasContent);
}

function alternativeKey(side) {
  return `${side}Alternatives`;
}

function normalizeComment(comment) {
  return {
    id: comment?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    strategyId: comment?.strategyId || comment?.strategy_id || "",
    authorId: comment?.authorId || comment?.author_id || null,
    author: String(comment?.author || comment?.author_name || "Membro da guilda"),
    body: String(comment?.body || "").trim(),
    videoUrl: normalizeYouTubeUrl(comment?.videoUrl || comment?.video_url),
    reaction: comment?.reaction === 1 || comment?.reaction === -1 ? comment.reaction : null,
    createdAt: comment?.createdAt || comment?.created_at || new Date().toISOString(),
    updatedAt: comment?.updatedAt || comment?.updated_at || null,
  };
}

function normalizeStrategyEdit(edit) {
  return {
    id: edit?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    strategyId: edit?.strategyId || edit?.strategy_id || "",
    editorId: edit?.editorId || edit?.editor_id || null,
    editor: String(edit?.editor || edit?.editor_name || "Membro da guilda"),
    editedAt: edit?.editedAt || edit?.edited_at || new Date().toISOString(),
  };
}

function toMonsterId(value) {
  if (!value || value === "*") return value;
  if (monsterById.has(value)) return monsterById.get(value).id;
  return monsterByName.get(normalize(value))?.id || value;
}

function saveStrategies() {
  if (cloudEnabled) return;
  localStorage.setItem(STORAGE_KEYS.strategies, JSON.stringify({ schemaVersion: 10, strategies }));
}

function updateStorageUi(mode) {
  const chip = $("#syncChip");
  chip.classList.toggle("cloud", mode === "cloud");
  chip.classList.toggle("error", mode === "error");
  $("#syncLabel").textContent = mode === "cloud" ? "Sincronizado" : mode === "error" ? "Supabase indisponível" : "Salvo neste dispositivo";
  $("#footerStorageLabel").textContent = mode === "cloud" ? "v0.32 · Supabase" : "v0.32 · dados locais";
}

async function connectCloudUser() {
  currentUserId = await database.ensureUser(currentUser);
  const [strategyRows, defenseShortIds, comments, edits] = await Promise.all([
    database.listStrategies(),
    database.listDefenseShortIds(),
    database.listComments(),
    database.listStrategyEdits(),
  ]);
  const defenseShortIdById = new Map(defenseShortIds.map((item) => [item.id, item.shortId]));
  const commentsByStrategy = new Map();
  comments.forEach((comment) => {
    if (!commentsByStrategy.has(comment.strategyId)) commentsByStrategy.set(comment.strategyId, []);
    commentsByStrategy.get(comment.strategyId).push(normalizeComment(comment));
  });
  const editsByStrategy = new Map();
  edits.forEach((edit) => {
    if (!editsByStrategy.has(edit.strategyId)) editsByStrategy.set(edit.strategyId, []);
    editsByStrategy.get(edit.strategyId).push(normalizeStrategyEdit(edit));
  });
  strategies = migrateStrategies(strategyRows).map((strategy) => ({
    ...strategy,
    defenseShortId: defenseShortIdById.get(strategy.defenseId) || strategy.defenseShortId,
    comments: commentsByStrategy.get(strategy.id) || [],
    edits: editsByStrategy.get(strategy.id) || [],
  }));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function icon(name, className = "") {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6" />',
    chevron: '<path d="m9 18 6-6-6-6" />',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" /><path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.14-1.14" />',
    plus: '<path d="M12 5v14M5 12h14" />',
    close: '<path d="M18 6 6 18M6 6l12 12" />',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" />',
    edit: '<path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" />',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />',
    comment: '<path d="M21 12a8 8 0 0 1-8 8H6l-4 2 1.5-5A8.5 8.5 0 1 1 21 12Z" />',
    thumbsUp: '<path d="M7 10v10H3V10h4Zm0 9c2.5 1.3 5.1 2 7.8 2H17a3 3 0 0 0 2.9-2.3l1-4A3 3 0 0 0 18 11h-4l.7-3.3A3.1 3.1 0 0 0 11.6 4L7 10v9Z" />',
    thumbsDown: '<path d="M17 14V4h4v10h-4Zm0-9c-2.5-1.3-5.1-2-7.8-2H7a3 3 0 0 0-2.9 2.3l-1 4A3 3 0 0 0 6 13h4l-.7 3.3a3.1 3.1 0 0 0 3.1 3.7l4.6-6V5Z" />',
    play: '<path d="m9 7 8 5-8 5V7Z" /><circle cx="12" cy="12" r="9" />',
    external: '<path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />',
    crown: '<path d="m4 7 4.2 4L12 5l3.8 6L20 7l-1.5 11h-13L4 7Z" /><path d="M6 14h12" />',
  };
  return `<svg class="${className}" aria-hidden="true" viewBox="0 0 24 24">${paths[name] || ""}</svg>`;
}

function compactText(value, fallback, maxLength = 150) {
  const text = String(value || "").trim() || fallback;
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function searchTokens(value) {
  return normalize(value).match(/[a-z0-9]+/g) || [];
}

function youtubeVideoId(value) {
  const candidate = String(value || "").trim();
  if (!candidate) return "";
  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
    let videoId = "";
    if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    else if (["youtube.com", "youtube-nocookie.com"].includes(host)) {
      const parts = url.pathname.split("/").filter(Boolean);
      videoId = url.pathname === "/watch"
        ? url.searchParams.get("v") || ""
        : ["embed", "shorts", "live"].includes(parts[0]) ? parts[1] || "" : "";
    }
    return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : "";
  } catch {
    return "";
  }
}

function normalizeYouTubeUrl(value) {
  const videoId = youtubeVideoId(value);
  return videoId ? `https://youtu.be/${videoId}` : "";
}

function monsterAwakenLevel(monster) {
  return Number(monster.gameData?.awakenLevel || 0);
}

function monsterBaseName(monster) {
  return String(monster.canonicalName || monster.name || "").replace(/\s+2A$/i, "").trim();
}

function monsterVariantKey(monster) {
  return `${normalize(monsterBaseName(monster))}|${monster.element}`;
}

function displayMonsterName(monster) {
  const name = String(monster.name || monster.canonicalName || monster.id).replace(/\s+2A$/i, "").trim();
  return monsterAwakenLevel(monster) === 2 ? `${name} 2A` : name;
}

function monsterLeaderSkill(monster) {
  return monster?.gameData?.leaderSkill || null;
}

function leaderSkillAssetFilename(skill) {
  if (!skill?.attribute) return "";
  const attribute = String(skill.attribute).trim().replaceAll(" ", "_");
  const area = String(skill.area || "General");
  const element = String(skill.element || "");
  const suffix = area === "Element" && element
    ? `_${element.charAt(0).toUpperCase()}${element.slice(1).toLowerCase()}`
    : ["Arena", "Dungeon", "Guild"].includes(area) ? `_${area}` : "";
  return `leader_skill_${attribute}${suffix}.png`;
}

function leaderSkillImage(skill, className = "") {
  const filename = leaderSkillAssetFilename(skill);
  if (!filename) return "";
  return `<img class="${escapeHtml(className)}" src="./assets/ui/leader-skills/${escapeHtml(filename)}" alt="" aria-hidden="true" loading="lazy" />`;
}

function elementBadgeImage(monster) {
  if (!["water", "fire", "wind", "light", "dark"].includes(monster?.element)) return "";
  return `<img class="monster-element-badge" src="./assets/ui/elements/${escapeHtml(monster.element)}.png" alt="" aria-hidden="true" loading="lazy" />`;
}

function monsterPortraitFrame(monster, imageClass, { isLeader = false, loading = false } = {}) {
  const displayName = displayMonsterName(monster);
  const portrait = monster.image
    ? `<img class="${escapeHtml(imageClass)}" src="./${escapeHtml(monster.image)}" alt=""${loading ? ' loading="lazy"' : ""} />`
    : `<span class="${escapeHtml(imageClass)} fallback-avatar">${escapeHtml(displayName.slice(0, 2).toUpperCase())}</span>`;
  const skill = isLeader ? monsterLeaderSkill(monster) : null;
  return `<span class="monster-portrait-frame${isLeader ? " is-leader" : ""}">${portrait}${elementBadgeImage(monster)}${skill ? leaderSkillImage(skill, "leader-slot-image") : ""}</span>`;
}

function leaderSkillDescription(monster) {
  return monsterLeaderSkill(monster)?.description || `${displayMonsterName(monster)} não possui Leader Skill.`;
}

function leaderSkillSummary(strategy, side, compact = false) {
  const primaryId = strategy?.[side]?.[0];
  if (!primaryId || primaryId === "*") return "";
  const alternativeIds = strategy?.[alternativeKey(side)]?.[0] || [];
  const entries = [primaryId, ...alternativeIds].map((id, index) => {
    const monster = getMonster(id);
    const skill = monsterLeaderSkill(monster);
    return `
      <span class="leader-skill-entry${skill ? "" : " is-empty"}">
        <span class="leader-skill-icon" aria-hidden="true">${skill ? leaderSkillImage(skill) : ""}</span>
        <span class="leader-skill-copy"><strong>${index ? "Alternativa · " : ""}${escapeHtml(displayMonsterName(monster))}</strong><span>${escapeHtml(leaderSkillDescription(monster))}</span></span>
      </span>`;
  }).join("");
  return `
    <span class="leader-skill-strip${compact ? " is-compact" : ""}" aria-label="Leader Skill do slot 1">
      <span class="leader-skill-label"><span>Leader Skill</span></span>
      <span class="leader-skill-entries">${entries}</span>
    </span>`;
}

function prepareMonsterCatalog(records) {
  const preferredByVariant = new Map();

  for (const monster of records) {
    const key = monsterVariantKey(monster);
    const current = preferredByVariant.get(key);
    if (!current || monsterAwakenLevel(monster) > monsterAwakenLevel(current)) preferredByVariant.set(key, monster);
  }

  const preferred = [...preferredByVariant.values()];
  const byId = new Map();
  const byName = new Map();

  for (const monster of records) {
    const selected = preferredByVariant.get(monsterVariantKey(monster));
    byId.set(monster.id, selected);
    for (const name of [monster.name, monster.canonicalName, displayMonsterName(monster), ...(monster.aliases || [])]) {
      if (name) byName.set(normalize(name), selected);
    }
  }

  return { preferred, byId, byName };
}

function getMonster(id) {
  if (id === "*") return { id: "*", name: "Qualquer monstro", element: "neutral", image: null, externalIds: {} };
  return monsterById.get(id) || { id, name: id, element: "neutral", image: null, externalIds: {} };
}

function showApp() {
  loginScreen.hidden = true;
  appShell.hidden = false;
  $("#currentUser").textContent = currentUser;
  $("#avatar").textContent = currentUser.charAt(0).toUpperCase();
  render();
}

function render() {
  const monsterTokens = searchTokens($("#searchInput")?.value || "");
  const detailTokens = searchTokens($("#detailSearchInput")?.value || "");
  const activeStrategies = strategies.filter((strategy) => strategy.isActive !== false);
  const visibleStrategies = activeStrategies.filter((strategy) => {
    const matchesSafety = activeSafety === "all" || strategy.safety === activeSafety;
    const matchesStatus = activeStatus === "all" || strategy.status === activeStatus;
    const defenseText = strategy.defense.map((id) => {
      const monster = getMonster(id);
      return [monster.id, monster.name, monster.canonicalName, ...(monster.aliases || [])].join(" ");
    });
    const attackText = strategy.attack.map((id) => {
      const monster = getMonster(id);
      return [monster.id, monster.name, monster.canonicalName, ...(monster.aliases || [])].join(" ");
    });
    const alternativeText = [...(strategy.attackAlternatives || []).flat(), ...(strategy.defenseAlternatives || []).flat()].map((id) => {
      const monster = getMonster(id);
      return [monster.id, monster.name, monster.canonicalName, ...(monster.aliases || [])].join(" ");
    });
    const sectionText = Object.entries(strategy.sections || {}).flatMap(([key, value]) => (
      key === "builds" && Array.isArray(value)
        ? value.flatMap((build) => [displayMonsterName(getMonster(build.monsterId)), ...Object.values(build)])
        : [value]
    ));
    const feedbackText = (strategy.comments || []).flatMap((comment) => [comment.author, comment.body]);
    const monsterHaystack = normalize([...defenseText, ...attackText, ...alternativeText].join(" "));
    const detailHaystack = normalize([strategy.player, safetyNames[strategy.safety], statusNames[strategy.status], ...sectionText, ...feedbackText].join(" "));
    const matchesMonsters = monsterTokens.every((token) => monsterHaystack.includes(token));
    const matchesDetails = detailTokens.every((token) => detailHaystack.includes(token));
    return matchesSafety && matchesStatus && matchesMonsters && matchesDetails;
  });
  const allGroups = groupStrategiesByDefense(activeStrategies);
  const visibleGroups = groupStrategiesByDefense(visibleStrategies);

  const sharedStrategy = strategyByShareKey(sharedStrategyId);
  const sharedDefense = defenseByShareKey(sharedDefenseKey);
  if (!selectedDefenseId && sharedStrategy) {
    selectedDefenseId = sharedStrategy.defenseId || null;
  } else if (!selectedDefenseId && sharedDefense) {
    selectedDefenseId = sharedDefense.defenseId || null;
  }
  const selectedGroup = allGroups.find((group) => group.id === selectedDefenseId);
  const isDefenseView = Boolean(selectedGroup);

  $("#totalStrategies").textContent = activeStrategies.length;
  $("#totalDefenses").textContent = allGroups.length;
  $("#totalPlayers").textContent = new Set(activeStrategies.map((item) => normalize(item.player))).size;
  $("#catalogView").hidden = isDefenseView;
  $("#resultsHeading").hidden = isDefenseView;
  $("#defenseViewIntro").hidden = !isDefenseView;
  $("#strategyList").classList.toggle("is-catalog", !isDefenseView);
  $("#strategyList").classList.toggle("is-defense-detail", isDefenseView);

  if (isDefenseView) {
    $("#defenseViewIntro").innerHTML = defenseDossier(selectedGroup);
    $("#strategyList").innerHTML = defenseCounterList(selectedGroup);
    $("#emptyState").hidden = true;
  } else {
    $("#defenseViewIntro").innerHTML = "";
    $("#strategyList").innerHTML = visibleGroups.map(defenseCatalogCard).join("");
    $("#emptyState").hidden = visibleGroups.length > 0;
    const counterLabel = `${visibleStrategies.length} ${visibleStrategies.length === 1 ? "counter" : "counters"}`;
    const defenseLabel = `${visibleGroups.length} ${visibleGroups.length === 1 ? "defesa" : "defesas"}`;
    $("#resultCount").textContent = `${defenseLabel} · ${counterLabel}`;
  }

  if (sharedStrategyId && !sharedStrategyOpened) {
    const sharedCard = [...document.querySelectorAll("[data-strategy-id]")].find((card) => card.dataset.strategyId === sharedStrategy?.id);
    if (sharedCard) {
      sharedStrategyOpened = true;
      sharedCard.open = true;
      sharedCard.classList.add("shared-strategy");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const topbarHeight = $(".topbar")?.getBoundingClientRect().height || 0;
        const cardTop = window.scrollY + sharedCard.getBoundingClientRect().top;
        const targetTop = Math.max(0, cardTop - topbarHeight - 16);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: targetTop, behavior: reduceMotion ? "auto" : "smooth" });
      }));
    }
  }
}

function defenseCatalogCard(group, index) {
  const count = group.strategies.length;
  const provenCount = group.strategies.filter((strategy) => strategy.status === "proven").length;
  const bestStrategy = group.strategies[0];
  const title = defenseDisplayTitle(group.defense);
  return `
    <button class="defense-catalog-card" data-open-defense-id="${escapeHtml(group.id)}" type="button" aria-label="Abrir defesa ${escapeHtml(title)}">
      <span class="defense-card-topline">
        <span class="defense-type">Defesa da Siege</span>
        <span class="defense-number">${String(index + 1).padStart(2, "0")}</span>
      </span>
      <span class="defense-card-team defense-team"><span class="monsters">${teamComposition(group.defense, "defense", true)}</span></span>
      <span class="defense-card-title">${escapeHtml(title)}</span>
      <span class="defense-card-footer">
        <span><strong>${count}</strong> ${count === 1 ? "counter" : "counters"}</span>
        <span>${provenCount ? `${provenCount} ${provenCount === 1 ? "testado" : "testados"}` : statusNames[bestStrategy.status]}</span>
        <span class="defense-card-action">Abrir dossiê ${icon("arrow")}</span>
      </span>
    </button>`;
}

function defenseCounterList(group) {
  const count = group.strategies.length;
  const countLabel = `${count} ${count === 1 ? "counter disponível" : "counters disponíveis"}`;
  return `
    <section class="defense-counter-section" aria-labelledby="counter-heading">
      <header class="defense-counter-heading">
        <div><h2 id="counter-heading">Counters possíveis <span>${count}</span></h2><p>Compare rapidamente segurança, risco e ordem de turno antes de abrir o guia completo.</p></div>
        <button class="add-counter-button" data-add-counter-defense-id="${escapeHtml(group.id)}" type="button">${icon("plus")}<span>Adicionar outro counter</span></button>
      </header>
      <div class="counter-stack detail-counter-stack" aria-label="${countLabel}">
        ${group.strategies.map((strategy, index) => strategyCard(strategy, index + 1)).join("")}
      </div>
    </section>`;
}

function defenseDossier(group) {
  const count = group.strategies.length;
  const provenCount = group.strategies.filter((strategy) => strategy.status === "proven").length;
  const title = defenseDisplayTitle(group.defense);
  return `
    <section class="defense-detail-shell" aria-labelledby="defenseTitle">
      <nav class="defense-detail-actions" aria-label="Navegação da defesa">
        <button class="back-to-catalog" data-back-catalog type="button">${icon("arrow")}<span>Todas as defesas</span></button>
        <button class="copy-defense-link" data-copy-defense-id="${escapeHtml(group.id)}" type="button">${icon("link")}<span>Copiar link</span></button>
      </nav>
      <article class="defense-dossier">
        <div class="defense-dossier-copy">
          <span class="defense-type">Dossiê da defesa</span>
          <h1 id="defenseTitle">${escapeHtml(title)}</h1>
          <p>Confira as opções já testadas pela guilda e escolha o counter que melhor encaixa nas suas builds disponíveis.</p>
          <div class="dossier-metrics" aria-label="Resumo da defesa">
            <span><strong>${count}</strong>${count === 1 ? " counter" : " counters"}</span>
            <span><strong>${provenCount}</strong>${provenCount === 1 ? " testado" : " testados"}</span>
          </div>
        </div>
        <div class="dossier-team defense-team">
          <span class="team-label">Time inimigo</span>
          <div class="monsters">${teamComposition(group.defense, "defense")}</div>
        </div>
      </article>
    </section>`;
}

function defenseDisplayTitle(strategy) {
  const alternatives = strategy.defenseAlternatives || [[], [], []];
  return strategy.defense.map((id, index) => {
    if (id === "*") return "Qualquer terceiro";
    return [id, ...(alternatives[index] || [])]
      .map((monsterId) => displayMonsterName(getMonster(monsterId)))
      .join(" ou ");
  }).join(" · ");
}

function groupStrategiesByDefense(records) {
  const groups = new Map();
  records.forEach((strategy) => {
    const key = strategy.defenseId || `local:${compositionFingerprint(strategy.defense, strategy.defenseAlternatives)}`;
    if (!groups.has(key)) groups.set(key, { id: key, defense: strategy, strategies: [] });
    groups.get(key).strategies.push(strategy);
  });
  const statusPriority = { proven: 3, recommended: 2, needs_testing: 1 };
  const safetyPriority = { very_safe: 4, safe: 3, situational: 2, experimental: 1 };
  return [...groups.values()].map((group) => ({
    ...group,
    strategies: group.strategies.sort((left, right) => {
      const leftScore = (statusPriority[left.status] || 0) * 10 + (safetyPriority[left.safety] || 0);
      const rightScore = (statusPriority[right.status] || 0) * 10 + (safetyPriority[right.safety] || 0);
      return rightScore - leftScore || new Date(right.createdAt) - new Date(left.createdAt);
    }),
  }));
}

function defenseGroupCard(group) {
  const count = group.strategies.length;
  const countLabel = `${count} ${count === 1 ? "counter disponível" : "counters disponíveis"}`;
  return `
    <section class="defense-group" data-defense-id="${escapeHtml(group.id)}">
      <header class="defense-group-header">
        <div class="team defense-team defense-group-team">
          <span class="team-label">Defesa encontrada</span>
          <div class="monsters">${teamComposition(group.defense, "defense")}</div>
        </div>
        <div class="defense-group-actions">
          <span class="counter-count">${countLabel}</span>
          <button class="add-counter-button" data-add-counter-defense-id="${escapeHtml(group.id)}" type="button">${icon("plus")}<span>Adicionar outro counter</span></button>
        </div>
      </header>
      <div class="counter-stack" aria-label="${countLabel}">
        ${group.strategies.map((strategy, index) => strategyCard(strategy, index + 1)).join("")}
      </div>
    </section>`;
}

function strategyCard(strategy, counterIndex) {
  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(strategy.createdAt));
  const canDelete = cloudEnabled ? strategy.ownerId === currentUserId && !strategy.isSeed : strategy.player === currentUser;
  const safetyClass = ["very_safe", "safe"].includes(strategy.safety) ? "safe" : "caution";
  const statusClass = strategy.status === "proven" ? "proven" : strategy.status === "recommended" ? "safe" : "caution";
  const flexibleDefense = strategy.defense[2] === "*";
  const fit = compactText(
    strategy.sections?.thirdVariations,
    flexibleDefense ? "Terceiro defensor flexível; valide os riscos abaixo." : "Matchup específico para os três defensores acima."
  );
  const risk = compactText(strategy.sections?.risks, "Nenhum risco específico foi informado.");
  const turnOrder = compactText(strategy.sections?.turnOrder, "Ordem de turno ainda não informada.");
  const comments = [...(strategy.comments || [])].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const positiveCount = comments.filter((comment) => comment.reaction === 1).length;
  const negativeCount = comments.filter((comment) => comment.reaction === -1).length;
  const commentCount = comments.length;
  const commentLabel = `${commentCount} ${commentCount === 1 ? "comentário" : "comentários"}`;
  return `
    <details class="strategy-card" data-strategy-id="${escapeHtml(strategy.id)}">
      <summary class="strategy-summary">
        <div class="card-topline">
          <div class="strategy-badges">
            <span class="counter-index">Opção ${counterIndex}</span>
            <span class="strategy-badge ${safetyClass}">${safetyNames[strategy.safety]}</span>
            <span class="strategy-badge ${statusClass}">${statusNames[strategy.status]}</span>
          </div>
          <span class="strategy-source">Por <strong>${escapeHtml(strategy.player)}</strong> · <time datetime="${strategy.createdAt}">${date}</time></span>
        </div>
        <div class="counter-composition">
          <div class="team attack-team">
            <span class="team-label">Counter ${counterIndex}</span>
            <div class="monsters">${teamComposition(strategy, "attack")}</div>
          </div>
        </div>
        <div class="decision-strip">
          <article class="decision-item fit-signal"><span>Serve quando</span><p>${escapeHtml(fit)}</p></article>
          <article class="decision-item risk-signal"><span>Risco crítico</span><p>${escapeHtml(risk)}</p></article>
          <article class="decision-item turn-signal"><span>Ordem de turno</span><p>${escapeHtml(turnOrder)}</p></article>
        </div>
        <span class="open-hint">
          <span>Ver plano completo</span>
          <span class="open-hint-meta">
            ${positiveCount ? `<span class="compact-reaction positive">+${positiveCount}</span>` : ""}
            ${negativeCount ? `<span class="compact-reaction negative">−${negativeCount}</span>` : ""}
            <span class="compact-comment-count">${icon("comment")} ${commentLabel}</span>
            ${icon("chevron", "expand-icon")}
          </span>
        </span>
      </summary>
      <div class="strategy-details">
        <div class="playbook-heading"><p class="eyebrow">GUIA DE EXECUÇÃO</p><h3>Como montar e pilotar</h3></div>
        ${buildRecommendationsTable(strategy)}
        <div class="strategy-overview">${sectionDefinitions.map(([key, title, className]) => detailSection(title, strategy.sections?.[key], className, key)).join("")}</div>
        ${strategyVideo(strategy)}
        ${strategyReferenceImage(strategy)}
        ${strategyEditHistory(strategy)}
        ${strategyFeedback(strategy, comments, positiveCount, negativeCount)}
        <div class="card-footer">
          <span>Cadastrado por ${escapeHtml(strategy.player)} em ${date}</span>
          <div class="card-actions">
            <button class="edit-button" data-edit-id="${escapeHtml(strategy.id)}" type="button">${icon("edit")}<span>Editar counter</span></button>
            <button class="share-button" data-share-id="${escapeHtml(strategy.id)}" type="button">${icon("link")}<span>Copiar link</span></button>
            ${canDelete ? `<button class="delete-button" data-delete-id="${escapeHtml(strategy.id)}" type="button">${icon("trash")}<span>Excluir</span></button>` : ""}
          </div>
        </div>
      </div>
    </details>`;
}

function strategyEditHistory(strategy) {
  const edits = [...(strategy.edits || [])].sort((left, right) => new Date(right.editedAt) - new Date(left.editedAt));
  if (!edits.length) return "";
  return `
    <section class="strategy-edit-history" aria-labelledby="edit-history-${escapeHtml(strategy.id)}">
      <div class="edit-history-heading">${icon("history")}<h4 id="edit-history-${escapeHtml(strategy.id)}">Histórico de colaboração</h4></div>
      <ol>${edits.map((edit) => {
        const date = new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(edit.editedAt));
        return `<li><strong>${escapeHtml(edit.editor)}</strong> editou em <time datetime="${escapeHtml(edit.editedAt)}">${date}</time></li>`;
      }).join("")}</ol>
    </section>`;
}

function strategyReferenceImage(strategy) {
  const reference = normalizeReferenceImage(strategy.sections?.referenceImage);
  if (!reference) return "";
  const strategyId = escapeHtml(strategy.id);
  const imageUrl = `./${escapeHtml(reference.path)}?v=${reference.version}`;
  return `
    <section class="strategy-reference" aria-labelledby="reference-title-${strategyId}">
      <div class="strategy-reference-heading">
        <div><h4 id="reference-title-${strategyId}">Guia visual do counter</h4><p>Resumo tático para revisar composição, execução e builds antes do ataque.</p></div>
        <a href="${imageUrl}" target="_blank" rel="noopener noreferrer">${icon("external")}<span>Abrir em tamanho completo</span></a>
      </div>
      <figure class="strategy-reference-figure">
        <a href="${imageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Abrir guia visual em tamanho completo">
          <img src="${imageUrl}" alt="${escapeHtml(reference.alt)}" width="${reference.width}" height="${reference.height}" loading="lazy" decoding="async" />
        </a>
        <figcaption>Referência rápida da guilda · ${reference.width} × ${reference.height} px</figcaption>
      </figure>
    </section>`;
}

function strategyVideo(strategy) {
  const videoId = youtubeVideoId(strategy.sections?.videoUrl);
  if (!videoId) return "";
  const watchUrl = `https://youtu.be/${videoId}`;
  return `
    <section class="strategy-video" aria-labelledby="video-title-${escapeHtml(strategy.id)}">
      <div class="strategy-video-heading">
        <div><h4 id="video-title-${escapeHtml(strategy.id)}">Vídeo da luta</h4><p>Veja a execução completa deste counter antes de entrar na batalha.</p></div>
        <a href="${watchUrl}" target="_blank" rel="noopener noreferrer">${icon("play")}<span>Abrir no YouTube</span></a>
      </div>
      <div class="strategy-video-frame">
        <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0" title="Vídeo de demonstração do counter" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
    </section>`;
}

function strategyFeedback(strategy, comments, positiveCount, negativeCount) {
  const strategyId = escapeHtml(strategy.id);
  const commentsMarkup = comments.length
    ? comments.map(commentItem).join("")
    : `<div class="feedback-empty">${icon("comment")}<p><strong>Ainda não há feedback.</strong><span>Se você testar esta composição, conte para a guilda como foi.</span></p></div>`;
  return `
    <section class="feedback-section" aria-labelledby="feedback-title-${strategyId}">
      <div class="feedback-heading">
        <div>
          <h4 id="feedback-title-${strategyId}">Feedback da guilda</h4>
          <p>O +1 ou −1 é opcional e sempre acompanha um comentário.</p>
        </div>
        <div class="feedback-totals" aria-label="${positiveCount} feedbacks positivos e ${negativeCount} feedbacks negativos">
          <span class="feedback-total positive">${icon("thumbsUp")}<strong>${positiveCount}</strong></span>
          <span class="feedback-total negative">${icon("thumbsDown")}<strong>${negativeCount}</strong></span>
        </div>
      </div>
      <div class="comment-list" aria-label="Comentários da guilda">${commentsMarkup}</div>
      <form class="comment-form" data-comment-form data-strategy-id="${strategyId}">
        <div class="comment-field-heading"><label for="comment-${strategyId}">Adicionar feedback</label><span data-comment-counter>0/500</span></div>
        <textarea id="comment-${strategyId}" name="body" rows="3" minlength="1" maxlength="500" required placeholder="Conte o que aconteceu na luta, o que funcionou ou qual foi o risco real."></textarea>
        <label class="comment-video-field" for="comment-video-${strategyId}">
          <span class="comment-video-label"><strong>Vídeo do ataque</strong><small>opcional</small></span>
          <input id="comment-video-${strategyId}" name="videoUrl" type="url" inputmode="url" maxlength="200" autocomplete="url" placeholder="https://youtu.be/ID_DO_VIDEO" />
          <small>Grave a luta, envie ao seu próprio YouTube como <em>Não listado</em> e cole o link aqui.</small>
        </label>
        <div class="comment-form-footer">
          <fieldset class="reaction-picker">
            <legend>Resultado <span>opcional</span></legend>
            <div class="reaction-options">
              <label class="reaction-choice neutral"><input type="radio" name="reaction" value="" checked><span>Só comentar</span></label>
              <label class="reaction-choice positive"><input type="radio" name="reaction" value="1"><span>${icon("thumbsUp")} +1 Funcionou</span></label>
              <label class="reaction-choice negative"><input type="radio" name="reaction" value="-1"><span>${icon("thumbsDown")} −1 Não funcionou</span></label>
            </div>
          </fieldset>
          <button class="button button-primary comment-submit" type="submit">Publicar feedback</button>
        </div>
      </form>
    </section>`;
}

function commentItem(comment) {
  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(comment.createdAt));
  const updatedDate = comment.updatedAt
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(comment.updatedAt))
    : "";
  const reaction = comment.reaction === 1
    ? `<span class="comment-reaction positive">${icon("thumbsUp")} +1 Funcionou</span>`
    : comment.reaction === -1
      ? `<span class="comment-reaction negative">${icon("thumbsDown")} −1 Não funcionou</span>`
      : "";
  const videoId = youtubeVideoId(comment.videoUrl);
  const video = videoId
    ? `<a class="comment-video-link" href="https://youtu.be/${videoId}" target="_blank" rel="noopener noreferrer">${icon("play")}<span><strong>Assistir vídeo do ataque</strong><small>YouTube · abre em uma nova guia</small></span>${icon("external")}</a>`
    : "";
  const canEdit = cloudEnabled
    ? Boolean(currentUserId && comment.authorId === currentUserId)
    : comment.author === currentUser;
  const isEditing = editingCommentId === comment.id && canEdit;
  const edited = comment.updatedAt
    ? `<span class="comment-edited" title="Editado em ${escapeHtml(updatedDate)}">editado</span>`
    : "";
  return `
    <article class="comment-item${isEditing ? " is-editing" : ""}" data-comment-id="${escapeHtml(comment.id)}">
      <span class="comment-avatar" aria-hidden="true">${escapeHtml(comment.author.charAt(0).toUpperCase() || "?")}</span>
      <div class="comment-content">
        <div class="comment-header">
          <div class="comment-meta"><strong>${escapeHtml(comment.author)}</strong><time datetime="${escapeHtml(comment.createdAt)}">${date}</time>${edited}${reaction}</div>
          ${canEdit && !isEditing ? `<button class="comment-edit-button" type="button" data-edit-comment-id="${escapeHtml(comment.id)}" aria-label="Editar seu comentário">${icon("edit")}<span>Editar</span></button>` : ""}
        </div>
        ${isEditing ? commentEditForm(comment) : `<p>${escapeHtml(comment.body)}</p>${video}`}
      </div>
    </article>`;
}

function commentEditForm(comment) {
  const reactionValue = comment.reaction === 1 ? "1" : comment.reaction === -1 ? "-1" : "";
  return `
    <form class="comment-edit-form" data-comment-edit-form data-comment-id="${escapeHtml(comment.id)}" data-strategy-id="${escapeHtml(comment.strategyId)}">
      <div class="comment-edit-field">
        <label for="edit-comment-${escapeHtml(comment.id)}">Seu comentário</label>
        <span data-comment-counter>${comment.body.length}/500</span>
      </div>
      <textarea id="edit-comment-${escapeHtml(comment.id)}" name="body" rows="4" minlength="1" maxlength="500" required>${escapeHtml(comment.body)}</textarea>
      <label class="comment-edit-video" for="edit-comment-video-${escapeHtml(comment.id)}">
        <span>Vídeo do ataque <small>opcional</small></span>
        <input id="edit-comment-video-${escapeHtml(comment.id)}" name="videoUrl" type="url" inputmode="url" maxlength="200" autocomplete="url" value="${escapeHtml(comment.videoUrl || "")}" placeholder="https://youtu.be/ID_DO_VIDEO" />
      </label>
      <div class="comment-edit-footer">
        <fieldset class="reaction-picker comment-edit-reaction">
          <legend>Resultado <span>opcional</span></legend>
          <div class="reaction-options">
            <label class="reaction-choice neutral"><input type="radio" name="reaction" value=""${reactionValue === "" ? " checked" : ""}><span>Só comentar</span></label>
            <label class="reaction-choice positive"><input type="radio" name="reaction" value="1"${reactionValue === "1" ? " checked" : ""}><span>${icon("thumbsUp")} +1</span></label>
            <label class="reaction-choice negative"><input type="radio" name="reaction" value="-1"${reactionValue === "-1" ? " checked" : ""}><span>${icon("thumbsDown")} −1</span></label>
          </div>
        </fieldset>
        <div class="comment-edit-actions">
          <button class="button button-ghost" type="button" data-cancel-comment-edit>Cancelar</button>
          <button class="button button-primary" type="submit">Salvar edição</button>
        </div>
      </div>
    </form>`;
}

function detailSection(title, content, className, key) {
  const hasContent = Boolean(content?.trim());
  return `<section class="detail-section ${className} section-${key}${hasContent ? "" : " empty"}"><h4>${escapeHtml(title)}</h4><p>${hasContent ? escapeHtml(content) : "Não informado."}</p></section>`;
}

function compactBuildNumber(value) {
  if (value >= 1000) {
    const compact = Number((value / 1000).toFixed(value % 1000 === 0 ? 0 : 1));
    return `${compact.toLocaleString("pt-BR")}k`;
  }
  return value.toLocaleString("pt-BR");
}

function formatBuildValue(build, definition) {
  const value = build?.[definition.key];
  if (definition.kind === "text") return value ? escapeHtml(value) : "—";
  if (!Number.isFinite(value)) return "—";
  if (definition.kind === "bonus") return `<strong>≥ +${compactBuildNumber(value)}</strong>`;
  return `<strong>≥ ${value.toLocaleString("pt-BR")}%</strong>`;
}

function buildRecommendationsTable(strategy) {
  const populatedBuilds = normalizeBuildRecommendations(strategy.sections?.builds, strategy.attack, strategy.attackAlternatives);
  if (!populatedBuilds.length) return "";
  const populatedByMonster = new Map(populatedBuilds.map((build) => [build.monsterId, build]));
  const builds = attackMonsterReferences(strategy.attack, strategy.attackAlternatives).map((reference) => ({
    ...reference,
    ...(populatedByMonster.get(reference.monsterId) || {}),
  }));
  const visibleStats = buildStatDefinitions.filter((definition) => builds.some((build) => {
    const value = build[definition.key];
    return definition.kind === "text" ? Boolean(value) : Number.isFinite(value);
  }));
  if (!visibleStats.length) return "";
  return `
    <section class="build-guide" aria-labelledby="build-guide-${escapeHtml(strategy.id)}">
      <div class="build-guide-heading">
        <div><h4 id="build-guide-${escapeHtml(strategy.id)}">Build mínima recomendada</h4><p>Valores com + são bônus de runas, artefatos e torres. Percentuais são metas totais.</p></div>
        <span>Opcional · referência da guilda</span>
      </div>
      <div class="build-table-scroll" tabindex="0" aria-label="Tabela de builds recomendadas; role horizontalmente se necessário">
        <table class="build-table">
          <caption class="sr-only">Build mínima recomendada para os monstros do counter</caption>
          <thead><tr><th scope="col">Atributo</th>${builds.map((build) => {
            const monster = getMonster(build.monsterId);
            return `<th scope="col"><span class="build-monster-heading">${monsterPortraitFrame(monster, `build-monster-avatar ${monster.element}`, { isLeader: build.slot === 0, loading: true })}<span><strong>${escapeHtml(displayMonsterName(monster))}</strong>${build.isAlternative ? "<small>Alternativa</small>" : ""}</span></span></th>`;
          }).join("")}</tr></thead>
          <tbody>${visibleStats.map((definition) => `<tr><th scope="row"><strong>${definition.label}</strong>${definition.hint ? `<small>${definition.hint}</small>` : ""}</th>${builds.map((build) => `<td>${formatBuildValue(build, definition)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    </section>`;
}

function teamComposition(strategy, side, compactLeader = false) {
  const alternatives = strategy[alternativeKey(side)] || [[], [], []];
  const slots = strategy[side].map((id, index) => compositionSlot(id, alternatives[index] || [], side, index)).join("");
  return `${slots}${leaderSkillSummary(strategy, side, compactLeader)}`;
}

function clearDefenseMatchReview({ resetApproval = true } = {}) {
  const review = $("#defenseMatchReview");
  if (review) review.hidden = true;
  pendingDefenseMatches = [];
  if (resetApproval) approvedNewDefenseFingerprint = null;
  const saveButton = $("#saveStrategyButton");
  if (saveButton) {
    saveButton.disabled = false;
    saveButton.textContent = editingStrategyId ? "Salvar alterações" : "Salvar counter";
  }
}

function noteDefenseSelectionChanged() {
  if (!dialogDefenseId) clearDefenseMatchReview();
}

function localSimilarDefenses() {
  const requested = {
    defense: selection.defense,
    defenseAlternatives: selection.defenseAlternatives,
  };
  const requestedFingerprint = compositionFingerprint(requested.defense, requested.defenseAlternatives);
  const groups = new Map();
  strategies.forEach((strategy) => {
    if (strategy.isActive === false) return;
    const key = strategy.defenseId || `local:${compositionFingerprint(strategy.defense, strategy.defenseAlternatives)}`;
    const current = groups.get(key);
    if (current) current.counterCount += 1;
    else groups.set(key, {
      id: key,
      defense: [...strategy.defense],
      defenseAlternatives: strategy.defenseAlternatives.map((slot) => [...slot]),
      counterCount: 1,
    });
  });
  return [...groups.values()].map((candidate) => ({
    ...candidate,
    ...defenseSimilarity(requested, candidate),
  })).filter((candidate) => (
    compositionFingerprint(candidate.defense, candidate.defenseAlternatives) !== requestedFingerprint
    && candidate.matchingSlots >= 2
  )).sort((left, right) => (
    right.matchingSlots - left.matchingSlots
    || right.exactSlots - left.exactSlots
    || right.counterCount - left.counterCount
  )).slice(0, 3);
}

function renderDefenseMatchReview(matches) {
  const review = $("#defenseMatchReview");
  const list = $("#defenseMatchList");
  if (!review || !list) return;
  pendingDefenseMatches = matches;
  list.innerHTML = matches.map((candidate) => {
    const counterLabel = `${candidate.counterCount} ${candidate.counterCount === 1 ? "counter" : "counters"}`;
    const relationLabel = candidate.matchingSlots === 3
      ? `${candidate.exactSlots} ${candidate.exactSlots === 1 ? "slot idêntico" : "slots idênticos"} · ${counterLabel}`
      : `2 de 3 slots relacionados · ${counterLabel}`;
    return `
      <article class="defense-match-option">
        <div class="defense-match-option-copy">
          <strong>Defesa existente</strong>
          <span>${escapeHtml(relationLabel)}</span>
        </div>
        <div class="defense-match-team defense-team"><span class="monsters">${teamComposition(candidate, "defense", true)}</span></div>
        <button class="button button-secondary" type="button" data-use-defense-id="${escapeHtml(candidate.id)}">Usar esta defesa</button>
      </article>`;
  }).join("");
  review.hidden = false;
  const saveButton = $("#saveStrategyButton");
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "Escolha a defesa abaixo";
  }
  requestAnimationFrame(() => {
    review.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    review.querySelector("[data-use-defense-id]")?.focus({ preventScroll: true });
  });
}

function compositionSlot(primaryId, alternatives, side, index) {
  const names = [primaryId, ...alternatives].map((id) => displayMonsterName(getMonster(id)));
  const isLeader = index === 0;
  return `
    <div class="composition-slot${alternatives.length ? " has-alternatives" : ""}${isLeader ? " leader-slot" : ""}" aria-label="Slot ${index + 1}${isLeader ? ", líder" : ""}: ${escapeHtml(names.join(" ou "))}">
      ${monsterChip(primaryId, side, false, isLeader)}
      ${alternatives.map((id) => `<div class="alternative-row"><span>ou</span>${monsterChip(id, side, true, isLeader)}</div>`).join("")}
    </div>`;
}

function monsterChip(id, side, isAlternative = false, isLeader = false) {
  const monster = getMonster(id);
  if (id === "*") {
    const label = side === "attack" ? "Sem terceiro" : "Qualquer um";
    const title = side === "attack" ? "Ataque utiliza apenas dois monstros" : "Qualquer terceiro monstro";
    return `<span class="monster monster-with-image wildcard-chip" title="${title}"><span class="monster-image wildcard-avatar">X</span><span>${label}</span></span>`;
  }
  const displayName = displayMonsterName(monster);
  const portrait = monsterPortraitFrame(monster, `monster-image ${monster.element}`, { isLeader, loading: true });
  const externalId = monster.externalIds?.com2us ? ` · ID ${monster.externalIds.com2us}` : "";
  const leaderTitle = isLeader ? ` · Líder: ${leaderSkillDescription(monster)}` : "";
  return `<span class="monster monster-with-image${isAlternative ? " alternative-monster" : ""}${isLeader ? " leader-monster" : ""}" title="${isAlternative ? "Alternativa · " : ""}${escapeHtml(elementNames[monster.element] || "")}${externalId}${escapeHtml(leaderTitle)}">${portrait}<span>${escapeHtml(displayName)}</span></span>`;
}

function captureBuildDraft() {
  document.querySelectorAll("[data-build-monster-id][data-build-stat]").forEach((input) => {
    const monsterId = input.dataset.buildMonsterId;
    const definition = buildStatDefinitions.find((item) => item.key === input.dataset.buildStat);
    if (!monsterId || !definition) return;
    const current = buildDraft.get(monsterId) || { monsterId };
    current[definition.key] = sanitizeBuildValue(input.value, definition);
    buildDraft.set(monsterId, current);
  });
}

function buildEditorInput(reference, definition) {
  const draft = buildDraft.get(reference.monsterId) || {};
  const value = draft[definition.key];
  const monsterName = displayMonsterName(getMonster(reference.monsterId));
  if (definition.kind === "text") {
    return `<input type="text" maxlength="${definition.maxLength}" value="${escapeHtml(value || "")}" placeholder="${definition.placeholder}" data-build-monster-id="${escapeHtml(reference.monsterId)}" data-build-stat="${definition.key}" aria-label="${definition.label} de ${escapeHtml(monsterName)}">`;
  }
  const suffix = definition.kind === "percent" ? "%" : "+";
  return `<label class="build-number-input"><span aria-hidden="true">${suffix}</span><input type="number" min="0" max="${definition.max}" step="${definition.step}" value="${Number.isFinite(value) ? value : ""}" inputmode="numeric" placeholder="—" data-build-monster-id="${escapeHtml(reference.monsterId)}" data-build-stat="${definition.key}" aria-label="${definition.label} ${definition.hint || ""} de ${escapeHtml(monsterName)}"></label>`;
}

function renderBuildRecommendationsEditor() {
  const editor = $("#buildRecommendationsEditor");
  if (!editor) return;
  captureBuildDraft();
  const references = attackMonsterReferences(selection.attack, selection.attackAlternatives);
  const selectedIds = new Set(references.map((reference) => reference.monsterId));
  [...buildDraft.keys()].forEach((monsterId) => {
    if (!selectedIds.has(monsterId)) buildDraft.delete(monsterId);
  });
  references.forEach((reference) => {
    buildDraft.set(reference.monsterId, { ...buildDraft.get(reference.monsterId), ...reference });
  });
  if (!references.length) {
    editor.innerHTML = `<div class="build-editor-empty">Selecione os monstros do ataque para liberar a tabela de builds.</div>`;
    return;
  }
  editor.innerHTML = `
    <div class="build-table-scroll build-table-editor" tabindex="0" aria-label="Tabela opcional para cadastrar as builds dos monstros; role horizontalmente se necessário">
      <table class="build-table">
        <caption class="sr-only">Cadastro de builds mínimas recomendadas</caption>
        <thead><tr><th scope="col">Atributo</th>${references.map((reference) => {
          const monster = getMonster(reference.monsterId);
          return `<th scope="col"><span class="build-monster-heading">${monsterPortraitFrame(monster, `build-monster-avatar ${monster.element}`, { isLeader: reference.slot === 0 })}<span><strong>${escapeHtml(displayMonsterName(monster))}</strong><small>Slot ${reference.slot + 1}${reference.isAlternative ? " · alternativa" : ""}</small></span></span></th>`;
        }).join("")}</tr></thead>
        <tbody>${buildStatDefinitions.map((definition) => `<tr><th scope="row"><strong>${definition.label}</strong>${definition.hint ? `<small>${definition.hint}</small>` : ""}</th>${references.map((reference) => `<td>${buildEditorInput(reference, definition)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;
}

function collectBuildRecommendations() {
  captureBuildDraft();
  return attackMonsterReferences(selection.attack, selection.attackAlternatives).map((reference) => {
    const draft = buildDraft.get(reference.monsterId) || {};
    const compact = { ...reference };
    buildStatDefinitions.forEach((definition) => {
      const value = sanitizeBuildValue(draft[definition.key], definition);
      if (definition.kind === "text" ? Boolean(value) : Number.isFinite(value)) compact[definition.key] = value;
    });
    return compact;
  }).filter(buildHasContent);
}

function openStrategyDialog(defenseStrategy = null) {
  editingStrategyId = null;
  $("#strategyForm").reset();
  clearStrategyFormStatus();
  clearDefenseMatchReview();
  resetSelection();
  dialogDefenseId = defenseStrategy?.defenseId || null;
  if (defenseStrategy) {
    selection.defense = [...defenseStrategy.defense];
    selection.defenseAlternatives = defenseStrategy.defenseAlternatives.map((slot) => [...slot]);
    [0, 1, 2].forEach((index) => renderSelectionSlot("defense", index));
  }
  updateStrategyDialogMode();
  strategyDialog.showModal();
}

function openEditStrategyDialog(strategy) {
  editingStrategyId = strategy.id;
  dialogDefenseId = null;
  clearStrategyFormStatus();
  clearDefenseMatchReview();
  const form = $("#strategyForm");
  form.reset();
  selection = {
    attack: [...strategy.attack],
    defense: [...strategy.defense],
    attackAlternatives: strategy.attackAlternatives.map((slot) => [...slot]),
    defenseAlternatives: strategy.defenseAlternatives.map((slot) => [...slot]),
  };
  buildDraft = new Map(
    normalizeBuildRecommendations(strategy.sections?.builds, strategy.attack, strategy.attackAlternatives)
      .map((build) => [build.monsterId, { ...build }])
  );
  ["attack", "defense"].forEach((side) => [0, 1, 2].forEach((index) => renderSelectionSlot(side, index)));
  renderBuildRecommendationsEditor();
  form.elements.safety.value = strategy.safety;
  form.elements.status.value = strategy.status;
  ["gamePlan", "idealStats", "turnOrder", "targetPriority", "thirdVariations", "risks", "substitutions", "evidence", "videoUrl"].forEach((name) => {
    form.elements[name].value = strategy.sections?.[name] || "";
  });
  updateStrategyDialogMode();
  strategyDialog.showModal();
}

function closeStrategyDialog() {
  if (monsterDialog.open) monsterDialog.close();
  strategyDialog.close();
  $("#strategyForm").reset();
  clearStrategyFormStatus();
  dialogDefenseId = null;
  editingStrategyId = null;
  clearDefenseMatchReview();
  resetSelection();
  updateStrategyDialogMode();
}

function resetSelection() {
  clearDefenseMatchReview();
  selection = emptySelection();
  buildDraft = new Map();
  ["attack", "defense"].forEach((side) => [0, 1, 2].forEach((index) => renderSelectionSlot(side, index)));
  renderBuildRecommendationsEditor();
}

function updateStrategyDialogMode() {
  const isEditing = Boolean(editingStrategyId);
  const isAddingCounter = Boolean(dialogDefenseId);
  $("#strategyDialogEyebrow").textContent = isEditing ? "EDIÇÃO COLABORATIVA" : "NOVO COUNTER";
  $("#strategyDialogTitle").textContent = isEditing ? "Editar counter" : isAddingCounter ? "Adicionar outro counter" : "Adicionar counter";
  $("#strategyDialogCopy").textContent = isEditing
    ? "Atualize a composição ou o plano. O autor original será preservado e sua edição ficará registrada."
    : isAddingCounter
    ? "A defesa e suas alternativas já estão vinculadas. Monte uma estratégia completamente nova para enfrentá-la."
    : "Escolha a defesa, monte o ataque e registre como pilotar esta opção.";
  $("#saveStrategyButton").textContent = isEditing ? "Salvar alterações" : "Salvar counter";
  $("#defenseLockedNotice").hidden = !isAddingCounter;
  $("#defenseFieldset").classList.toggle("is-locked", isAddingCounter);
  document.querySelectorAll('.monster-select[data-slot^="defense-"]').forEach((button) => {
    button.disabled = isAddingCounter;
    button.setAttribute("aria-disabled", String(isAddingCounter));
  });
  document.querySelectorAll('[data-alternatives-for^="defense-"] button').forEach((button) => {
    button.disabled = isAddingCounter;
    button.setAttribute("aria-disabled", String(isAddingCounter));
  });
}

function renderOptionalWildcard(button) {
  const [side] = button.dataset.slot.split("-");
  const isAttack = side === "attack";
  button.className = "monster-select wildcard-select";
  button.innerHTML = `<span class="wildcard-avatar">X</span><span><strong>${isAttack ? "Sem terceiro" : "Qualquer monstro"}</strong><small>${isAttack ? "Selecione se quiser usar" : "Selecione se for específico"}</small></span>`;
}

function renderSelectionSlot(side, index) {
  const button = document.querySelector(`.monster-select[data-slot="${side}-${index}"]`);
  const selectedId = selection[side][index];
  if (!button) return;
  if (selectedId === "*") renderOptionalWildcard(button);
  else if (!selectedId) {
    button.className = "monster-select";
    button.innerHTML = `<span class="select-plus">${icon("plus")}</span><span>${index === 0 ? "Selecionar líder" : "Selecionar"}</span>`;
  } else {
    const monster = getMonster(selectedId);
    button.className = "monster-select selected";
    const skill = monsterLeaderSkill(monster);
    const leader = index === 0 ? `<span class="selection-leader-skill">${skill ? `<span class="selection-leader-icon">${leaderSkillImage(skill)}</span>` : ""}<span>${escapeHtml(leaderSkillDescription(monster))}</span></span>` : "";
    button.classList.toggle("leader-selection", index === 0);
    button.innerHTML = `${monsterPortraitFrame(monster, `select-avatar ${monster.element}`, { isLeader: index === 0 })}<span class="selection-copy"><strong>${escapeHtml(displayMonsterName(monster))}</strong><small>${elementNames[monster.element]} · ${monster.externalIds.com2us}</small>${leader}</span>`;
  }
  renderSelectedAlternatives(side, index);
  if (side === "attack") renderBuildRecommendationsEditor();
}

function renderSelectedAlternatives(side, index) {
  const container = document.querySelector(`[data-alternatives-for="${side}-${index}"]`);
  if (!container) return;
  const primaryId = selection[side][index];
  const alternatives = selection[alternativeKey(side)][index];
  if (!primaryId || primaryId === "*") {
    container.innerHTML = "";
    return;
  }
  const isLockedDefense = side === "defense" && Boolean(dialogDefenseId);
  const chips = alternatives.map((id) => {
    const monster = getMonster(id);
    const leader = index === 0 ? `<small>${escapeHtml(leaderSkillDescription(monster))}</small>` : "";
    return `
      <span class="selected-alternative">
        ${monsterPortraitFrame(monster, `alternative-avatar ${monster.element}`, { isLeader: index === 0 })}
        <span class="selected-alternative-copy" title="${escapeHtml(displayMonsterName(monster))}"><strong>${escapeHtml(displayMonsterName(monster))}</strong>${leader}</span>
        <button type="button" data-remove-alternative data-side="${side}" data-index="${index}" data-monster-id="${escapeHtml(id)}" aria-label="Remover ${escapeHtml(displayMonsterName(monster))}"${isLockedDefense ? ' disabled aria-disabled="true"' : ""}>${icon("close")}</button>
      </span>`;
  }).join("");
  const addButton = isLockedDefense
    ? ""
    : alternatives.length < MAX_SLOT_ALTERNATIVES
    ? `<button class="add-alternative" type="button" data-add-alternative data-side="${side}" data-index="${index}">${icon("plus")}<span>${alternatives.length ? "Outra opção" : "Alternativa"}</span></button>`
    : `<span class="alternative-limit">Limite de ${MAX_SLOT_ALTERNATIVES}</span>`;
  container.innerHTML = chips + addButton;
}

function openMonsterPicker({ side, index, mode = "primary", button = null }) {
  pickerSlot = { side, index: Number(index), mode, button };
  activeElement = "all";
  $("#monsterSearch").value = "";
  document.querySelectorAll("[data-element]").forEach((item) => item.classList.toggle("active", item.dataset.element === "all"));
  const optional = Number(index) === 2 && mode === "primary" ? " (opcional)" : "";
  const sideLabel = side === "attack" ? "Ataque" : "Defesa";
  $("#pickerTitle").textContent = mode === "alternative"
    ? `${sideLabel} · alternativa do slot ${Number(index) + 1}`
    : `${sideLabel} · monstro ${Number(index) + 1}${optional}`;
  $("#pickerHelp").textContent = mode === "alternative"
    ? Number(index) === 0
      ? "Escolha outro líder para este slot. A Leader Skill de cada opção aparece abaixo."
      : "Escolha outro monstro que possa cumprir este mesmo papel."
    : Number(index) === 0
      ? "O primeiro slot é o líder. Confira a Leader Skill antes de adicionar."
      : "Escolha pelo nome, elemento ou ID.";
  renderMonsterOptions();
  monsterDialog.showModal();
  setTimeout(() => $("#monsterSearch").focus(), 40);
}

function renderMonsterOptions() {
  const query = normalize($("#monsterSearch").value);
  const selectedIds = new Set([
    ...(selection[pickerSlot?.side] || []),
    ...(selection[alternativeKey(pickerSlot?.side)] || []).flat(),
  ]);
  const matching = monsters.filter((monster) => {
    const names = [monster.id, monster.name, monster.canonicalName, monster.externalIds?.com2us, monster.externalIds?.swarfarm, ...(monster.aliases || [])].join(" ");
    return normalize(names).includes(query) && (activeElement === "all" || monster.element === activeElement) && !selectedIds.has(monster.id);
  });
  const visible = matching.slice(0, 80);
  const isOptionalSlot = pickerSlot?.index === 2 && pickerSlot?.mode === "primary";
  const optionalSearchText = pickerSlot?.side === "attack" ? "Sem terceiro opcional" : "Qualquer monstro opcional";
  const wildcardMatches = isOptionalSlot && activeElement === "all" && normalize(optionalSearchText).includes(query);
  const wildcardOption = wildcardMatches ? `
    <button class="monster-option wildcard-option" data-monster-id="*" type="button">
      <span class="picker-avatar wildcard-avatar">X</span>
      <span class="option-copy"><strong>${pickerSlot.side === "attack" ? "Sem terceiro" : "Qualquer monstro"}</strong><small>${pickerSlot.side === "attack" ? "Usar somente dois atacantes" : "Deixar o terceiro defensor em aberto"}</small></span>
      <span class="add-label">Usar X</span>
    </button>` : "";
  const monsterOptions = visible.map((monster) => `
    <button class="monster-option" data-monster-id="${monster.id}" type="button">
      ${monsterPortraitFrame(monster, `picker-avatar ${monster.element}`, { isLeader: pickerSlot?.index === 0, loading: true })}
      <span class="option-copy"><strong>${escapeHtml(displayMonsterName(monster))}</strong><small>${elementNames[monster.element]} · ID ${monster.externalIds.com2us}</small>${pickerSlot?.index === 0 ? `<span class="option-leader-skill">${monsterLeaderSkill(monster) ? `<span>${leaderSkillImage(monsterLeaderSkill(monster))}</span>` : ""}${escapeHtml(leaderSkillDescription(monster))}</span>` : ""}</span>
      <span class="add-label">${pickerSlot?.mode === "alternative" ? "Usar como opção" : "Adicionar"}</span>
    </button>`).join("");
  $("#monsterOptions").innerHTML = wildcardOption + monsterOptions + (matching.length > visible.length ? `<div class="results-hint">Mostrando ${visible.length} de ${matching.length}. Digite o nome ou ID para encontrar os demais.</div>` : "") || '<div class="no-options">Nenhum monstro encontrado.</div>';
}

function selectMonster(id) {
  if (!pickerSlot) return;
  if (pickerSlot.side === "defense") noteDefenseSelectionChanged();
  if (id === "*") {
    selection[pickerSlot.side][pickerSlot.index] = "*";
    selection[alternativeKey(pickerSlot.side)][pickerSlot.index] = [];
    renderSelectionSlot(pickerSlot.side, pickerSlot.index);
    monsterDialog.close();
    return;
  }
  if (pickerSlot.mode === "alternative") {
    const options = selection[alternativeKey(pickerSlot.side)][pickerSlot.index];
    if (options.length >= MAX_SLOT_ALTERNATIVES) {
      showToast(`Cada slot aceita até ${MAX_SLOT_ALTERNATIVES} alternativas.`);
      return;
    }
    options.push(id);
  } else selection[pickerSlot.side][pickerSlot.index] = id;
  renderSelectionSlot(pickerSlot.side, pickerSlot.index);
  monsterDialog.close();
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function clearStrategyFormStatus() {
  const status = $("#strategyFormStatus");
  if (!status) return;
  status.hidden = true;
  status.className = "strategy-form-status";
  status.textContent = "";
}

function showStrategyFormStatus(message, type = "error") {
  const status = $("#strategyFormStatus");
  if (!status) {
    showToast(message);
    return;
  }
  status.textContent = message;
  status.className = `strategy-form-status is-${type}`;
  status.hidden = false;
  requestAnimationFrame(() => status.scrollIntoView({ behavior: "smooth", block: "nearest" }));
}

function strategyShareUrl(id) {
  const strategy = strategies.find((item) => item.id === id);
  const key = strategy?.shortId;
  if (!key) throw new Error("Counter sem short ID.");
  return new URL(`/counter/${encodeURIComponent(key)}`, window.location.origin).toString();
}

function defenseShareUrl(id) {
  const strategy = strategies.find((item) => item.defenseId === id);
  const key = strategy?.defenseShortId;
  if (!key) throw new Error("Defesa sem short ID.");
  return new URL(`/defense/${encodeURIComponent(key)}`, window.location.origin).toString();
}

function openDefenseView(id, { pushState = true } = {}) {
  selectedDefenseId = id;
  sharedStrategyId = null;
  sharedDefenseKey = strategies.find((item) => item.defenseId === id)?.defenseShortId || null;
  sharedStrategyOpened = false;
  if (pushState) {
    if (!sharedDefenseKey) throw new Error("Defesa sem short ID.");
    window.history.pushState({}, "", `/defense/${encodeURIComponent(sharedDefenseKey)}`);
  }
  render();
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function openDefenseCatalog({ pushState = true } = {}) {
  selectedDefenseId = null;
  sharedStrategyId = null;
  sharedDefenseKey = null;
  sharedStrategyOpened = false;
  if (pushState) {
    window.history.pushState({}, "", "/");
  }
  render();
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

async function handleDefenseNavigation(event) {
  const defenseCard = event.target.closest("[data-open-defense-id]");
  if (defenseCard) {
    openDefenseView(defenseCard.dataset.openDefenseId);
    return true;
  }

  if (event.target.closest("[data-back-catalog]")) {
    openDefenseCatalog();
    return true;
  }

  const copyButton = event.target.closest("[data-copy-defense-id]");
  if (copyButton) {
    try {
      await copyText(defenseShareUrl(copyButton.dataset.copyDefenseId));
      showToast("Link da defesa copiado.");
    } catch (error) {
      console.error(error);
      showToast("Não foi possível copiar o link.");
    }
    return true;
  }

  return false;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Clipboard indisponível");
  }
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const nextUser = new FormData(event.currentTarget).get("playerName").trim();
  if (!nextUser) return;
  const submitButton = event.currentTarget.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = cloudEnabled ? "Conectando..." : "Entrando...";
  try {
    currentUser = nextUser;
    if (cloudEnabled) await connectCloudUser();
    else strategies = migrateStrategies(readStoredStrategies());
    localStorage.setItem(STORAGE_KEYS.user, currentUser);
    showApp();
  } catch (error) {
    console.error(error);
    currentUser = "";
    updateStorageUi("error");
    showToast("Não foi possível conectar ao Supabase. Confira a migration e o login anônimo.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Entrar";
  }
});

$("#logoutButton").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEYS.user);
  currentUser = "";
  appShell.hidden = true;
  loginScreen.hidden = false;
  $("#playerName").focus();
});

configureCollaborativeMode();
[$("#openFormButton"), $("#emptyAddButton")].forEach((button) => {
  button.addEventListener("click", () => openStrategyDialog());
});
[$("#closeDialogButton"), $("#cancelDialogButton")].forEach((button) => button.addEventListener("click", closeStrategyDialog));
$("#closeMonsterDialog").addEventListener("click", () => monsterDialog.close());
document.querySelectorAll(".monster-select[data-slot]").forEach((button) => button.addEventListener("click", () => {
  const [side, index] = button.dataset.slot.split("-");
  openMonsterPicker({ side, index: Number(index), button });
}));

$("#strategyForm").addEventListener("click", (event) => {
  const useDefenseButton = event.target.closest("[data-use-defense-id]");
  if (useDefenseButton) {
    const match = pendingDefenseMatches.find((candidate) => candidate.id === useDefenseButton.dataset.useDefenseId);
    if (!match) {
      showToast("Essa defesa não está mais disponível. Verifique novamente.");
      clearDefenseMatchReview();
      return;
    }
    dialogDefenseId = match.id;
    selection.defense = [...match.defense];
    selection.defenseAlternatives = match.defenseAlternatives.map((slot) => [...slot]);
    clearDefenseMatchReview({ resetApproval: false });
    [0, 1, 2].forEach((index) => renderSelectionSlot("defense", index));
    updateStrategyDialogMode();
    event.currentTarget.requestSubmit();
    return;
  }
  const keepNewButton = event.target.closest("[data-keep-new-defense]");
  if (keepNewButton) {
    approvedNewDefenseFingerprint = compositionFingerprint(selection.defense, selection.defenseAlternatives);
    clearDefenseMatchReview({ resetApproval: false });
    event.currentTarget.requestSubmit();
    return;
  }
  const addButton = event.target.closest("[data-add-alternative]");
  if (addButton) {
    openMonsterPicker({ side: addButton.dataset.side, index: Number(addButton.dataset.index), mode: "alternative" });
    return;
  }
  const removeButton = event.target.closest("[data-remove-alternative]");
  if (!removeButton) return;
  const side = removeButton.dataset.side;
  const index = Number(removeButton.dataset.index);
  if (side === "defense") noteDefenseSelectionChanged();
  selection[alternativeKey(side)][index] = selection[alternativeKey(side)][index].filter((id) => id !== removeButton.dataset.monsterId);
  renderSelectionSlot(side, index);
});

strategyDialog.addEventListener("click", (event) => {
  if (event.target === strategyDialog) closeStrategyDialog();
});
monsterDialog.addEventListener("click", (event) => {
  if (event.target === monsterDialog) monsterDialog.close();
});

$("#monsterSearch").addEventListener("input", renderMonsterOptions);
$("#elementFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-element]");
  if (!button) return;
  activeElement = button.dataset.element;
  document.querySelectorAll("[data-element]").forEach((item) => item.classList.toggle("active", item === button));
  renderMonsterOptions();
});
$("#monsterOptions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-monster-id]");
  if (button) selectMonster(button.dataset.monsterId);
});

function selectionValidationError(side) {
  const label = side === "attack" ? "ataque" : "defesa";
  const primaryIds = selection[side];
  const alternatives = selection[alternativeKey(side)];
  if (primaryIds.slice(0, 2).some((id) => !id || id === "*")) return `Selecione pelo menos 2 monstros no ${label}.`;
  const allIds = primaryIds.filter((id) => id && id !== "*");
  for (let index = 0; index < 3; index += 1) {
    if ((!primaryIds[index] || primaryIds[index] === "*") && alternatives[index].length) return `O slot ${index + 1} do ${label} precisa de um monstro principal.`;
    if (alternatives[index].length > MAX_SLOT_ALTERNATIVES) return `O slot ${index + 1} do ${label} excedeu o limite de alternativas.`;
    allIds.push(...alternatives[index]);
  }
  if (new Set(allIds).size !== allIds.length) return `Um mesmo monstro não pode ocupar dois slots do ${label}.`;
  return "";
}

$("#strategyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  clearStrategyFormStatus();
  const validationError = selectionValidationError("attack") || selectionValidationError("defense");
  if (validationError) {
    showStrategyFormStatus(validationError);
    return;
  }
  const data = new FormData(event.currentTarget);
  const rawVideoUrl = data.get("videoUrl").trim();
  const videoUrl = normalizeYouTubeUrl(rawVideoUrl);
  if (rawVideoUrl && !videoUrl) {
    showStrategyFormStatus("Use um link válido do YouTube, como youtu.be ou youtube.com.");
    event.currentTarget.elements.videoUrl.focus();
    return;
  }
  const submitButton = event.currentTarget.querySelector("button[type='submit']");
  const currentDefenseFingerprint = compositionFingerprint(selection.defense, selection.defenseAlternatives);
  const shouldReviewDefense = !editingStrategyId
    && !dialogDefenseId
    && approvedNewDefenseFingerprint !== currentDefenseFingerprint;
  if (shouldReviewDefense) {
    submitButton.disabled = true;
    submitButton.textContent = "Verificando defesa...";
    let matches;
    try {
      matches = cloudEnabled
        ? await database.findSimilarDefenses(selection.defense, selection.defenseAlternatives, 3)
        : localSimilarDefenses();
    } catch (error) {
      console.error(error);
      showStrategyFormStatus("Não foi possível comparar as defesas. Tente salvar novamente.");
      submitButton.disabled = false;
      submitButton.textContent = "Salvar counter";
      return;
    }
    submitButton.disabled = false;
    submitButton.textContent = "Salvar counter";
    if (matches.length) {
      renderDefenseMatchReview(matches);
      return;
    }
  }
  const existingStrategy = editingStrategyId
    ? strategies.find((item) => item.id === editingStrategyId)
    : null;
  if (editingStrategyId && !existingStrategy) {
    showStrategyFormStatus("Este counter não está mais disponível. Atualize a página e tente novamente.");
    return;
  }
  const wasEditing = Boolean(existingStrategy);
  const wasAddingCounter = Boolean(dialogDefenseId);
  const now = new Date().toISOString();
  const strategy = {
    ...(existingStrategy || {}),
    id: existingStrategy?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    defenseId: wasEditing
      ? (cloudEnabled ? null : `local:${compositionFingerprint(selection.defense, selection.defenseAlternatives)}`)
      : dialogDefenseId || (cloudEnabled ? null : `local:${compositionFingerprint(selection.defense, selection.defenseAlternatives)}`),
    player: existingStrategy?.player || currentUser,
    attack: [...selection.attack],
    defense: [...selection.defense],
    attackAlternatives: selection.attackAlternatives.map((slot) => [...slot]),
    defenseAlternatives: selection.defenseAlternatives.map((slot) => [...slot]),
    safety: data.get("safety"),
    status: data.get("status"),
    comments: existingStrategy?.comments || [],
    sections: {
      ...(existingStrategy?.sections || {}),
      gamePlan: data.get("gamePlan").trim(),
      idealStats: data.get("idealStats").trim(),
      builds: collectBuildRecommendations(),
      videoUrl,
      turnOrder: data.get("turnOrder").trim(),
      targetPriority: data.get("targetPriority").trim(),
      thirdVariations: data.get("thirdVariations").trim(),
      risks: data.get("risks").trim(),
      substitutions: data.get("substitutions").trim(),
      evidence: data.get("evidence").trim(),
    },
    createdAt: existingStrategy?.createdAt || now,
    updatedAt: now,
  };
  submitButton.disabled = true;
  submitButton.textContent = "Salvando...";
  let conflictDetected = false;
  try {
    if (wasEditing && cloudEnabled) {
      const result = await database.updateStrategy(strategy, existingStrategy.updatedAt);
      const savedStrategy = {
        ...existingStrategy,
        ...result.strategy,
        defenseShortId: result.strategy.defenseShortId || existingStrategy.defenseShortId,
        comments: existingStrategy.comments || [],
        edits: [...(existingStrategy.edits || []), normalizeStrategyEdit(result.edit)],
      };
      strategies = strategies.map((item) => item.id === savedStrategy.id ? savedStrategy : item);
    } else if (wasEditing) {
      const edit = normalizeStrategyEdit({
        strategyId: strategy.id,
        editorId: currentUserId,
        editor: currentUser,
        editedAt: now,
      });
      strategy.edits = [...(existingStrategy.edits || []), edit];
      strategies = strategies.map((item) => item.id === strategy.id ? strategy : item);
      saveStrategies();
    } else if (cloudEnabled) {
      strategies.unshift(await database.createStrategy(strategy, currentUserId, currentUser));
    } else {
      strategies.unshift(strategy);
      saveStrategies();
    }
    render();
    const savedId = strategy.id;
    closeStrategyDialog();
    if (wasEditing) {
      const updatedCard = [...document.querySelectorAll("[data-strategy-id]")].find((card) => card.dataset.strategyId === savedId);
      if (updatedCard) updatedCard.open = true;
      showToast("Alterações salvas. A edição foi registrada no histórico.");
    } else {
      showToast(wasAddingCounter ? "Novo counter adicionado à defesa." : "Counter adicionado ao arsenal.");
    }
  } catch (error) {
    console.error(error);
    if (error.code === "STRATEGY_CONFLICT") {
      conflictDetected = true;
      try {
        await connectCloudUser();
        render();
      } catch (refreshError) {
        console.error(refreshError);
      }
      showStrategyFormStatus("Este counter mudou desde que você abriu a edição. Recarregamos a versão mais recente e preservamos seus campos. Revise e clique em “Salvar alterações novamente” para confirmar.", "warning");
    } else {
      showStrategyFormStatus(wasEditing ? "Não foi possível salvar as alterações. Tente novamente; se continuar, atualize a página." : "Não foi possível salvar a estratégia. Tente novamente.");
    }
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = conflictDetected ? "Salvar alterações novamente" : wasEditing ? "Salvar alterações" : "Salvar counter";
  }
});

$("#strategyForm").addEventListener("invalid", (event) => {
  const field = event.target;
  const label = field.closest("label")?.querySelector("strong")?.textContent?.trim();
  showStrategyFormStatus(label ? `Revise o campo “${label}” antes de salvar.` : "Revise os campos obrigatórios antes de salvar.");
  requestAnimationFrame(() => field.scrollIntoView({ behavior: "smooth", block: "center" }));
}, true);

$("#strategyList").addEventListener("input", (event) => {
  const textarea = event.target.closest(".comment-form textarea, .comment-edit-form textarea");
  if (!textarea) return;
  const counter = textarea.closest("form")?.querySelector("[data-comment-counter]");
  if (counter) counter.textContent = `${textarea.value.length}/500`;
});

$("#strategyList").addEventListener("submit", async (event) => {
  const editForm = event.target.closest("[data-comment-edit-form]");
  if (editForm) {
    event.preventDefault();
    const strategy = strategies.find((item) => item.id === editForm.dataset.strategyId);
    const comment = strategy?.comments?.find((item) => item.id === editForm.dataset.commentId);
    const canEdit = comment && (cloudEnabled
      ? Boolean(currentUserId && comment.authorId === currentUserId)
      : comment.author === currentUser);
    if (!strategy || !comment || !canEdit) {
      editingCommentId = null;
      render();
      showToast("Este comentário não está disponível para edição.");
      return;
    }
    const data = new FormData(editForm);
    const body = String(data.get("body") || "").trim();
    if (!body) {
      showToast("O comentário não pode ficar vazio.");
      editForm.elements.body.focus();
      return;
    }
    const rawVideoUrl = String(data.get("videoUrl") || "").trim();
    const videoUrl = normalizeYouTubeUrl(rawVideoUrl);
    if (rawVideoUrl && !videoUrl) {
      showToast("Cole um link válido de vídeo do YouTube.");
      editForm.elements.videoUrl.focus();
      return;
    }
    const rawReaction = data.get("reaction");
    const updatedComment = {
      ...comment,
      body,
      videoUrl,
      reaction: rawReaction === "1" ? 1 : rawReaction === "-1" ? -1 : null,
      updatedAt: new Date().toISOString(),
    };
    const submitButton = editForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Salvando...";
    try {
      const savedComment = cloudEnabled
        ? await database.updateComment(updatedComment, currentUserId)
        : updatedComment;
      strategy.comments = strategy.comments.map((item) => item.id === comment.id ? normalizeComment(savedComment) : item);
      editingCommentId = null;
      saveStrategies();
      render();
      const updatedCard = [...document.querySelectorAll("[data-strategy-id]")].find((card) => card.dataset.strategyId === strategy.id);
      if (updatedCard) updatedCard.open = true;
      showToast("Comentário atualizado.");
    } catch (error) {
      console.error(error);
      submitButton.disabled = false;
      submitButton.textContent = "Salvar edição";
      showToast("Não foi possível atualizar o comentário.");
    }
    return;
  }

  const form = event.target.closest("[data-comment-form]");
  if (!form) return;
  event.preventDefault();
  const strategy = strategies.find((item) => item.id === form.dataset.strategyId);
  if (!strategy) return;
  const data = new FormData(form);
  const body = String(data.get("body") || "").trim();
  if (!body) {
    showToast("Escreva um comentário antes de publicar.");
    return;
  }
  const rawVideoUrl = String(data.get("videoUrl") || "").trim();
  const videoUrl = normalizeYouTubeUrl(rawVideoUrl);
  if (rawVideoUrl && !videoUrl) {
    showToast("Cole um link válido de vídeo do YouTube.");
    form.elements.videoUrl.focus();
    return;
  }
  const rawReaction = data.get("reaction");
  const comment = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    strategyId: strategy.id,
    authorId: currentUserId,
    author: currentUser,
    body,
    videoUrl,
    reaction: rawReaction === "1" ? 1 : rawReaction === "-1" ? -1 : null,
    createdAt: new Date().toISOString(),
  };
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Publicando...";
  try {
    const savedComment = cloudEnabled
      ? await database.createComment(comment, currentUserId, currentUser)
      : comment;
    strategy.comments = [...(strategy.comments || []), normalizeComment(savedComment)];
    saveStrategies();
    render();
    const updatedCard = [...document.querySelectorAll("[data-strategy-id]")].find((card) => card.dataset.strategyId === strategy.id);
    if (updatedCard) updatedCard.open = true;
    showToast(comment.reaction ? "Feedback e reação publicados." : "Comentário publicado.");
  } catch (error) {
    console.error(error);
    submitButton.disabled = false;
    submitButton.textContent = "Publicar feedback";
    showToast("Não foi possível publicar. Tente novamente.");
  }
});

$("#strategyList").addEventListener("click", async (event) => {
  if (await handleDefenseNavigation(event)) return;

  const editCommentButton = event.target.closest("[data-edit-comment-id]");
  if (editCommentButton) {
    editingCommentId = editCommentButton.dataset.editCommentId;
    const strategy = strategies.find((item) => item.comments?.some((comment) => comment.id === editingCommentId));
    render();
    const updatedCard = strategy
      ? [...document.querySelectorAll("[data-strategy-id]")].find((card) => card.dataset.strategyId === strategy.id)
      : null;
    if (updatedCard) updatedCard.open = true;
    requestAnimationFrame(() => document.querySelector(`[data-comment-id="${CSS.escape(editingCommentId)}"] textarea`)?.focus());
    return;
  }

  if (event.target.closest("[data-cancel-comment-edit]")) {
    const strategyId = event.target.closest("[data-comment-edit-form]")?.dataset.strategyId;
    editingCommentId = null;
    render();
    const updatedCard = [...document.querySelectorAll("[data-strategy-id]")].find((card) => card.dataset.strategyId === strategyId);
    if (updatedCard) updatedCard.open = true;
    return;
  }

  const addCounterButton = event.target.closest("[data-add-counter-defense-id]");
  if (addCounterButton) {
    const defenseStrategy = strategies.find((item) => item.defenseId === addCounterButton.dataset.addCounterDefenseId);
    if (!defenseStrategy) {
      showToast("Não foi possível localizar esta defesa.");
      return;
    }
    openStrategyDialog(defenseStrategy);
    return;
  }

  const editButton = event.target.closest("[data-edit-id]");
  if (editButton) {
    const strategy = strategies.find((item) => item.id === editButton.dataset.editId);
    if (!strategy) {
      showToast("Não foi possível localizar este counter.");
      return;
    }
    openEditStrategyDialog(strategy);
    return;
  }

  const shareButton = event.target.closest("[data-share-id]");
  if (shareButton) {
    try {
      await copyText(strategyShareUrl(shareButton.dataset.shareId));
      showToast("Link da estratégia copiado.");
    } catch (error) {
      console.error(error);
      showToast("Não foi possível copiar o link.");
    }
    return;
  }

  const deleteButton = event.target.closest("[data-delete-id]");
  const id = deleteButton?.dataset.deleteId;
  if (!id) return;
  const strategy = strategies.find((item) => item.id === id);
  const canDelete = cloudEnabled ? strategy?.ownerId === currentUserId && !strategy?.isSeed : strategy?.player === currentUser;
  if (!strategy || !canDelete || !window.confirm("Excluir esta estratégia?")) return;
  try {
    if (cloudEnabled) await database.deleteStrategy(id, currentUserId);
    strategies = strategies.filter((item) => item.id !== id);
    saveStrategies();
    render();
    showToast("Estratégia excluída.");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível excluir a estratégia.");
  }
});

$("#defenseViewIntro").addEventListener("click", handleDefenseNavigation);

$(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  openDefenseCatalog();
});

window.addEventListener("popstate", () => {
  const location = readShareLocation();
  selectedDefenseId = null;
  sharedStrategyId = location.strategy;
  sharedDefenseKey = location.defense;
  sharedStrategyOpened = false;
  render();
});

$("#searchInput").addEventListener("input", render);
$("#detailSearchInput").addEventListener("input", render);
$("#safetyFilter").addEventListener("change", (event) => {
  activeSafety = event.target.value;
  render();
});
$("#statusFilter").addEventListener("change", (event) => {
  activeStatus = event.target.value;
  render();
});
$("#clearFiltersButton").addEventListener("click", () => {
  activeSafety = "all";
  activeStatus = "all";
  $("#searchInput").value = "";
  $("#detailSearchInput").value = "";
  $("#safetyFilter").value = "all";
  $("#statusFilter").value = "all";
  render();
});

document.addEventListener("keydown", (event) => {
  const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
  if (event.key === "/" && !isTyping && !strategyDialog.open && !monsterDialog.open) {
    event.preventDefault();
    $("#searchInput").focus();
  }
});

async function init() {
  try {
    const response = await fetch("./data/monsters.json?v=0.8");
    if (!response.ok) throw new Error("Catálogo indisponível");
    const catalog = await response.json();
    const preparedCatalog = prepareMonsterCatalog(catalog.monsters);
    monsters = preparedCatalog.preferred;
    monsterById = preparedCatalog.byId;
    monsterByName = preparedCatalog.byName;
    updateStorageUi(cloudEnabled ? "cloud" : "local");
    if (cloudEnabled) {
      strategies = [];
      if (currentUser) {
        try {
          await connectCloudUser();
          showApp();
        } catch (error) {
          console.error(error);
          updateStorageUi("error");
          localStorage.removeItem(STORAGE_KEYS.user);
          currentUser = "";
          showToast("Supabase conectado, mas o banco ainda precisa da migration e do seed.");
        }
      }
    } else {
      strategies = migrateStrategies(readStoredStrategies());
      saveStrategies();
      if (currentUser) showApp();
    }
  } catch (error) {
    console.error(error);
    strategies = seedStrategies;
    showToast("Não foi possível carregar o catálogo de monstros.");
  }
}

init();
