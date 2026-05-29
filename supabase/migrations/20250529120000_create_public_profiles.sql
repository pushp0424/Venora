-- Venora: public.profiles + auth trigger + role helpers + backfill
-- Paste entire file into Supabase Dashboard → SQL → New query → Run
-- Idempotent: safe to re-run (uses IF NOT EXISTS / DROP IF EXISTS where needed)
--
-- App expectations (verified against lib/auth.ts, app/auth/actions.ts, middleware):
--   columns: id, email, full_name, role, created_at, updated_at
--   roles:   admin | client | host

-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'client', 'host'));

create index if not exists profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Allow insert own profile on signup" on public.profiles;
create policy "Allow insert own profile on signup"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 3. Role helper functions (venues/bookings RLS + admin dashboard)
-- ---------------------------------------------------------------------------
create or replace function public.normalize_profile_role(raw_role text)
returns text
language sql
immutable
as $$
  select case
    when raw_role in ('admin', 'host', 'client') then raw_role
    else 'client'
  end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_host()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'host'
  );
$$;

drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Auto-create profile on auth.users insert
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
  meta_full_name text;
begin
  meta_role := new.raw_user_meta_data->>'role';
  meta_full_name := nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), '');

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    meta_full_name,
    public.normalize_profile_role(meta_role)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 5. Backfill existing auth.users → public.profiles
-- ---------------------------------------------------------------------------
insert into public.profiles (id, email, full_name, role, created_at, updated_at)
select
  u.id,
  coalesce(u.email, ''),
  nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', '')), ''),
  public.normalize_profile_role(u.raw_user_meta_data->>'role'),
  coalesce(u.created_at, now()),
  coalesce(u.updated_at, u.created_at, now())
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

-- Ensure any pre-existing rows without a valid role default to client
update public.profiles
set
  role = 'client',
  updated_at = now()
where role is null
   or role not in ('admin', 'client', 'host');

-- Sync email/full_name from auth; upgrade role only when metadata has a valid role
update public.profiles p
set
  email = coalesce(u.email, p.email),
  full_name = coalesce(
    nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', '')), ''),
    p.full_name
  ),
  role = case
    when u.raw_user_meta_data->>'role' in ('admin', 'host', 'client')
    then u.raw_user_meta_data->>'role'
    else p.role
  end,
  updated_at = now()
from auth.users u
where u.id = p.id;
