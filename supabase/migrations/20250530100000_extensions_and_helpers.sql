-- Venora production foundation: extensions and shared helpers
-- Safe to re-run (idempotent drops/creates where noted)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Role helpers (used by RLS across all tables)
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

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select public.normalize_profile_role(role)
  from public.profiles
  where id = auth.uid();
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

create or replace function public.is_client()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'client'
  );
$$;

-- ---------------------------------------------------------------------------
-- Generic updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Slug helper for venue / submission identifiers (text id, app-compatible)
create or replace function public.slugify(value text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '-', 'g'));
$$;
