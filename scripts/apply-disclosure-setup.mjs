#!/usr/bin/env node
/**
 * Checks disclosure_requests + creates private storage bucket.
 * Table DDL must be run in Supabase SQL Editor (service role cannot CREATE TABLE via REST).
 *
 *   node scripts/apply-disclosure-setup.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

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
const projectRef = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const sqlUrl = projectRef
  ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
  : "https://supabase.com/dashboard";

console.log("Project:", projectRef || url);
console.log("SQL Editor:", sqlUrl);
console.log("");

const { error: tableError } = await supabase
  .from("disclosure_requests")
  .select("id")
  .limit(1);

if (tableError) {
  console.log("❌ disclosure_requests table missing or inaccessible");
  console.log("   ", tableError.message);
  console.log("");
  console.log("Fix: open the SQL Editor link above, paste supabase/DISCLOSURE_SETUP.sql, Run.");
} else {
  console.log("✅ disclosure_requests table OK");
}

const { data: buckets, error: bucketListError } =
  await supabase.storage.listBuckets();

if (bucketListError) {
  console.log("❌ storage list failed:", bucketListError.message);
  process.exit(1);
}

const exists = buckets?.some((b) => b.name === "disclosure-packages");
if (exists) {
  console.log("✅ disclosure-packages bucket OK");
} else {
  const { error } = await supabase.storage.createBucket("disclosure-packages", {
    public: false,
    fileSizeLimit: 20 * 1024 * 1024,
    allowedMimeTypes: ["application/pdf"],
  });
  if (error) {
    console.log("❌ bucket create failed:", error.message);
    console.log("   Create manually in Dashboard → Storage → New bucket");
    console.log("   name: disclosure-packages · public: OFF · PDF · 20MB");
  } else {
    console.log("✅ disclosure-packages bucket created");
  }
}

if (tableError) process.exit(1);
console.log("\nDisclosure upload should work after redeploy/refresh.");
