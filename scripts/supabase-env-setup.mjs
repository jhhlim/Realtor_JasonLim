#!/usr/bin/env node
/**
 * Interactive Supabase env setup for local + optional Vercel.
 * Run: node scripts/supabase-env-setup.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { execSync, spawnSync } from "node:child_process";

const PROJECT_URL = "https://zzkmedhrpvndvnnrgaus.supabase.co";
const API_SETTINGS =
  "https://supabase.com/dashboard/project/zzkmedhrpvndvnnrgaus/settings/api";

const envPath = resolve(process.cwd(), ".env.local");

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolveAnswer) => {
    rl.question(question, (answer) => {
      rl.close();
      resolveAnswer(answer.trim());
    });
  });
}

function readEnvFile() {
  if (!existsSync(envPath)) return "";
  return readFileSync(envPath, "utf8");
}

function upsertEnv(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) return content.replace(re, line);
  const trimmed = content.replace(/\n?$/, "");
  return `${trimmed}\n${line}\n`;
}

function openUrl(url) {
  try {
    if (process.platform === "darwin") execSync(`open "${url}"`, { stdio: "ignore" });
    else if (process.platform === "win32") execSync(`start "" "${url}"`, { stdio: "ignore" });
    else execSync(`xdg-open "${url}"`, { stdio: "ignore" });
  } catch {
    /* ignore */
  }
}

console.log("\n🔧 Supabase CRM env setup\n");
console.log("Opening Supabase API settings in your browser…");
console.log(`If it doesn't open: ${API_SETTINGS}\n`);
openUrl(API_SETTINGS);

console.log("Copy these from the page:");
console.log("  • anon public  → NEXT_PUBLIC_SUPABASE_ANON_KEY");
console.log("  • service_role → SUPABASE_SERVICE_ROLE_KEY\n");

const anon = await ask("Paste anon public key (starts with eyJ): ");
if (!anon.startsWith("eyJ")) {
  console.error("\n❌ That doesn't look like a valid anon key. Try again.");
  process.exit(1);
}

const service = await ask("Paste service_role key (starts with eyJ): ");
if (!service.startsWith("eyJ")) {
  console.error("\n❌ That doesn't look like a valid service_role key. Try again.");
  process.exit(1);
}

let env = readEnvFile();
env = upsertEnv(env, "NEXT_PUBLIC_SUPABASE_URL", PROJECT_URL);
env = upsertEnv(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY", anon);
env = upsertEnv(env, "SUPABASE_SERVICE_ROLE_KEY", service);
writeFileSync(envPath, env, "utf8");

console.log("\n✅ Updated .env.local");

const vercel = await ask("\nAdd same vars to Vercel? (y/n): ");
if (vercel.toLowerCase() === "y") {
  console.log("\nYou may need to log in to Vercel in the browser…\n");
  for (const [key, val] of [
    ["NEXT_PUBLIC_SUPABASE_URL", PROJECT_URL],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", anon],
    ["SUPABASE_SERVICE_ROLE_KEY", service],
  ]) {
    console.log(`Adding ${key}…`);
    const r = spawnSync(
      "npx",
      ["vercel", "env", "add", key, "production", "preview", "development"],
      {
        input: val,
        encoding: "utf8",
        stdio: ["pipe", "inherit", "inherit"],
      },
    );
    if (r.status !== 0) {
      console.log(`\n⚠️  Could not add ${key} via CLI. Add manually in Vercel → Settings → Environment Variables`);
      break;
    }
  }
  console.log("\nRedeploy on Vercel for production to pick up new vars.");
}

console.log("\nNext:");
console.log("  1. Restart dev server: npm run dev");
console.log("  2. Login: http://localhost:3000/admin/login");
console.log("  3. Production: redeploy Vercel after env vars are set\n");
