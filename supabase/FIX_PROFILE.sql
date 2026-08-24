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
