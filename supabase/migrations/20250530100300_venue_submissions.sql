-- venue_submissions: host draft/pending/rejected; approved rows are copied into venues

create table if not exists public.venue_submissions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  proposed_venue_id text not null,
  published_venue_id text references public.venues (id) on delete set null,
  name text not null,
  city text not null,
  location text not null,
  price text not null,
  price_amount integer not null check (price_amount >= 0),
  rating text not null default '0',
  image text not null default '',
  tag text not null default '',
  description text not null default '',
  capacity text not null,
  capacity_max integer not null check (capacity_max > 0),
  availability text not null default 'available',
  status text not null default 'pending',
  rejection_reason text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint venue_submissions_availability_check
    check (availability in ('available', 'limited', 'unavailable')),
  constraint venue_submissions_status_check
    check (status in ('pending', 'approved', 'rejected', 'draft')),
  constraint venue_submissions_proposed_venue_id_unique unique (proposed_venue_id)
);

-- FK from venues to submissions (added after both tables exist)
alter table public.venues drop constraint if exists venues_submission_id_fkey;
alter table public.venues
  add constraint venues_submission_id_fkey
  foreign key (submission_id) references public.venue_submissions (id) on delete set null;

create index if not exists venue_submissions_host_id_idx on public.venue_submissions (host_id);
create index if not exists venue_submissions_status_idx on public.venue_submissions (status);
create index if not exists venue_submissions_submitted_at_idx on public.venue_submissions (submitted_at desc);
create index if not exists venue_submissions_published_venue_id_idx on public.venue_submissions (published_venue_id);

drop trigger if exists venue_submissions_set_updated_at on public.venue_submissions;
create trigger venue_submissions_set_updated_at
  before update on public.venue_submissions
  for each row
  execute function public.set_updated_at();
