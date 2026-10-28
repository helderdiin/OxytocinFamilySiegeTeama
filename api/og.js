import sharp from "sharp";
import {
  compactText,
  fetchSharePreview,
  formatSafety,
  formatStatus,
  teamLabel,
  teamSlots,
} from "../lib/share-preview.js";

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(value, maxCharacters = 54, maxLines = 2) {
  const words = String(value || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  const consumed = lines.join(" ").length;
  if (words.join(" ").length > consumed && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.;,:]?$/, "")}…`;
  }
  return lines.slice(0, maxLines);
}

async function loadPortraits(slots, origin) {
  const portraits = new Map();
  await Promise.all(slots.map(async (slot) => {
    if (!slot.image || portraits.has(slot.id)) return;
    try {
      const response = await fetch(new URL(`/${slot.image.replace(/^\/+/, "")}`, origin));
      if (!response.ok) return;
      const contentType = response.headers.get("content-type") || "image/png";
      const buffer = Buffer.from(await response.arrayBuffer());
      portraits.set(slot.id, `data:${contentType};base64,${buffer.toString("base64")}`);
    } catch (error) {
      console.error("share_portrait_failed", { monsterId: slot.id, message: error?.message });
    }
  }));
  return portraits;
}

function portrait(slot, dataUri, x, y, id) {
  const name = compactText(slot.name, 19);
  const alternatives = slot.alternatives.length
    ? compactText(`ou ${slot.alternatives.join(" / ")}`, 25)
    : "";
  const picture = dataUri
    ? `<image href="${dataUri}" x="${x}" y="${y}" width="96" height="96" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${id})" />`
    : `<text x="${x + 48}" y="${y + 60}" text-anchor="middle" font-size="38" font-weight="700" fill="#c3cccb">${slot.id === "*" ? "X" : "?"}</text>`;
  return `
    <defs><clipPath id="clip-${id}"><rect x="${x}" y="${y}" width="96" height="96" rx="12" /></clipPath></defs>
    <rect x="${x - 3}" y="${y - 3}" width="102" height="102" rx="15" fill="${slot.elementColor}" />
    <rect x="${x}" y="${y}" width="96" height="96" rx="12" fill="#142428" />
    ${picture}
    <text x="${x + 48}" y="${y + 124}" text-anchor="middle" font-size="17" font-weight="700" fill="#f0eee6">${escapeXml(name)}</text>
    ${alternatives ? `<text x="${x + 48}" y="${y + 148}" text-anchor="middle" font-size="13" font-weight="500" fill="#9dacaf">${escapeXml(alternatives)}</text>` : ""}`;
}

function teamPanel(label, slots, portraits, { x, y, width, accent, prefix }) {
  const slotWidth = Math.floor((width - 48) / 3);
  return `
    <rect x="${x}" y="${y}" width="${width}" height="238" rx="18" fill="#1a2e32" stroke="#365158" />
    <text x="${x + 24}" y="${y + 34}" font-size="13" font-weight="700" letter-spacing="2" fill="${accent}">${escapeXml(label.toUpperCase())}</text>
    ${slots.map((slot, index) => portrait(
      slot,
      portraits.get(slot.id),
      x + 24 + index * slotWidth + Math.max(0, Math.floor((slotWidth - 96) / 2)),
      y + 58,
      `${prefix}-${index}`,
    )).join("")}`;
}

function strategySvg(preview, portraits) {
  const attackSlots = teamSlots(preview.attack, preview.attackAlternatives, "attack");
  const defenseSlots = teamSlots(preview.defense, preview.defenseAlternatives, "defense");
  const attackLabel = teamLabel(preview.attack, preview.attackAlternatives, "attack", 70);
  const defenseLabel = teamLabel(preview.defense, preview.defenseAlternatives, "defense", 70);
  const titleLines = wrapText(`${attackLabel} vs ${defenseLabel}`, 66, 2);
  const positive = Number(preview.positiveCount) || 0;
  const negative = Number(preview.negativeCount) || 0;
  const order = compactText(preview.sections?.turnOrder, 112);
  return `
    <text x="60" y="54" font-size="16" font-weight="700" letter-spacing="2.4" fill="#b86749">OXYTOCIN FAMILY · SIEGE</text>
    <text x="1140" y="54" text-anchor="end" font-size="15" font-weight="600" fill="#9dacaf">COUNTER ${escapeXml(preview.shortId)}</text>
    ${titleLines.map((line, index) => `<text x="60" y="${102 + index * 38}" font-size="31" font-weight="700" fill="#f0eee6">${escapeXml(line)}</text>`).join("")}
    ${teamPanel("Seu ataque", attackSlots, portraits, { x: 60, y: 178, width: 520, accent: "#7fac9f", prefix: "attack" })}
    ${teamPanel("Defesa inimiga", defenseSlots, portraits, { x: 620, y: 178, width: 520, accent: "#d47b58", prefix: "defense" })}
    <rect x="60" y="442" width="1080" height="66" rx="14" fill="#223b40" />
    <text x="84" y="469" font-size="12" font-weight="700" letter-spacing="1.5" fill="#9dacaf">CONFIANÇA</text>
    <text x="84" y="493" font-size="18" font-weight="700" fill="#f0eee6">${escapeXml(formatSafety(preview.safety))} · ${escapeXml(formatStatus(preview.status))}</text>
    <text x="1116" y="482" text-anchor="end" font-size="18" font-weight="700" fill="#7fac9f">+${positive}</text>
    <text x="1072" y="482" text-anchor="end" font-size="18" font-weight="700" fill="#d47b58">−${negative}</text>
    <text x="60" y="550" font-size="13" font-weight="700" letter-spacing="1.5" fill="#7faec3">ORDEM DE TURNO</text>
    <text x="60" y="579" font-size="17" font-weight="500" fill="#c3cccb">${escapeXml(order || "Consulte o plano completo antes do ataque.")}</text>
    <text x="1140" y="610" text-anchor="end" font-size="14" font-weight="600" fill="#9dacaf">Por ${escapeXml(preview.player || "Oxytocin")}</text>`;
}

