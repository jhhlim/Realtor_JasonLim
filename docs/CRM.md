# Jason Lim Realty CRM

Private CRM at `/admin` — not indexed, auth-protected.

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. In SQL Editor, run **in order**:
   - `supabase/migrations/20260824000000_crm_phase1.sql`
   - `supabase/migrations/20260824010000_crm_phase2_contacts_import.sql`
3. Auth → Users → **Add user** (email + password) for your CRM login.
4. Copy project URL + anon key + service role key into `.env.local` / Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server only — never expose to client
```

5. Restart `npm run dev` and open http://localhost:3000/admin/login

Optional: after noting your user UUID from Auth, uncomment and run `supabase/seed_demo_contacts.sql`.

## Phase 1

- Route group `(site)` for public marketing
- `/admin` shell with left nav + auth middleware
- Full CRM PostgreSQL schema + RLS

## Phase 2 ✅

- Quick **+ New Contact** (global FAB + modal; name-only minimum)
- Contacts list with search / status / source filters
- Contact profile: details, classification, quick notes, activity timeline
- Unlimited timestamped notes (create / pin / delete / search)
- Import: **Apple Contacts (.vcf)**, CSV, vCard
- Preview → select → classify batch → duplicate Merge/Skip/Create
- `crm_contact` flag so personal address book doesn’t clutter All Contacts
- Import history

### Phase 2 routes

- `/admin/contacts`
- `/admin/contacts/new`
- `/admin/contacts/[id]`
- `/admin/contacts/import`
- `/admin/contacts/import/history`

## Later

3 Tasks polish · 4 Pipeline/open houses · 5–7 Email · 8 Analytics
