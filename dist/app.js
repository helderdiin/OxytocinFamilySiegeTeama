const STORAGE_KEYS = {
  user: "oxytocin-siege-user",
  strategies: "oxytocin-siege-strategies",
};
const MAX_SLOT_ALTERNATIVES = 4;
const READ_ONLY_MODE = true;

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
  ["idealStats", "Status e builds recomendadas", ""],
  ["turnOrder", "Ordem de turno", ""],
  ["targetPriority", "Prioridade de alvo", ""],
  ["thirdVariations", "Variações do terceiro monstro", ""],
  ["risks", "Riscos — nunca use contra", "warning"],
  ["substitutions", "Substituições possíveis", ""],
  ["evidence", "Experiência comprovada", ""],
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
const sharedStrategyId = new URLSearchParams(window.location.search).get("strategy");
let sharedStrategyOpened = false;

const $ = (selector) => document.querySelector(selector);
const loginScreen = $("#loginScreen");
const appShell = $("#appShell");
const strategyDialog = $("#strategyDialog");
const monsterDialog = $("#monsterDialog");
const database = window.oxytocinDb;
const cloudEnabled = Boolean(database?.isConfigured());

function configureReadOnlyMode() {
  const readOnlyChip = $("#readOnlyModeChip");
  if (readOnlyChip) readOnlyChip.hidden = !READ_ONLY_MODE;

  [$("#openFormButton"), $("#emptyAddButton")].forEach((button) => {
    if (!button) return;
    button.disabled = READ_ONLY_MODE;
    button.setAttribute("aria-disabled", String(READ_ONLY_MODE));
    if (READ_ONLY_MODE) button.title = "Cadastro temporariamente desativado. A guilda está avaliando a experiência em modo somente leitura.";
    else button.removeAttribute("title");
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
    return {
      ...rest,
      attack,
      defense,
      attackAlternatives: normalizeSlotAlternatives(strategy.attackAlternatives || strategy.attack_alternatives, attack),
      defenseAlternatives: normalizeSlotAlternatives(strategy.defenseAlternatives || strategy.defense_alternatives, defense),
      safety: safetyNames[strategy.safety] ? strategy.safety : "situational",
      status: statusNames[strategy.status] ? strategy.status : "needs_testing",
      comments: Array.isArray(strategy.comments) ? strategy.comments.map(normalizeComment) : [],
      sections: {
        gamePlan: strategy.sections?.gamePlan || notes || "",
        idealStats: strategy.sections?.idealStats || "",
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
    reaction: comment?.reaction === 1 || comment?.reaction === -1 ? comment.reaction : null,
    createdAt: comment?.createdAt || comment?.created_at || new Date().toISOString(),
  };
}

function toMonsterId(value) {
  if (!value || value === "*") return value;
  if (monsterById.has(value)) return monsterById.get(value).id;
  return monsterByName.get(normalize(value))?.id || value;
}

function saveStrategies() {
  if (cloudEnabled) return;
  localStorage.setItem(STORAGE_KEYS.strategies, JSON.stringify({ schemaVersion: 5, strategies }));
}

function updateStorageUi(mode) {
  const chip = $("#syncChip");
  chip.classList.toggle("cloud", mode === "cloud");
  chip.classList.toggle("error", mode === "error");
  $("#syncLabel").textContent = mode === "cloud" ? "Base compartilhada" : mode === "error" ? "Supabase indisponível" : "Salvo neste dispositivo";
  $("#footerStorageLabel").textContent = mode === "cloud" ? "POC v0.17 · Supabase" : "POC v0.17 · dados locais";
}

async function connectCloudUser() {
  currentUserId = await database.ensureUser(currentUser);
  const [strategyRows, comments] = await Promise.all([database.listStrategies(), database.listComments()]);
  const commentsByStrategy = new Map();
  comments.forEach((comment) => {
    if (!commentsByStrategy.has(comment.strategyId)) commentsByStrategy.set(comment.strategyId, []);
    commentsByStrategy.get(comment.strategyId).push(normalizeComment(comment));
  });
  strategies = migrateStrategies(strategyRows).map((strategy) => ({
    ...strategy,
    comments: commentsByStrategy.get(strategy.id) || [],
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
    lock: '<rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />',
    comment: '<path d="M21 12a8 8 0 0 1-8 8H6l-4 2 1.5-5A8.5 8.5 0 1 1 21 12Z" />',
    thumbsUp: '<path d="M7 10v10H3V10h4Zm0 9c2.5 1.3 5.1 2 7.8 2H17a3 3 0 0 0 2.9-2.3l1-4A3 3 0 0 0 18 11h-4l.7-3.3A3.1 3.1 0 0 0 11.6 4L7 10v9Z" />',
    thumbsDown: '<path d="M17 14V4h4v10h-4Zm0-9c-2.5-1.3-5.1-2-7.8-2H7a3 3 0 0 0-2.9 2.3l-1 4A3 3 0 0 0 6 13h4l-.7 3.3a3.1 3.1 0 0 0 3.1 3.7l4.6-6V5Z" />',
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
  const visible = activeStrategies.filter((strategy) => {
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
    const sectionText = Object.values(strategy.sections || {});
    const feedbackText = (strategy.comments || []).flatMap((comment) => [comment.author, comment.body]);
    const monsterHaystack = normalize([...defenseText, ...attackText, ...alternativeText].join(" "));
    const detailHaystack = normalize([strategy.player, safetyNames[strategy.safety], statusNames[strategy.status], ...sectionText, ...feedbackText].join(" "));
    const matchesMonsters = monsterTokens.every((token) => monsterHaystack.includes(token));
    const matchesDetails = detailTokens.every((token) => detailHaystack.includes(token));
    return matchesSafety && matchesStatus && matchesMonsters && matchesDetails;
  });

  $("#totalStrategies").textContent = activeStrategies.length;
  $("#totalDefenses").textContent = new Set(activeStrategies.map((item) => item.defense.slice(0, 2).sort().join("|"))).size;
  $("#totalPlayers").textContent = new Set(activeStrategies.map((item) => normalize(item.player))).size;
  $("#strategyList").innerHTML = visible.map(strategyCard).join("");
  $("#emptyState").hidden = visible.length > 0;
  $("#resultCount").textContent = `${visible.length} ${visible.length === 1 ? "estratégia" : "estratégias"}`;

  if (sharedStrategyId && !sharedStrategyOpened) {
    const sharedCard = [...document.querySelectorAll("[data-strategy-id]")].find((card) => card.dataset.strategyId === sharedStrategyId);
    if (sharedCard) {
      sharedStrategyOpened = true;
      sharedCard.open = true;
      sharedCard.classList.add("shared-strategy");
      requestAnimationFrame(() => sharedCard.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }
}

function strategyCard(strategy) {
  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(strategy.createdAt));
  const canDelete = !READ_ONLY_MODE && (cloudEnabled ? strategy.ownerId === currentUserId && !strategy.isSeed : strategy.player === currentUser);
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
            <span class="strategy-badge ${safetyClass}">${safetyNames[strategy.safety]}</span>
            <span class="strategy-badge ${statusClass}">${statusNames[strategy.status]}</span>
          </div>
          <span class="strategy-source">Por <strong>${escapeHtml(strategy.player)}</strong> · <time datetime="${strategy.createdAt}">${date}</time></span>
        </div>
        <div class="matchup">
          <div class="team defense-team">
            <span class="team-label">Defesa encontrada</span>
            <div class="monsters">${teamComposition(strategy, "defense")}</div>
          </div>
          <span class="matchup-arrow" aria-hidden="true">${icon("arrow")}</span>
          <div class="team attack-team">
            <span class="team-label">Counter recomendado</span>
            <div class="monsters">${teamComposition(strategy, "attack")}</div>
          </div>
        </div>
        <div class="decision-strip">
          <article class="decision-item fit-signal"><span>Serve quando</span><p>${escapeHtml(fit)}</p></article>
          <article class="decision-item risk-signal"><span>Risco crítico</span><p>${escapeHtml(risk)}</p></article>
          <article class="decision-item turn-signal"><span>Ordem de turno</span><p>${escapeHtml(turnOrder)}</p></article>
        </div>
        <span class="open-hint">
          <span>Ver plano completo, builds e feedback</span>
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
        <div class="strategy-overview">${sectionDefinitions.map(([key, title, className]) => detailSection(title, strategy.sections?.[key], className, key)).join("")}</div>
        ${strategyFeedback(strategy, comments, positiveCount, negativeCount)}
        <div class="card-footer">
          <span>Cadastrado por ${escapeHtml(strategy.player)} em ${date}</span>
          <div class="card-actions">
            <button class="share-button" data-share-id="${escapeHtml(strategy.id)}" type="button">${icon("link")}<span>Copiar link</span></button>
            ${canDelete ? `<button class="delete-button" data-delete-id="${escapeHtml(strategy.id)}" type="button">${icon("trash")}<span>Excluir</span></button>` : ""}
          </div>
        </div>
      </div>
    </details>`;
}

function strategyFeedback(strategy, comments, positiveCount, negativeCount) {
  const strategyId = escapeHtml(strategy.id);
  const commentsMarkup = comments.length
    ? comments.map(commentItem).join("")
    : `<div class="feedback-empty">${icon("comment")}<p><strong>Ainda não há feedback.</strong><span>${READ_ONLY_MODE ? "Os comentários serão liberados depois desta primeira avaliação da guilda." : "Se você testar esta composição, conte para a guilda como foi."}</span></p></div>`;
  const disabledAttribute = READ_ONLY_MODE ? " disabled aria-disabled=\"true\"" : "";
  return `
    <section class="feedback-section" aria-labelledby="feedback-title-${strategyId}">
      <div class="feedback-heading">
        <div>
          <h4 id="feedback-title-${strategyId}">Feedback da guilda</h4>
          <p>${READ_ONLY_MODE ? "Comentários e reações serão liberados após esta primeira avaliação." : "O +1 ou −1 é opcional e sempre acompanha um comentário."}</p>
        </div>
        <div class="feedback-totals" aria-label="${positiveCount} feedbacks positivos e ${negativeCount} feedbacks negativos">
          <span class="feedback-total positive">${icon("thumbsUp")}<strong>${positiveCount}</strong></span>
          <span class="feedback-total negative">${icon("thumbsDown")}<strong>${negativeCount}</strong></span>
        </div>
      </div>
      <div class="comment-list" aria-label="Comentários da guilda">${commentsMarkup}</div>
      <form class="comment-form${READ_ONLY_MODE ? " is-read-only" : ""}" data-comment-form data-strategy-id="${strategyId}">
        ${READ_ONLY_MODE ? `<div class="feedback-readonly-notice">${icon("lock")}<span><strong>Modo somente leitura</strong>Você pode consultar o histórico, mas novos comentários estão temporariamente desativados.</span></div>` : ""}
        <div class="comment-field-heading"><label for="comment-${strategyId}">Adicionar feedback</label><span data-comment-counter>0/500</span></div>
        <textarea id="comment-${strategyId}" name="body" rows="3" minlength="1" maxlength="500" required placeholder="${READ_ONLY_MODE ? "Comentários disponíveis em breve." : "Conte o que aconteceu na luta, o que funcionou ou qual foi o risco real."}"${disabledAttribute}></textarea>
        <div class="comment-form-footer">
          <fieldset class="reaction-picker"${READ_ONLY_MODE ? " disabled" : ""}>
            <legend>Resultado <span>opcional</span></legend>
            <div class="reaction-options">
              <label class="reaction-choice neutral"><input type="radio" name="reaction" value="" checked><span>Só comentar</span></label>
              <label class="reaction-choice positive"><input type="radio" name="reaction" value="1"><span>${icon("thumbsUp")} +1 Funcionou</span></label>
              <label class="reaction-choice negative"><input type="radio" name="reaction" value="-1"><span>${icon("thumbsDown")} −1 Não funcionou</span></label>
            </div>
          </fieldset>
          <button class="button button-primary comment-submit" type="submit"${disabledAttribute}>Publicar feedback</button>
        </div>
      </form>
    </section>`;
}

function commentItem(comment) {
  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(comment.createdAt));
  const reaction = comment.reaction === 1
    ? `<span class="comment-reaction positive">${icon("thumbsUp")} +1 Funcionou</span>`
    : comment.reaction === -1
      ? `<span class="comment-reaction negative">${icon("thumbsDown")} −1 Não funcionou</span>`
      : "";
  return `
    <article class="comment-item">
      <span class="comment-avatar" aria-hidden="true">${escapeHtml(comment.author.charAt(0).toUpperCase() || "?")}</span>
      <div class="comment-content">
        <div class="comment-meta"><strong>${escapeHtml(comment.author)}</strong><time datetime="${escapeHtml(comment.createdAt)}">${date}</time>${reaction}</div>
        <p>${escapeHtml(comment.body)}</p>
      </div>
    </article>`;
}

function detailSection(title, content, className, key) {
  const hasContent = Boolean(content?.trim());
  return `<section class="detail-section ${className} section-${key}${hasContent ? "" : " empty"}"><h4>${escapeHtml(title)}</h4><p>${hasContent ? escapeHtml(content) : "Não informado."}</p></section>`;
}

function teamComposition(strategy, side) {
  const alternatives = strategy[alternativeKey(side)] || [[], [], []];
  return strategy[side].map((id, index) => compositionSlot(id, alternatives[index] || [], side, index)).join("");
}

function compositionSlot(primaryId, alternatives, side, index) {
  const names = [primaryId, ...alternatives].map((id) => displayMonsterName(getMonster(id)));
  return `
    <div class="composition-slot${alternatives.length ? " has-alternatives" : ""}" aria-label="Slot ${index + 1}: ${escapeHtml(names.join(" ou "))}">
      ${monsterChip(primaryId, side)}
      ${alternatives.map((id) => `<div class="alternative-row"><span>ou</span>${monsterChip(id, side, true)}</div>`).join("")}
    </div>`;
}

function monsterChip(id, side, isAlternative = false) {
  const monster = getMonster(id);
  if (id === "*") {
    const label = side === "attack" ? "Sem terceiro" : "Qualquer um";
    const title = side === "attack" ? "Ataque utiliza apenas dois monstros" : "Qualquer terceiro monstro";
    return `<span class="monster monster-with-image wildcard-chip" title="${title}"><span class="monster-image wildcard-avatar">X</span><span>${label}</span></span>`;
  }
  const displayName = displayMonsterName(monster);
  const image = monster.image
    ? `<img class="monster-image ${monster.element}" src="./${escapeHtml(monster.image)}" alt="" loading="lazy" />`
    : `<span class="monster-image fallback-avatar">${escapeHtml(displayName.slice(0, 2).toUpperCase())}</span>`;
  const externalId = monster.externalIds?.com2us ? ` · ID ${monster.externalIds.com2us}` : "";
  return `<span class="monster monster-with-image${isAlternative ? " alternative-monster" : ""}" title="${isAlternative ? "Alternativa · " : ""}${escapeHtml(elementNames[monster.element] || "")}${externalId}">${image}<span>${escapeHtml(displayName)}</span></span>`;
}

function openStrategyDialog() {
  resetSelection();
  strategyDialog.showModal();
}

function closeStrategyDialog() {
  if (monsterDialog.open) monsterDialog.close();
  strategyDialog.close();
  $("#strategyForm").reset();
  resetSelection();
}

function resetSelection() {
  selection = emptySelection();
  ["attack", "defense"].forEach((side) => [0, 1, 2].forEach((index) => renderSelectionSlot(side, index)));
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
    button.innerHTML = `<span class="select-plus">${icon("plus")}</span><span>Selecionar</span>`;
  } else {
    const monster = getMonster(selectedId);
    button.className = "monster-select selected";
    button.innerHTML = `<img class="select-avatar ${monster.element}" src="./${escapeHtml(monster.image)}" alt="" /><span><strong>${escapeHtml(displayMonsterName(monster))}</strong><small>${elementNames[monster.element]} · ${monster.externalIds.com2us}</small></span>`;
  }
  renderSelectedAlternatives(side, index);
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
  const chips = alternatives.map((id) => {
    const monster = getMonster(id);
    return `
      <span class="selected-alternative">
        <img class="alternative-avatar ${monster.element}" src="./${escapeHtml(monster.image)}" alt="" />
        <span title="${escapeHtml(displayMonsterName(monster))}">${escapeHtml(displayMonsterName(monster))}</span>
        <button type="button" data-remove-alternative data-side="${side}" data-index="${index}" data-monster-id="${escapeHtml(id)}" aria-label="Remover ${escapeHtml(displayMonsterName(monster))}">${icon("close")}</button>
      </span>`;
  }).join("");
  const addButton = alternatives.length < MAX_SLOT_ALTERNATIVES
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
    ? "Escolha outro monstro que possa cumprir este mesmo papel."
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
      <img class="picker-avatar ${monster.element}" src="./${escapeHtml(monster.image)}" alt="" loading="lazy" />
      <span class="option-copy"><strong>${escapeHtml(displayMonsterName(monster))}</strong><small>${elementNames[monster.element]} · ID ${monster.externalIds.com2us}</small></span>
      <span class="add-label">${pickerSlot?.mode === "alternative" ? "Usar como opção" : "Adicionar"}</span>
    </button>`).join("");
  $("#monsterOptions").innerHTML = wildcardOption + monsterOptions + (matching.length > visible.length ? `<div class="results-hint">Mostrando ${visible.length} de ${matching.length}. Digite o nome ou ID para encontrar os demais.</div>` : "") || '<div class="no-options">Nenhum monstro encontrado.</div>';
}

function selectMonster(id) {
  if (!pickerSlot) return;
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

function strategyShareUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set("strategy", id);
  url.hash = "";
  return url.toString();
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

configureReadOnlyMode();
[$("#openFormButton"), $("#emptyAddButton")].forEach((button) => {
  if (!READ_ONLY_MODE) button.addEventListener("click", openStrategyDialog);
});
[$("#closeDialogButton"), $("#cancelDialogButton")].forEach((button) => button.addEventListener("click", closeStrategyDialog));
$("#closeMonsterDialog").addEventListener("click", () => monsterDialog.close());
document.querySelectorAll(".monster-select[data-slot]").forEach((button) => button.addEventListener("click", () => {
  const [side, index] = button.dataset.slot.split("-");
  openMonsterPicker({ side, index: Number(index), button });
}));

$("#strategyForm").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-alternative]");
  if (addButton) {
    openMonsterPicker({ side: addButton.dataset.side, index: Number(addButton.dataset.index), mode: "alternative" });
    return;
  }
  const removeButton = event.target.closest("[data-remove-alternative]");
  if (!removeButton) return;
  const side = removeButton.dataset.side;
  const index = Number(removeButton.dataset.index);
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
  if (READ_ONLY_MODE) {
    showToast("O cadastro de ataques está temporariamente desativado.");
    return;
  }
  const validationError = selectionValidationError("attack") || selectionValidationError("defense");
  if (validationError) {
    showToast(validationError);
    return;
  }
  const data = new FormData(event.currentTarget);
  const strategy = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    player: currentUser,
    attack: [...selection.attack],
    defense: [...selection.defense],
    attackAlternatives: selection.attackAlternatives.map((slot) => [...slot]),
    defenseAlternatives: selection.defenseAlternatives.map((slot) => [...slot]),
    safety: data.get("safety"),
    status: data.get("status"),
    comments: [],
    sections: {
      gamePlan: data.get("gamePlan").trim(),
      idealStats: data.get("idealStats").trim(),
      turnOrder: data.get("turnOrder").trim(),
      targetPriority: data.get("targetPriority").trim(),
      thirdVariations: data.get("thirdVariations").trim(),
      risks: data.get("risks").trim(),
      substitutions: data.get("substitutions").trim(),
      evidence: data.get("evidence").trim(),
    },
    createdAt: new Date().toISOString(),
  };
  const submitButton = event.currentTarget.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Salvando...";
  try {
    if (cloudEnabled) strategies.unshift(await database.createStrategy(strategy, currentUserId, currentUser));
    else {
      strategies.unshift(strategy);
      saveStrategies();
    }
    render();
    closeStrategyDialog();
    showToast("Estratégia adicionada ao arsenal.");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível salvar a estratégia.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Salvar estratégia";
  }
});

$("#strategyList").addEventListener("input", (event) => {
  const textarea = event.target.closest(".comment-form textarea");
  if (!textarea) return;
  const counter = textarea.closest(".comment-form")?.querySelector("[data-comment-counter]");
  if (counter) counter.textContent = `${textarea.value.length}/500`;
});

$("#strategyList").addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-comment-form]");
  if (!form) return;
  event.preventDefault();
  if (READ_ONLY_MODE) {
    showToast("Os comentários estão temporariamente desativados.");
    return;
  }
  const strategy = strategies.find((item) => item.id === form.dataset.strategyId);
  if (!strategy) return;
  const data = new FormData(form);
  const body = String(data.get("body") || "").trim();
  if (!body) {
    showToast("Escreva um comentário antes de publicar.");
    return;
  }
  const rawReaction = data.get("reaction");
  const comment = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    strategyId: strategy.id,
    authorId: currentUserId,
    author: currentUser,
    body,
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
  if (READ_ONLY_MODE) return;
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
    const response = await fetch("./data/monsters.json?v=0.7");
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
