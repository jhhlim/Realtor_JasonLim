-- Phase 2: CRM contact flag, phone normalize, import history

alter table public.contacts
  add column if not exists crm_contact boolean not null default true;

alter table public.contacts
  add column if not exists phone_normalized text;

alter table public.contacts
  add column if not exists secondary_phone_normalized text;

alter table public.contacts
  add column if not exists organization text;

alter table public.contacts
  add column if not exists job_title text;

create index if not exists contacts_crm_idx
  on public.contacts (owner_id, crm_contact)
  where crm_contact = true;

create index if not exists contacts_phone_norm_idx
  on public.contacts (owner_id, phone_normalized)
  where phone_normalized is not null;

-- Import jobs / history
create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  source_type text not null check (source_type in ('csv', 'vcf', 'apple_contacts')),
  file_name text,
  status text not null default 'completed'
    check (status in ('pending', 'preview', 'completed', 'failed')),
  processed integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  merged_count integer not null default 0,
  skipped_count integer not null default 0,
  failed_count integer not null default 0,
  defaults jsonb not null default '{}'::jsonb,
  error_summary text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists import_jobs_owner_idx
  on public.import_jobs (owner_id, created_at desc);

alter table public.import_jobs enable row level security;

create policy "import_jobs_all_own" on public.import_jobs
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Ensure notes.updated_at trigger
drop trigger if exists notes_updated_at on public.notes;
create trigger notes_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();
