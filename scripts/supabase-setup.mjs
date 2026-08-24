#!/usr/bin/env node
/**
 * One-time CRM Supabase setup helper.
 *
 * Usage (after adding keys to .env.local):
 *   node scripts/supabase-setup.mjs create-user lim.jasonn@gmail.com
 *   CRM_SETUP_PASSWORD='your-password' node scripts/supabase-setup.mjs create-user lim.jasonn@gmail.com
 *   node scripts/supabase-setup.mjs check
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const i = trimmed.indexOf("=");
      if (i === -1) continue;
      const key = trimmed.slice(0, i).trim();
      let val = trimmed.slice(i + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function requireConfig() {
  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
    console.error(
      "Get keys: https://supabase.com/dashboard/project/zzkmedhrpvndvnnrgaus/settings/api",
    );
    process.exit(1);
  }
}

async function createUser(email) {
  requireConfig();
  const password = process.env.CRM_SETUP_PASSWORD;
  if (!password) {
    console.error("Set CRM_SETUP_PASSWORD in your shell (not in git).");
    process.exit(1);
  }

  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Create user failed:", data.msg || data.message || data);
    process.exit(1);
  }

  console.log("User created:", data.email, "id:", data.id);
  console.log("Login at /admin/login with that email and password.");
}

async function check() {
  console.log("NEXT_PUBLIC_SUPABASE_URL:", url ? "set" : "MISSING");
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", anonKey ? "set" : "MISSING");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? "set" : "MISSING");

  if (!url || !anonKey) {
    console.log("\nAdd anon + URL to .env.local and Vercel, then redeploy.");
    return;
  }

  const res = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: anonKey },
  });
  console.log("Auth API reachable:", res.ok ? "yes" : `no (${res.status})`);
}

const [cmd, email] = process.argv.slice(2);

if (cmd === "create-user" && email) {
  await createUser(email);
} else if (cmd === "check") {
  await check();
} else {
  console.log(`Usage:
  node scripts/supabase-setup.mjs check
  CRM_SETUP_PASSWORD='...' node scripts/supabase-setup.mjs create-user you@email.com`);
}