function defenseSvg(preview, portraits) {
  const defenseSlots = teamSlots(preview.defense, preview.defenseAlternatives, "defense");
  const defenseLabel = teamLabel(preview.defense, preview.defenseAlternatives, "defense", 92);
  const titleLines = wrapText(defenseLabel, 58, 2);
  const strategies = Array.isArray(preview.strategies) ? preview.strategies.slice(0, 3) : [];
  const counterLines = strategies.map((strategy) => (
    teamLabel(strategy.attack, strategy.attackAlternatives, "attack", 72)
  ));
  const counterCount = Number(preview.counterCount) || 0;
  const provenCount = Number(preview.provenCount) || 0;
  return `
    <text x="60" y="54" font-size="16" font-weight="700" letter-spacing="2.4" fill="#b86749">OXYTOCIN FAMILY · SIEGE</text>
    <text x="1140" y="54" text-anchor="end" font-size="15" font-weight="600" fill="#9dacaf">DEFESA ${escapeXml(preview.shortId)}</text>
    ${titleLines.map((line, index) => `<text x="60" y="${105 + index * 42}" font-size="35" font-weight="700" fill="#f0eee6">${escapeXml(line)}</text>`).join("")}
    ${teamPanel("Defesa encontrada", defenseSlots, portraits, { x: 60, y: 190, width: 520, accent: "#d47b58", prefix: "defense" })}
    <rect x="620" y="190" width="520" height="238" rx="18" fill="#1a2e32" stroke="#365158" />
    <text x="646" y="228" font-size="13" font-weight="700" letter-spacing="2" fill="#7fac9f">COUNTERS DISPONÍVEIS</text>
    <text x="646" y="283" font-size="42" font-weight="700" fill="#f0eee6">${counterCount}</text>
    <text x="704" y="282" font-size="16" font-weight="600" fill="#c3cccb">${counterCount === 1 ? "opção cadastrada" : "opções cadastradas"}</text>
    <text x="646" y="322" font-size="15" font-weight="600" fill="#7faec3">${provenCount} ${provenCount === 1 ? "counter testado" : "counters testados"}</text>
    ${counterLines.map((line, index) => `<text x="646" y="${360 + index * 26}" font-size="15" font-weight="500" fill="#c3cccb">${index + 1}. ${escapeXml(line)}</text>`).join("")}
    <rect x="60" y="466" width="1080" height="100" rx="16" fill="#223b40" />
    <text x="88" y="502" font-size="13" font-weight="700" letter-spacing="1.6" fill="#9dacaf">DECIDA ANTES DE ATACAR</text>
    <text x="88" y="539" font-size="20" font-weight="600" fill="#f0eee6">Compare segurança, riscos, ordem de turno e builds.</text>
    <text x="1140" y="610" text-anchor="end" font-size="14" font-weight="600" fill="#9dacaf">oxytocin-family-siege-teams.vercel.app</text>`;
}

function renderSvg(preview, portraits) {
  const content = preview?.kind === "defense"
    ? defenseSvg(preview, portraits)
    : strategySvg(preview, portraits);
  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#142428" />
      <rect x="0" y="0" width="${WIDTH}" height="8" fill="#b86749" />
      <g font-family="DM Sans, Arial, sans-serif">${content}</g>
    </svg>`;
}

function genericSvg() {
  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#142428" />
      <rect x="0" y="0" width="${WIDTH}" height="8" fill="#b86749" />
      <g font-family="DM Sans, Arial, sans-serif">
        <text x="60" y="72" font-size="17" font-weight="700" letter-spacing="2.4" fill="#b86749">OXYTOCIN FAMILY · SIEGE</text>
        <text x="60" y="235" font-size="54" font-weight="700" fill="#f0eee6">Oxytocin Siege Teams</text>
        <text x="60" y="295" font-size="25" font-weight="500" fill="#c3cccb">Counters testados e compartilhados pela guilda.</text>
        <rect x="60" y="370" width="1080" height="120" rx="18" fill="#1a2e32" stroke="#365158" />
        <text x="92" y="422" font-size="14" font-weight="700" letter-spacing="1.8" fill="#7fac9f">BUSCA RÁPIDA DE COUNTER</text>
        <text x="92" y="460" font-size="20" font-weight="600" fill="#f0eee6">Encontre a defesa, confira os riscos e entre preparado.</text>
      </g>
    </svg>`;
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const requestUrl = new URL(request.url);
    const kind = requestUrl.searchParams.get("kind");
    const key = requestUrl.searchParams.get("key");
    try {
      const preview = await fetchSharePreview(kind, key);
      const slots = preview?.kind === "strategy"
        ? [
          ...teamSlots(preview.attack, preview.attackAlternatives, "attack"),
          ...teamSlots(preview.defense, preview.defenseAlternatives, "defense"),
        ]
        : preview?.kind === "defense"
          ? teamSlots(preview.defense, preview.defenseAlternatives, "defense")
          : [];
      const portraits = await loadPortraits(slots, requestUrl.origin);
      const svg = preview ? renderSvg(preview, portraits) : genericSvg();
      const image = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
      return new Response(request.method === "HEAD" ? null : image, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": String(image.length),
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      console.error("share_image_failed", { kind, key, message: error?.message });
      const image = await sharp(Buffer.from(genericSvg())).png({ compressionLevel: 9 }).toBuffer();
      return new Response(request.method === "HEAD" ? null : image, {
        status: 503,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": String(image.length),
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  },
};
