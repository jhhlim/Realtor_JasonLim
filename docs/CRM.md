# Jason Lim Realty CRM

Private CRM at `/admin` — not indexed, auth-protected.

## Setup (project `zzkmedhrpvndvnnrgaus`)

1. **Run SQL** in [SQL Editor](https://supabase.com/dashboard/project/zzkmedhrpvndvnnrgaus/sql/new) — paste and run **in order**:
   - `supabase/migrations/20260824000000_crm_phase1.sql`
   - `supabase/migrations/20260824010000_crm_phase2_contacts_import.sql`

2. **Create login user** in [Auth → Users](https://supabase.com/dashboard/project/zzkmedhrpvndvnnrgaus/auth/users):
   - **Add user** → **Create new user**
   - Email + password
   - Enable **Auto Confirm User** (so email verification isn’t required)

3. **API keys** from [Project Settings → API](https://supabase.com/dashboard/project/zzkmedhrpvndvnnrgaus/settings/api) → add to `.env.local` **and** Vercel env:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zzkmedhrpvndvnnrgaus.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon public
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # service_role — server only
```

4. **Redeploy** Vercel (or restart `npm run dev`) and open `/admin/login`.

Optional CLI (after keys are in `.env.local`):

```bash
CRM_SETUP_PASSWORD='your-password' node scripts/supabase-setup.mjs create-user you@email.com
node scripts/supabase-setup.mjs check
```

Optional: after noting your user UUID from Auth, uncomment and run `supabase/seed_demo_contacts.sql`.

## Setup (generic)

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
