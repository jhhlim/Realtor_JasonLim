-- ========== PHASE 1 — paste all of this in Supabase SQL Editor ==========
-- Jason Lim Realty CRM — Phase 1 schema
-- Run in Supabase SQL Editor (or via supabase db push).
-- Requires: auth.users from Supabase Auth.

-- Extensions
create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users; supports future team members)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'agent' check (role in ('owner', 'agent', 'assistant')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tags
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  unique (owner_id, name)
);

-- Groups
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (owner_id, name)
);

-- Contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  first_name text not null,
  last_name text not null default '',
  email text,
  phone text,
  secondary_phone text,
  preferred_contact_method text check (
    preferred_contact_method is null
    or preferred_contact_method in ('call', 'text', 'email', 'any')
  ),
  -- Classification (multi via boolean flags for fast filter)
  is_buyer boolean not null default false,
  is_seller boolean not null default false,
  is_renter boolean not null default false,
  is_investor boolean not null default false,
  is_neighbor boolean not null default false,
  is_referral boolean not null default false,
  is_other boolean not null default false,
  -- Lead
  lead_source text,
  source_detail text,
  lead_status text not null default 'new'
    check (lead_status in (
      'new',
      'attempted_contact',
      'contacted',
      'nurture',
      'active_buyer',
      'active_seller',
      'active_renter',
      'under_contract',
      'closed',
      'lost',
      'archived'
    )),
  temperature text not null default 'warm'
    check (temperature in ('hot', 'warm', 'cold')),
  -- Buyer prefs
  budget_min numeric,
  budget_max numeric,
  desired_cities text[] default '{}',
  desired_zips text[] default '{}',
  neighborhoods text[] default '{}',
  bedrooms_min numeric,
  bathrooms_min numeric,
  property_types text[] default '{}',
  target_purchase_date date,
  preapproval_status text,
  lender text,
  current_housing text,
  -- Seller
  seller_property_address text,
  seller_estimated_value numeric,
  selling_timeframe text,
  reason_for_selling text,
  -- Renter
  monthly_budget numeric,
  desired_move_in date,
  has_cosigner boolean,
  has_pets boolean,
  -- Follow-up
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  outreach_interval_days integer default 4,
  -- Email compliance
  email_opt_out boolean not null default false,
  email_opt_out_at timestamptz,
  unsubscribe_token uuid not null default gen_random_uuid(),
  -- Misc
  key_background text,
  notes text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_owner_idx on public.contacts (owner_id);
create index if not exists contacts_status_idx on public.contacts (owner_id, lead_status);
create index if not exists contacts_email_idx on public.contacts (owner_id, lower(email));
create index if not exists contacts_followup_idx on public.contacts (owner_id, next_follow_up_at);
create index if not exists contacts_search_idx on public.contacts
  using gin (
    to_tsvector(
      'english',
      coalesce(first_name, '') || ' ' ||
      coalesce(last_name, '') || ' ' ||
      coalesce(email, '') || ' ' ||
      coalesce(phone, '') || ' ' ||
      coalesce(source_detail, '') || ' ' ||
      coalesce(notes, '')
    )
  );

drop trigger if exists contacts_updated_at on public.contacts;
create trigger contacts_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

create table if not exists public.contact_tags (
  contact_id uuid not null references public.contacts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (contact_id, tag_id)
);

create table if not exists public.contact_groups (
  contact_id uuid not null references public.contacts (id) on delete cascade,
  group_id uuid not null references public.groups (id) on delete cascade,
  primary key (contact_id, group_id)
);

-- Activities / notes / tasks
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete cascade,
  type text not null check (type in (
    'note',
    'call',
    'text',
    'email',
    'email_opened',
    'email_clicked',
    'meeting',
    'showing',
    'open_house',
    'offer',
    'status_change',
    'property_viewed',
    'property_interest',
    'task_completed',
    'contact_created',
    'other'
  )),
  title text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists activities_contact_idx on public.activities (contact_id, occurred_at desc);
create index if not exists activities_owner_idx on public.activities (owner_id, occurred_at desc);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  body text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  title text not null,
  description text,
  due_at timestamptz,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_owner_due_idx on public.tasks (owner_id, due_at) where not completed;

-- Properties
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  address text not null,
  city text,
  state text default 'CA',
  zip text,
  list_price numeric,
  beds numeric,
  baths numeric,
  sqft integer,
  property_type text,
  mls_number text,
  listing_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  relationship text not null default 'interested'
    check (relationship in (
      'interested',
      'viewed_online',
      'showing_scheduled',
      'toured',
      'considering',
      'offer',
      'rejected',
      'not_interested'
    )),
  notes text,
  created_at timestamptz not null default now(),
  unique (contact_id, property_id, relationship)
);

-- Open houses
create table if not exists public.open_houses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  property_address text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  listing_agent text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.open_house_visitors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  open_house_id uuid not null references public.open_houses (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  visited_at timestamptz,
  interest_level text,
  notes text,
  created_at timestamptz not null default now()
);

