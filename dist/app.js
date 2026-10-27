const STORAGE_KEYS = {
  user: "oxytocin-siege-user",
  strategies: "oxytocin-siege-strategies",
};

const seedStrategies = [
  {
    id: "seed-1",
    player: "MestreOx",
    attack: ["skogul", "chloe", "kahli"],
    defense: ["conrad", "robo-r40", "*"],
    notes: "Bom contra Conrad + ROBO-R40 + vários terceiros. Evitar Hyanes + Vigor + Kinki.",
    createdAt: "2026-10-22T18:30:00.000Z",
  },
  {
    id: "seed-2",
    player: "LunaSW",
    attack: ["ashour", "racuni", "talc"],
    defense: ["miles", "nora", "*"],
    notes: "O terceiro depende do elemento da ameaça; Nickel pode substituir Talc contra ameaça Wind.",
    createdAt: "2026-10-24T21:10:00.000Z",
  },
  {
    id: "seed-3",
    player: "TheoBR",
    attack: ["seara", "orion", "perna"],
    defense: ["chandra", "byungchul", "*"],
    notes: "Funciona melhor quando o terceiro não traz cleanse forte. Descrever a variação antes de usar.",
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

let currentUser = localStorage.getItem(STORAGE_KEYS.user) || "";
let activeFilter = "all";
let activeElement = "all";
let strategies = [];
let monsters = [];
let monsterById = new Map();
let monsterByName = new Map();
let pickerSlot = null;
let selection = { attack: [null, null, null], defense: [null, null, "*"] };

const $ = (selector) => document.querySelector(selector);
const loginScreen = $("#loginScreen");
const appShell = $("#appShell");
const strategyDialog = $("#strategyDialog");
const monsterDialog = $("#monsterDialog");

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
  return records.map((strategy) => ({
    ...strategy,
    attack: strategy.attack.slice(0, 3).map(toMonsterId),
    defense: [toMonsterId(strategy.defense[0]), toMonsterId(strategy.defense[1]), "*"],
  }));
}

function toMonsterId(value) {
  if (!value || value === "*") return value;
  if (monsterById.has(value)) return value;
  return monsterByName.get(normalize(value))?.id || value;
}

function saveStrategies() {
  localStorage.setItem(STORAGE_KEYS.strategies, JSON.stringify({ schemaVersion: 2, strategies }));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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
  const query = normalize($("#searchInput")?.value || "");
  const visible = strategies.filter((strategy) => {
    const matchesOwner = activeFilter !== "mine" || strategy.player === currentUser;
    const monsterText = [...strategy.attack, ...strategy.defense].map((id) => {
      const monster = getMonster(id);
      return [monster.id, monster.name, monster.canonicalName, ...(monster.aliases || [])].join(" ");
    });
    const haystack = normalize([...monsterText, strategy.player, strategy.notes || ""].join(" "));
    return matchesOwner && haystack.includes(query);
  });

  $("#totalStrategies").textContent = strategies.length;
  $("#totalDefenses").textContent = new Set(strategies.map((item) => item.defense.slice(0, 2).sort().join("|"))).size;
  $("#totalPlayers").textContent = new Set(strategies.map((item) => normalize(item.player))).size;
  $("#strategyList").innerHTML = visible.map(strategyCard).join("");
  $("#emptyState").hidden = visible.length > 0;
}

function strategyCard(strategy) {
  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(strategy.createdAt));
  const canDelete = strategy.player === currentUser;
  return `
    <article class="strategy-card">
      <div class="team attack-team">
        <span class="team-label attack-label">⚔ ATAQUE</span>
        <div class="monsters">${strategy.attack.map(monsterChip).join("")}</div>
      </div>
      <span class="vs">VS</span>
      <div class="team">
        <span class="team-label">⬡ DEFESA</span>
        <div class="monsters">${strategy.defense.map(monsterChip).join("")}</div>
      </div>
      <div class="strategy-meta">
        <strong>${escapeHtml(strategy.player)}</strong>
        <time datetime="${strategy.createdAt}">${date}</time>
        ${strategy.notes ? `<p>${escapeHtml(strategy.notes)}</p>` : ""}
        ${canDelete ? `<div class="card-actions"><button class="delete-button" data-delete-id="${strategy.id}" type="button">Excluir estratégia</button></div>` : ""}
      </div>
    </article>`;
}

