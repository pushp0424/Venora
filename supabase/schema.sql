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
