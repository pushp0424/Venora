-- enquiries: contact form and venue inquiry messages

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  venue_id text references public.venues (id) on delete set null,
  venue_name text,
  client_id uuid references public.profiles (id) on delete set null,
  host_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  source text not null default 'contact_form',
  status text not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enquiries_source_check
    check (source in ('contact_form', 'venue_page', 'homepage', 'other')),
  constraint enquiries_status_check
    check (status in ('new', 'in_progress', 'replied', 'closed', 'spam'))
);

create index if not exists enquiries_venue_id_idx on public.enquiries (venue_id);
create index if not exists enquiries_client_id_idx on public.enquiries (client_id);
create index if not exists enquiries_host_id_idx on public.enquiries (host_id);
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_email_idx on public.enquiries (email);

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row
  execute function public.set_updated_at();

-- Auto-assign host_id from venue when enquiry targets a listing
create or replace function public.set_enquiry_host_from_venue()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_host uuid;
  v_name text;
begin
  if new.venue_id is not null then
    select host_id, name into v_host, v_name
    from public.venues
    where id = new.venue_id;

    new.host_id := coalesce(new.host_id, v_host);
    new.venue_name := coalesce(new.venue_name, v_name);
  end if;
  return new;
end;
$$;

drop trigger if exists enquiries_set_host_from_venue on public.enquiries;
create trigger enquiries_set_host_from_venue
  before insert on public.enquiries
  for each row
  execute function public.set_enquiry_host_from_venue();
