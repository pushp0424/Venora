-- venue_analytics: daily rollups per published venue

create table if not exists public.venue_analytics (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues (id) on delete cascade,
  metric_date date not null,
  views integer not null default 0 check (views >= 0),
  enquiries integer not null default 0 check (enquiries >= 0),
  booking_requests integer not null default 0 check (booking_requests >= 0),
  confirmed_bookings integer not null default 0 check (confirmed_bookings >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint venue_analytics_venue_date_unique unique (venue_id, metric_date)
);

create index if not exists venue_analytics_venue_id_idx on public.venue_analytics (venue_id);
create index if not exists venue_analytics_metric_date_idx on public.venue_analytics (metric_date desc);

drop trigger if exists venue_analytics_set_updated_at on public.venue_analytics;
create trigger venue_analytics_set_updated_at
  before update on public.venue_analytics
  for each row
  execute function public.set_updated_at();

-- Increment daily metrics (callable from app or edge functions)
create or replace function public.increment_venue_analytics(
  p_venue_id text,
  p_metric_date date default current_date,
  p_views integer default 0,
  p_enquiries integer default 0,
  p_booking_requests integer default 0,
  p_confirmed_bookings integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.venue_analytics (
    venue_id,
    metric_date,
    views,
    enquiries,
    booking_requests,
    confirmed_bookings
  )
  values (
    p_venue_id,
    p_metric_date,
    greatest(p_views, 0),
    greatest(p_enquiries, 0),
    greatest(p_booking_requests, 0),
    greatest(p_confirmed_bookings, 0)
  )
  on conflict (venue_id, metric_date) do update
  set
    views = public.venue_analytics.views + greatest(p_views, 0),
    enquiries = public.venue_analytics.enquiries + greatest(p_enquiries, 0),
    booking_requests = public.venue_analytics.booking_requests + greatest(p_booking_requests, 0),
    confirmed_bookings = public.venue_analytics.confirmed_bookings + greatest(p_confirmed_bookings, 0),
    updated_at = now();
end;
$$;
