-- bookings: reservation requests (clients create; hosts/admins manage)

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues (id) on delete restrict,
  venue_name text not null,
  client_id uuid references public.profiles (id) on delete set null,
  client_name text not null,
  client_email text,
  host_id uuid references public.profiles (id) on delete set null,
  event_date date not null,
  guests integer not null check (guests > 0),
  status text not null default 'pending',
  amount text not null,
  special_requests text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_status_check
    check (status in ('pending', 'confirmed', 'cancelled', 'declined'))
);

-- Upgrade legacy bookings
alter table public.bookings add column if not exists client_email text;
alter table public.bookings add column if not exists admin_notes text;
alter table public.bookings add column if not exists updated_at timestamptz not null default now();

alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'confirmed', 'cancelled', 'declined'));

create index if not exists bookings_venue_id_idx on public.bookings (venue_id);
create index if not exists bookings_client_id_idx on public.bookings (client_id);
create index if not exists bookings_host_id_idx on public.bookings (host_id);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_event_date_idx on public.bookings (event_date);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row
  execute function public.set_updated_at();