function monsterChip(id) {
  const monster = getMonster(id);
  if (id === "*") return `<span class="monster monster-with-image wildcard-chip" title="Qualquer terceiro monstro"><span class="monster-image wildcard-avatar">X</span><span>Qualquer um</span></span>`;
  const image = monster.image
    ? `<img class="monster-image ${monster.element}" src="./${escapeHtml(monster.image)}" alt="" loading="lazy" />`
    : `<span class="monster-image fallback-avatar">${escapeHtml(monster.name.slice(0, 2).toUpperCase())}</span>`;
  const externalId = monster.externalIds?.com2us ? ` · ID ${monster.externalIds.com2us}` : "";
  return `<span class="monster monster-with-image" title="${escapeHtml(elementNames[monster.element] || "")}${externalId}">${image}<span>${escapeHtml(monster.name)}</span></span>`;
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
  selection = { attack: [null, null, null], defense: [null, null, "*"] };
  document.querySelectorAll(".monster-select[data-slot]").forEach((button) => {
    button.className = "monster-select";
    button.innerHTML = '<span class="select-plus">＋</span><span>Selecionar</span>';
  });
}

function openMonsterPicker(button) {
  const [side, index] = button.dataset.slot.split("-");
  pickerSlot = { side, index: Number(index), button };
  activeElement = "all";
  $("#monsterSearch").value = "";
  document.querySelectorAll("[data-element]").forEach((item) => item.classList.toggle("active", item.dataset.element === "all"));
  $("#pickerTitle").textContent = side === "attack" ? `Ataque · monstro ${Number(index) + 1}` : `Defesa · monstro ${Number(index) + 1}`;
  renderMonsterOptions();
  monsterDialog.showModal();
  setTimeout(() => $("#monsterSearch").focus(), 40);
}

function renderMonsterOptions() {
  const query = normalize($("#monsterSearch").value);
  const selectedIds = new Set(selection[pickerSlot?.side] || []);
  const matching = monsters.filter((monster) => {
    const names = [monster.id, monster.name, monster.canonicalName, monster.externalIds?.com2us, monster.externalIds?.swarfarm, ...(monster.aliases || [])].join(" ");
    return normalize(names).includes(query) && (activeElement === "all" || monster.element === activeElement) && !selectedIds.has(monster.id);
  });
  const visible = matching.slice(0, 80);
  $("#monsterOptions").innerHTML = visible.length ? visible.map((monster) => `
    <button class="monster-option" data-monster-id="${monster.id}" type="button">
      <img class="picker-avatar ${monster.element}" src="./${escapeHtml(monster.image)}" alt="" loading="lazy" />
      <span class="option-copy"><strong>${escapeHtml(monster.name)}</strong><small>${elementNames[monster.element]} · ID ${monster.externalIds.com2us}</small></span>
      <span class="add-label">Adicionar ＋</span>
    </button>`).join("") + (matching.length > visible.length ? `<div class="results-hint">Mostrando ${visible.length} de ${matching.length}. Digite o nome ou ID para encontrar os demais.</div>` : "") : '<div class="no-options">Nenhum monstro encontrado.</div>';
}

function selectMonster(id) {
  if (!pickerSlot) return;
  const monster = getMonster(id);
  selection[pickerSlot.side][pickerSlot.index] = id;
  pickerSlot.button.classList.add("selected");
  pickerSlot.button.innerHTML = `<img class="select-avatar ${monster.element}" src="./${escapeHtml(monster.image)}" alt="" /><span><strong>${escapeHtml(monster.name)}</strong><small>${elementNames[monster.element]} · ${monster.externalIds.com2us}</small></span>`;
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

$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  currentUser = new FormData(event.currentTarget).get("playerName").trim();
  if (!currentUser) return;
  localStorage.setItem(STORAGE_KEYS.user, currentUser);
  showApp();
});

