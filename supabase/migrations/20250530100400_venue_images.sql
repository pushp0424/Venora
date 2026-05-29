-- venue_images: gallery assets for published venues

create table if not exists public.venue_images (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues (id) on delete cascade,
  storage_path text,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists venue_images_venue_id_idx on public.venue_images (venue_id);
create index if not exists venue_images_venue_sort_idx on public.venue_images (venue_id, sort_order);
create unique index if not exists venue_images_one_cover_per_venue
  on public.venue_images (venue_id)
  where is_cover = true;

drop trigger if exists venue_images_set_updated_at on public.venue_images;
create trigger venue_images_set_updated_at
  before update on public.venue_images
  for each row
  execute function public.set_updated_at();
