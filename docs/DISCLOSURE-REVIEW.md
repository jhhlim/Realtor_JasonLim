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

Run the migration in the Supabase SQL editor (or CLI):

`supabase/migrations/20261122000000_disclosure_requests.sql`

The API will auto-create the private storage bucket `disclosure-packages` on first use.

## Env

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...          # enables AI draft; uploads still work without it
AI_ENABLED=true
# Optional force:
# DISCLOSURE_UPLOADS_ENABLED=true|false
```

Also set the same keys on **Vercel** for production.

## Privacy / safety

- Bucket is private; drafts stay in `disclosure_requests.draft_report` for Jason
- Document text is not returned to the public client and should not be logged
- Buyer confirmation does not claim a fixed turnaround
- OCR is not enabled; scanned pages are flagged as unreadable