$("#logoutButton").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEYS.user);
  currentUser = "";
  appShell.hidden = true;
  loginScreen.hidden = false;
  $("#playerName").focus();
});

[$("#openFormButton"), $("#emptyAddButton")].forEach((button) => button.addEventListener("click", openStrategyDialog));
[$("#closeDialogButton"), $("#cancelDialogButton")].forEach((button) => button.addEventListener("click", closeStrategyDialog));
$("#closeMonsterDialog").addEventListener("click", () => monsterDialog.close());
document.querySelectorAll(".monster-select[data-slot]").forEach((button) => button.addEventListener("click", () => openMonsterPicker(button)));

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

$("#strategyForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (selection.attack.some((id) => !id) || selection.defense.slice(0, 2).some((id) => !id)) {
    showToast("Selecione os cinco monstros antes de salvar.");
    return;
  }
  const data = new FormData(event.currentTarget);
  strategies.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    player: currentUser,
    attack: [...selection.attack],
    defense: [...selection.defense],
    notes: data.get("notes").trim(),
    createdAt: new Date().toISOString(),
  });
  saveStrategies();
  render();
  closeStrategyDialog();
  showToast("Estratégia adicionada ao arsenal.");
});

$("#strategyList").addEventListener("click", (event) => {
  const id = event.target.dataset.deleteId;
  if (!id) return;
  const strategy = strategies.find((item) => item.id === id);
  if (!strategy || strategy.player !== currentUser || !window.confirm("Excluir esta estratégia?")) return;
  strategies = strategies.filter((item) => item.id !== id);
  saveStrategies();
  render();
  showToast("Estratégia excluída.");
});

$("#searchInput").addEventListener("input", render);
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

$("#exportButton").addEventListener("click", () => {
  const payload = { schemaVersion: 2, exportedAt: new Date().toISOString(), strategies };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `oxytocin-siege-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Arquivo exportado.");
});

$("#importInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const imported = Array.isArray(parsed) ? parsed : parsed.strategies;
    const valid = Array.isArray(imported) && imported.every((item) =>
      typeof item.player === "string" && Array.isArray(item.attack) && item.attack.length === 3 && Array.isArray(item.defense) && item.defense.length >= 2
    );
    if (!valid) throw new Error("Formato inválido");
    strategies = migrateStrategies(imported).map((item) => ({ ...item, id: item.id || `${Date.now()}-${Math.random()}` }));
    saveStrategies();
    render();
    showToast("Estratégias importadas com sucesso.");
  } catch {
    showToast("Não foi possível importar esse arquivo.");
  } finally {
    event.target.value = "";
  }
});

async function init() {
  try {
    const response = await fetch("./data/monsters.json");
    if (!response.ok) throw new Error("Catálogo indisponível");
    const catalog = await response.json();
    monsters = catalog.monsters;
    monsterById = new Map(monsters.map((monster) => [monster.id, monster]));
    monsterByName = new Map(monsters.map((monster) => [normalize(monster.name), monster]));
    for (const monster of monsters) {
      for (const name of [monster.canonicalName, ...(monster.aliases || [])]) {
        const key = normalize(name);
        const current = monsterByName.get(key);
        if (!current || (monster.gameData.awakenLevel === 1 && current.gameData.awakenLevel !== 1)) monsterByName.set(key, monster);
      }
    }
    strategies = migrateStrategies(readStoredStrategies());
    saveStrategies();
    if (currentUser) showApp();
  } catch (error) {
    console.error(error);
    strategies = seedStrategies;
    showToast("Não foi possível carregar o catálogo de monstros.");
  }
}

init();
