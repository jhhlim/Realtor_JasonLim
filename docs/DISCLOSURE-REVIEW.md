# Disclosure Review (`/disclosure-review`)

Buyer resource with sample report, walkthrough request, private PDF upload, and AI draft for Jason to review before buyer follow-up.

## Live

- Top nav tab **Disclosures** + homepage teaser
- Interactive fictional sample report (no contact info)
- **Review With Jason** walkthrough (FormSubmit)
- Secure upload when Supabase service credentials are set:
  1. `/api/disclosure-review/init` creates a `disclosure_requests` row + signed upload URLs
  2. Browser uploads PDFs directly to private bucket `disclosure-packages`
  3. `/api/disclosure-review/complete` extracts text (page-aware), flags low-text/scanned pages, drafts structured analysis with OpenAI (if `OPENAI_API_KEY` set), notifies Jason **without PDF attachments**

## One-time Supabase setup

1. Confirm the project still exists (URL must resolve, e.g. `https://<ref>.supabase.co`).
2. Run the SQL in the Supabase SQL editor:

   - Prefer: `supabase/DISCLOSURE_SETUP.sql`
   - Or migration: `supabase/migrations/20261122000000_disclosure_requests.sql`

3. Create/verify private storage bucket `disclosure-packages` (PDF, 20MB, public OFF).  
   The API and `node scripts/apply-disclosure-setup.mjs` can auto-create the bucket when the service role key works.

4. Verify:

```bash
node scripts/apply-disclosure-setup.mjs
```

If the script reports **Cannot reach Supabase URL (DNS/network)**, the project ref in `NEXT_PUBLIC_SUPABASE_URL` is dead — create a new project (or restore), update keys, then re-run SQL + the script.

### Dashboard steps (if Management API / psql unavailable)

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor** → New query  
2. Paste entire `supabase/DISCLOSURE_SETUP.sql` → **Run**  
3. **Storage** → New bucket → name `disclosure-packages` → **Public bucket: OFF** → allowed MIME `application/pdf` → size limit 20MB  
4. **Project Settings → API** → copy URL, `anon` key, `service_role` key into `.env.local` **and** Vercel

## Env (local + Vercel)

Required for secure PDF upload (same keys on **Vercel → Project → Settings → Environment Variables** for Production + Preview):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...      # browser signed uploads
SUPABASE_SERVICE_ROLE_KEY=...          # server only — never expose to the browser
```

Optional:

```bash
OPENAI_API_KEY=...          # enables AI draft; uploads still work without it
AI_ENABLED=true
# Force off while Supabase is being rebuilt (shows walkthrough-only banner):
# DISCLOSURE_UPLOADS_ENABLED=false
# Force on even during partial setup:
# DISCLOSURE_UPLOADS_ENABLED=true
```

After changing Vercel env vars, **redeploy** so production picks them up.

## Privacy / safety

- Bucket is private; drafts stay in `disclosure_requests.draft_report` for Jason
- Document text is not returned to the public client and should not be logged
- Buyer confirmation does not claim a fixed turnaround
- OCR is not enabled; scanned pages are flagged as unreadable
- Init failures (missing table, unreachable Supabase, bad env) return friendly copy and point buyers to **Review With Jason**