-- Pipeline / opportunities
create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  pipeline_type text not null check (pipeline_type in ('buyer', 'seller')),
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (owner_id, pipeline_type, name)
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  pipeline_type text not null check (pipeline_type in ('buyer', 'seller')),
  stage_id uuid references public.pipeline_stages (id) on delete set null,
  title text,
  budget_or_value numeric,
  estimated_commission numeric,
  source text,
  status text not null default 'open' check (status in ('open', 'won', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Email
create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  subject text not null,
  body_html text not null,
  body_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  subject text not null,
  body_html text not null,
  body_text text,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_filter jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  campaign_id uuid references public.email_campaigns (id) on delete set null,
  resend_id text,
  direction text not null default 'outbound' check (direction in ('outbound', 'inbound')),
  to_email text not null,
  from_email text,
  subject text not null,
  body_html text,
  body_text text,
  status text not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists emails_resend_idx on public.emails (resend_id);
create index if not exists emails_contact_idx on public.emails (contact_id, created_at desc);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete cascade,
  email_id uuid references public.emails (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  campaign_id uuid references public.email_campaigns (id) on delete set null,
  event_type text not null check (event_type in (
    'queued', 'sent', 'delivered', 'bounced', 'complained',
    'opened', 'clicked', 'unsubscribed'
  )),
  link_url text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.email_campaigns (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  email_id uuid references public.emails (id) on delete set null,
  status text not null default 'pending',
  unique (campaign_id, contact_id)
);

-- Action plans (sequences — architecture for later automation)
create table if not exists public.action_plans (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.action_plan_steps (
  id uuid primary key default gen_random_uuid(),
  action_plan_id uuid not null references public.action_plans (id) on delete cascade,
  day_offset integer not null default 0,
  step_type text not null check (step_type in ('email', 'call', 'task', 'note')),
  title text not null,
  template_id uuid references public.email_templates (id) on delete set null,
  position integer not null default 0
);

create table if not exists public.contact_action_plans (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  action_plan_id uuid not null references public.action_plans (id) on delete cascade,
  started_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'cancelled')),
  unique (contact_id, action_plan_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.tags enable row level security;
alter table public.groups enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_tags enable row level security;
alter table public.contact_groups enable row level security;
alter table public.activities enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.properties enable row level security;
alter table public.contact_properties enable row level security;
alter table public.open_houses enable row level security;
alter table public.open_house_visitors enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.opportunities enable row level security;
alter table public.email_templates enable row level security;
alter table public.email_campaigns enable row level security;
alter table public.emails enable row level security;
alter table public.email_events enable row level security;
alter table public.campaign_recipients enable row level security;
alter table public.action_plans enable row level security;
alter table public.action_plan_steps enable row level security;
alter table public.contact_action_plans enable row level security;

-- Profiles: users see/update own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Owner-scoped helper policies (owner_id = auth.uid())
create policy "tags_all_own" on public.tags
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "groups_all_own" on public.groups
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "contacts_all_own" on public.contacts
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "activities_all_own" on public.activities
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "notes_all_own" on public.notes
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "tasks_all_own" on public.tasks
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "properties_all_own" on public.properties
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "contact_properties_all_own" on public.contact_properties
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "open_houses_all_own" on public.open_houses
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "open_house_visitors_all_own" on public.open_house_visitors
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "pipeline_stages_all_own" on public.pipeline_stages
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "opportunities_all_own" on public.opportunities
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "email_templates_all_own" on public.email_templates
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "email_campaigns_all_own" on public.email_campaigns
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "emails_all_own" on public.emails
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "email_events_all_own" on public.email_events
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "action_plans_all_own" on public.action_plans
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "contact_action_plans_all_own" on public.contact_action_plans
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Junction tables via contact ownership
create policy "contact_tags_via_contact" on public.contact_tags
  for all using (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.owner_id = auth.uid()
    )
  );

create policy "contact_groups_via_contact" on public.contact_groups
  for all using (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.owner_id = auth.uid()
    )
  );

create policy "campaign_recipients_via_campaign" on public.campaign_recipients
  for all using (
    exists (
      select 1 from public.email_campaigns ec
      where ec.id = campaign_id and ec.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.email_campaigns ec
      where ec.id = campaign_id and ec.owner_id = auth.uid()
    )
  );

create policy "action_plan_steps_via_plan" on public.action_plan_steps
  for all using (
    exists (
      select 1 from public.action_plans ap
      where ap.id = action_plan_id and ap.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.action_plans ap
      where ap.id = action_plan_id and ap.owner_id = auth.uid()
    )
  );

-- ========== PHASE 2 — runs after Phase 1 succeeds ==========
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
-- Run this in Supabase SQL Editor if contact import fails for every row.
-- Cause: Auth user was created before CRM tables, so no profiles row exists.
-- Contacts.owner_id requires a matching public.profiles id.

insert into public.profiles (id, email, full_name)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', split_part(coalesce(email, ''), '@', 1))
from auth.users
on conflict (id) do nothing;

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
