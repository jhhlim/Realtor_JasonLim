# Jason Lim Realty CRM (Phase 1)

Private CRM at `/admin` — not indexed, auth-protected.

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. In SQL Editor, run:
   - `supabase/migrations/20260824000000_crm_phase1.sql`
3. Auth → Users → **Add user** (email + password) for your CRM login.
4. Copy project URL + anon key + service role key into `.env.local` / Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server only — never expose to client
```

5. Restart `npm run dev` and open http://localhost:3000/admin/login

Optional: after noting your user UUID from Auth, uncomment and run `supabase/seed_demo_contacts.sql`.

## Phase 1 includes

- Route group `(site)` for public marketing (unchanged UX)
- `/admin` shell with left nav
- Supabase Auth login + middleware guard
- Full CRM PostgreSQL schema + RLS (owner-scoped)
- Dashboard UI placeholders for follow-ups / lead summary / sources

## Later phases

2 Contacts CRUD · 3 Profile/notes/tasks · 4 Pipeline/open houses · 5–7 Email · 8 Import/analytics
