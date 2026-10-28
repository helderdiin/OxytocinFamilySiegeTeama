import monsterCatalog from "../dist/data/monsters.json" with { type: "json" };

const safetyNames = {
  very_safe: "Muito seguro",
  safe: "Seguro",
  situational: "Situacional",
  experimental: "Experimental",
};

const statusNames = {
  proven: "Testado",
  recommended: "Recomendado",
  needs_testing: "Precisa de testes",
};

const elementColors = {
  fire: "#d47b58",
  water: "#6f9fba",
  wind: "#a9a86f",
  light: "#d8c990",
  dark: "#8e7fa9",
  neutral: "#58747a",
};

const monstersById = new Map(monsterCatalog.monsters.map((monster) => [monster.id, monster]));

function cleanKey(value) {
  const key = String(value || "").trim().toUpperCase();
  return /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(key) ? key : "";
}

function truncate(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}

function normalizeAlternatives(value) {
  return [0, 1, 2].map((index) => (
    Array.isArray(value?.[index]) ? value[index].filter(Boolean).slice(0, 4) : []
  ));
}

export function monsterForShare(id) {
  if (!id || id === "*") {
    return { id: "*", name: "X", image: null, element: "neutral" };
  }
  const monster = monstersById.get(id);
  return monster || { id, name: id, canonicalName: id, image: null, element: "neutral" };
}

function displayMonsterName(monster) {
  return monster?.canonicalName || monster?.name || monster?.id || "Monstro";
}

export function teamSlots(primary = [], alternatives = [], side = "attack") {
  const normalizedAlternatives = normalizeAlternatives(alternatives);
  return [0, 1, 2].map((index) => {
    const id = primary?.[index] || "*";
    const monster = monsterForShare(id);
    const optionalName = side === "attack" ? "Sem terceiro" : "Qualquer terceiro";
    return {
      id,
      name: id === "*" ? optionalName : displayMonsterName(monster),
      image: monster.image || null,
      element: monster.element || "neutral",
      elementColor: elementColors[monster.element] || elementColors.neutral,
      alternatives: normalizedAlternatives[index].map((alternativeId) => (
        displayMonsterName(monsterForShare(alternativeId))
      )),
    };
  });
}

export function teamLabel(primary, alternatives, side = "attack", maxLength = 118) {
  const label = teamSlots(primary, alternatives, side)
    .filter((slot, index) => index < 2 || slot.id !== "*")
    .map((slot) => [slot.name, ...slot.alternatives].join("/"))
    .join(" + ");
  return truncate(label, maxLength);
}

export function buildShareMeta(preview) {
  if (preview?.kind === "strategy") {
    const attack = teamLabel(preview.attack, preview.attackAlternatives, "attack", 80);
    const defense = teamLabel(preview.defense, preview.defenseAlternatives, "defense", 80);
    const positive = Number(preview.positiveCount) || 0;
    const negative = Number(preview.negativeCount) || 0;
    const feedback = positive || negative ? ` · +${positive} / −${negative}` : "";
    const turnOrder = truncate(preview.sections?.turnOrder, 92);
    const orderCopy = turnOrder ? ` Ordem: ${turnOrder}` : "";
    return {
      title: truncate(`${attack} vs ${defense}`, 118),
      description: truncate(
        `${safetyNames[preview.safety] || "Counter"} · ${statusNames[preview.status] || "Em análise"}${feedback} · por ${preview.player || "Oxytocin"}.${orderCopy}`,
        205,
      ),
      imageAlt: `Counter ${attack} contra ${defense}`,
    };
  }

  if (preview?.kind === "defense") {
    const defense = teamLabel(preview.defense, preview.defenseAlternatives, "defense", 100);
    const counters = Array.isArray(preview.strategies)
      ? preview.strategies.slice(0, 3).map((strategy) => (
        teamLabel(strategy.attack, strategy.attackAlternatives, "attack", 54)
      ))
      : [];
    const counterCount = Number(preview.counterCount) || 0;
    const provenCount = Number(preview.provenCount) || 0;
    const counterLabel = `${counterCount} ${counterCount === 1 ? "counter" : "counters"}`;
    const provenLabel = `${provenCount} ${provenCount === 1 ? "testado" : "testados"}`;
    const counterCopy = counters.length ? ` Opções: ${counters.join("; ")}.` : "";
    return {
      title: truncate(`${defense} — ${counterLabel}`, 118),
      description: truncate(`${provenLabel} pela guilda.${counterCopy} Compare segurança, riscos e builds antes de atacar.`, 205),
      imageAlt: `Defesa ${defense} com ${counterLabel}`,
    };
  }

  return {
    title: "Oxytocin Siege Teams",
    description: "Counters de Siege testados e compartilhados pela guilda Oxytocin Family.",
    imageAlt: "Oxytocin Siege Teams",
  };
}

export async function fetchSharePreview(kind, rawKey) {
  const normalizedKind = kind === "defense" ? "defense" : kind === "strategy" ? "strategy" : "";
  const key = cleanKey(rawKey);
  if (!normalizedKind || !key) return null;

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabaseUrl || !publishableKey) {
    throw new Error("Missing Supabase configuration for share previews.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_share_preview`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_kind: normalizedKind, p_key: key }),
  });

  if (!response.ok) {
    throw new Error(`Supabase share preview request failed with ${response.status}.`);
  }

  return response.json();
}

export function shareRoute(preview) {
  if (preview?.kind === "strategy") return `/counter/${encodeURIComponent(preview.shortId)}`;
  if (preview?.kind === "defense") return `/defense/${encodeURIComponent(preview.shortId)}`;
  return "/";
}

export function formatSafety(value) {
  return safetyNames[value] || "Counter";
}

export function formatStatus(value) {
  return statusNames[value] || "Em análise";
}

export function compactText(value, maxLength) {
  return truncate(value, maxLength);
}
