-- Sequence 4 (replacement): ALTER-only upgrade for public.venues
-- Goals: idempotent, no table recreate, no data backfill, no datatype assumptions.
-- Inspects information_schema before indexes, FKs, and triggers.

do $$
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'venues'
  ) then
    raise exception 'public.venues does not exist. Create the table before running Sequence 4.';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Add missing columns (skipped automatically if the name already exists,
-- regardless of that column's current data type)
-- ---------------------------------------------------------------------------
alter table public.venues add column if not exists name text;
alter table public.venues add column if not exists city text;
alter table public.venues add column if not exists location text;
alter table public.venues add column if not exists price text;
alter table public.venues add column if not exists price_amount integer;
alter table public.venues add column if not exists rating text;
alter table public.venues add column if not exists image text;
alter table public.venues add column if not exists tag text;
alter table public.venues add column if not exists description text;
alter table public.venues add column if not exists capacity text;
alter table public.venues add column if not exists capacity_max integer;
alter table public.venues add column if not exists host_id uuid;
alter table public.venues add column if not exists submission_id uuid;
alter table public.venues add column if not exists availability text;
alter table public.venues add column if not exists status text;
alter table public.venues add column if not exists published_at timestamptz;
alter table public.venues add column if not exists created_at timestamptz;
alter table public.venues add column if not exists updated_at timestamptz;

-- ---------------------------------------------------------------------------
-- Optional FK: host_id → profiles (only when both exist)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  )
  and exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'venues'
      and column_name = 'host_id'
  )
  and not exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'venues'
      and c.conname = 'venues_host_id_fkey'
  ) then
    alter table public.venues
      add constraint venues_host_id_fkey
      foreign key (host_id) references public.profiles (id) on delete set null;
  end if;
exception
  when others then
    raise notice 'venues_host_id_fkey skipped: %', sqlerrm;
end;
$$;

-- ---------------------------------------------------------------------------
-- Indexes (only on columns that exist after ADD COLUMN above)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'venues' and column_name = 'host_id'
  ) then
    execute 'create index if not exists venues_host_id_idx on public.venues (host_id)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'venues' and column_name = 'status'
  ) then
    execute 'create index if not exists venues_status_idx on public.venues (status)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'venues' and column_name = 'city'
  ) then
    execute 'create index if not exists venues_city_idx on public.venues (city)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'venues' and column_name = 'published_at'
  ) then
    execute 'create index if not exists venues_published_at_idx on public.venues (published_at desc nulls last)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'venues' and column_name = 'submission_id'
  ) then
    execute 'create index if not exists venues_submission_id_idx on public.venues (submission_id)';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- updated_at trigger (only if helper from Sequence 1 exists)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'set_updated_at'
  )
  and exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'venues'
      and column_name = 'updated_at'
  ) then
    execute 'drop trigger if exists venues_set_updated_at on public.venues';
    execute $trg$
      create trigger venues_set_updated_at
      before update on public.venues
      for each row
      execute function public.set_updated_at()
    $trg$;
  end if;
exception
  when others then
    raise notice 'venues_set_updated_at trigger skipped: %', sqlerrm;
end;
$$;

-- RLS enable is idempotent
alter table public.venues enable row level security;
