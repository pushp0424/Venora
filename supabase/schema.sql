-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.venues (
  id text primary key,
  name text not null,
  city text not null,
  location text not null,
  price text not null,
  price_amount integer not null,
  rating text not null,
  image text not null,
  tag text not null,
  description text not null,
  capacity text not null,
  capacity_max integer not null,
  created_at timestamptz not null default now()
);

alter table public.venues enable row level security;

create policy "Allow public read access on venues"
  on public.venues
  for select
  to anon, authenticated
  using (true);

-- Host registration leads (Become a Host form)
create table if not exists public.host_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  venue_name text not null,
  city text not null,
  venue_type text not null,
  capacity integer not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.host_leads enable row level security;

create policy "Allow public insert on host_leads"
  on public.host_leads
  for insert
  to anon, authenticated
  with check (true);

-- User profiles (extends Supabase Auth — single user model with role)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('admin', 'client', 'host')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Allow insert own profile on signup"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Auto-create profile when auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
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
-- Role-based platform extensions (admin / host / client dashboards)
-- Run this block if upgrading an existing database.
-- ---------------------------------------------------------------------------

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'client', 'host'));

alter table public.venues
  add column if not exists host_id uuid references public.profiles (id) on delete set null;
alter table public.venues
  add column if not exists status text not null default 'approved';
alter table public.venues
  add column if not exists availability text not null default 'available';
alter table public.venues
  add column if not exists updated_at timestamptz not null default now();

alter table public.host_leads
  add column if not exists status text not null default 'pending';
alter table public.host_leads
  add column if not exists reviewed_at timestamptz;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues (id) on delete cascade,
  venue_name text not null,
  client_id uuid references public.profiles (id) on delete set null,
  client_name text not null,
  host_id uuid references public.profiles (id) on delete set null,
  event_date date not null,
  guests integer not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  amount text not null,
  special_requests text,
  created_at timestamptz not null default now()
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now()
);

-- Helper: check if current user is admin
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

-- Profiles: admins can read all
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

-- Venues: public reads approved only
drop policy if exists "Allow public read access on venues" on public.venues;
create policy "Public read approved venues"
  on public.venues for select to anon, authenticated
  using (
    status = 'approved'
    or host_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "Admins manage all venues" on public.venues;
create policy "Admins manage all venues"
  on public.venues for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Hosts manage own venues" on public.venues;
create policy "Hosts manage own venues"
  on public.venues for all to authenticated
  using (host_id = auth.uid() and public.is_host())
  with check (host_id = auth.uid() and public.is_host());

-- Host leads: admins manage
drop policy if exists "Admins read host leads" on public.host_leads;
create policy "Admins read host leads"
  on public.host_leads for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins update host leads" on public.host_leads;
create policy "Admins update host leads"
  on public.host_leads for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.bookings enable row level security;

drop policy if exists "Admins manage bookings" on public.bookings;
create policy "Admins manage bookings"
  on public.bookings for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Hosts read own bookings" on public.bookings;
create policy "Hosts read own bookings"
  on public.bookings for select to authenticated
  using (host_id = auth.uid() and public.is_host());

drop policy if exists "Clients read own bookings" on public.bookings;
create policy "Clients read own bookings"
  on public.bookings for select to authenticated
  using (client_id = auth.uid());

alter table public.content_blocks enable row level security;

drop policy if exists "Public read content" on public.content_blocks;
create policy "Public read content"
  on public.content_blocks for select to anon, authenticated
  using (true);

drop policy if exists "Admins manage content" on public.content_blocks;
create policy "Admins manage content"
  on public.content_blocks for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.content_blocks (slug, title, body)
values
  ('homepage-hero', 'Homepage hero', 'Book premium venues for unforgettable moments.'),
  ('footer-tagline', 'Footer tagline', 'The premium platform for exceptional event venues.')
on conflict (slug) do nothing;
