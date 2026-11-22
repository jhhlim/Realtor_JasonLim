-- Private disclosure package intake for /disclosure-review
-- Access via service role only (no public RLS policies granting read/write).

create table if not exists public.disclosure_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  property_address text not null,
  full_name text not null,
  email text not null,
  phone text,
  preferred_contact text not null default 'email',
  offer_deadline date,
  working_with_agent text,
  attention_notes text,
  consent boolean not null default false,
  status text not null default 'pending_upload'
    check (status in (
      'pending_upload',
      'processing',
      'ready_for_jason',
      'received_no_ai',
      'failed'
    )),
  file_meta jsonb not null default '[]'::jsonb,
  unreadable_pages jsonb not null default '[]'::jsonb,
  draft_report jsonb,
  error_message text,
  notified_at timestamptz
);

create index if not exists disclosure_requests_created_at_idx
  on public.disclosure_requests (created_at desc);

create index if not exists disclosure_requests_status_idx
  on public.disclosure_requests (status);

alter table public.disclosure_requests enable row level security;

-- No policies for anon/authenticated — service role bypasses RLS.

comment on table public.disclosure_requests is
  'Buyer disclosure package requests. PDFs live in private storage bucket disclosure-packages.';
