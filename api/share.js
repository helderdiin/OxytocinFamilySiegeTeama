import { readFileSync } from "node:fs";
import { buildShareMeta, fetchSharePreview, shareRoute } from "../lib/share-preview.js";

const appHtml = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");

function escapeAttribute(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function injectShareMetadata(html, { title, description, imageAlt }, canonicalUrl, imageUrl) {
  const safeTitle = escapeAttribute(title);
  const safeDescription = escapeAttribute(description);
  const safeCanonicalUrl = escapeAttribute(canonicalUrl);
  const safeImageUrl = escapeAttribute(imageUrl);
  const safeImageAlt = escapeAttribute(imageAlt);
  const tags = `
    <link rel="canonical" href="${safeCanonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Oxytocin Siege Teams" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeCanonicalUrl}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:secure_url" content="${safeImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeImageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImageUrl}" />`;

  return html
    .replace(/<title>[^<]*<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/i, `<meta name="description" content="${safeDescription}" />`)
    .replace("</head>", `${tags}\n  </head>`);
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
      const metadata = buildShareMeta(preview);
      const route = shareRoute(preview);
      const canonicalUrl = new URL(route, requestUrl.origin).toString();
      const imageVersion = preview?.updatedAt ? Date.parse(preview.updatedAt) || 1 : 1;
      const imageUrl = new URL(
        `/api/og.js?kind=${encodeURIComponent(preview?.kind || kind || "strategy")}&key=${encodeURIComponent(preview?.shortId || key || "")}&v=${imageVersion}`,
        requestUrl.origin,
      ).toString();
      const responseHtml = injectShareMetadata(appHtml, metadata, canonicalUrl, imageUrl);
      const status = preview ? 200 : 404;
      return new Response(request.method === "HEAD" ? null : responseHtml, {
        status,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      console.error("share_preview_failed", { kind, key, message: error?.message });
      const fallbackMetadata = buildShareMeta(null);
      const responseHtml = injectShareMetadata(
        appHtml,
        fallbackMetadata,
        new URL("/", requestUrl.origin).toString(),
        new URL("/api/og.js?kind=generic&key=GENERIC1", requestUrl.origin).toString(),
      );
      return new Response(request.method === "HEAD" ? null : responseHtml, {
        status: 503,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  },
};
