const STORAGE_KEYS = {
  user: "oxytocin-siege-user",
  strategies: "oxytocin-siege-strategies",
};

const seedStrategies = [
  {
    id: "seed-1",
    player: "MestreOx",
    attack: ["Copper", "Bulldozer", "Imesety"],
    defense: ["Khmun", "Vigor", "Skogul"],
    notes: "Imesety rápido. Copper precisa ter 100% de crítico.",
    createdAt: "2026-10-22T18:30:00.000Z",
  },
  {
    id: "seed-2",
    player: "LunaSW",
    attack: ["Tesarion", "Riley", "Racuni"],
    defense: ["Carcano", "Mihyang", "Triana"],
    notes: "Foco inicial no Carcano; time seguro para luta longa.",
    createdAt: "2026-10-24T21:10:00.000Z",
  },
  {
    id: "seed-3",
    player: "TheoBR",
    attack: ["Seara", "Orion", "Perna"],
    defense: ["Chandra", "Byungchul", "Nana"],
    notes: "Evitar se a Chandra estiver em Violent muito rápida.",
    createdAt: "2026-10-25T15:45:00.000Z",
  },
];

let currentUser = localStorage.getItem(STORAGE_KEYS.user) || "";
let activeFilter = "all";
let strategies = loadStrategies();

const $ = (selector) => document.querySelector(selector);
const loginScreen = $("#loginScreen");
const appShell = $("#appShell");
const strategyDialog = $("#strategyDialog");

function loadStrategies() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.strategies));
    return Array.isArray(saved) ? saved : seedStrategies;
  } catch {
    return seedStrategies;
  }
}

function saveStrategies() {
  localStorage.setItem(STORAGE_KEYS.strategies, JSON.stringify(strategies));
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
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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
    const haystack = normalize([...strategy.attack, ...strategy.defense, strategy.player, strategy.notes || ""].join(" "));
    return matchesOwner && haystack.includes(query);
  });

  $("#totalStrategies").textContent = strategies.length;
  $("#totalDefenses").textContent = new Set(strategies.map((item) => item.defense.map(normalize).sort().join("|"))).size;
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
        <div class="monsters">${strategy.attack.map((monster) => `<span class="monster">${escapeHtml(monster)}</span>`).join("")}</div>
      </div>
      <span class="vs">VS</span>
      <div class="team">
        <span class="team-label">⬡ DEFESA</span>
        <div class="monsters">${strategy.defense.map((monster) => `<span class="monster">${escapeHtml(monster)}</span>`).join("")}</div>
      </div>
      <div class="strategy-meta">
        <strong>${escapeHtml(strategy.player)}</strong>
        <time datetime="${strategy.createdAt}">${date}</time>
        ${strategy.notes ? `<p>${escapeHtml(strategy.notes)}</p>` : ""}
        ${canDelete ? `<div class="card-actions"><button class="delete-button" data-delete-id="${strategy.id}" type="button">Excluir estratégia</button></div>` : ""}
      </div>
    </article>`;
}

function openDialog() {
  strategyDialog.showModal();
  setTimeout(() => strategyDialog.querySelector("input")?.focus(), 50);
}

function closeDialog() {
  strategyDialog.close();
  $("#strategyForm").reset();
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

[$("#openFormButton"), $("#emptyAddButton")].forEach((button) => button.addEventListener("click", openDialog));
[$("#closeDialogButton"), $("#cancelDialogButton")].forEach((button) => button.addEventListener("click", closeDialog));

strategyDialog.addEventListener("click", (event) => {
  if (event.target === strategyDialog) closeDialog();
});

$("#strategyForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const attack = [data.get("attack1"), data.get("attack2"), data.get("attack3")].map((value) => value.trim());
  const defense = [data.get("defense1"), data.get("defense2"), data.get("defense3")].map((value) => value.trim());
  if ([...attack, ...defense].some((value) => !value)) return;
  strategies.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    player: currentUser,
    attack,
    defense,
    notes: data.get("notes").trim(),
    createdAt: new Date().toISOString(),
  });
  saveStrategies();
  render();
  closeDialog();
  showToast("Estratégia adicionada ao arsenal.");
});

$("#strategyList").addEventListener("click", (event) => {
  const id = event.target.dataset.deleteId;
  if (!id) return;
  const strategy = strategies.find((item) => item.id === id);
  if (!strategy || strategy.player !== currentUser) return;
  if (!window.confirm("Excluir esta estratégia?")) return;
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
  const blob = new Blob([JSON.stringify(strategies, null, 2)], { type: "application/json" });
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
    const imported = JSON.parse(await file.text());
    const valid = Array.isArray(imported) && imported.every((item) =>
      typeof item.player === "string" && Array.isArray(item.attack) && item.attack.length === 3 && Array.isArray(item.defense) && item.defense.length === 3
    );
    if (!valid) throw new Error("Formato inválido");
    strategies = imported.map((item) => ({ ...item, id: item.id || `${Date.now()}-${Math.random()}` }));
    saveStrategies();
    render();
    showToast("Estratégias importadas com sucesso.");
  } catch {
    showToast("Não foi possível importar esse arquivo.");
  } finally {
    event.target.value = "";
  }
});

if (currentUser) showApp();
