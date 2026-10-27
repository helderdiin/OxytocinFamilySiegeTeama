import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputPath = resolve("dist/supabase-config.js");
const url = process.env.SUPABASE_URL?.trim();
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

if (!url && !publishableKey && existsSync(outputPath)) {
  console.log("Using the existing local Supabase configuration.");
  process.exit(0);
}

if (!url || !publishableKey) {
  throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required for the production build.");
}

const parsedUrl = new URL(url);
if (parsedUrl.protocol !== "https:" || !parsedUrl.hostname.endsWith(".supabase.co")) {
  throw new Error("SUPABASE_URL must be a valid https://*.supabase.co URL.");
}

if (!publishableKey.startsWith("sb_publishable_")) {
  throw new Error("SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key.");
}

const config = `window.OXYTOCIN_SUPABASE = ${JSON.stringify({ url, publishableKey }, null, 2)};\n`;
writeFileSync(outputPath, config, "utf8");
console.log("Generated dist/supabase-config.js for deployment.");
