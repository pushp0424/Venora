-- Business workflows: approve submissions → venues, notify users

-- Copy an approved submission into public.venues (upsert by proposed_venue_id)
create or replace function public.publish_venue_from_submission(p_submission_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.venue_submissions%rowtype;
  v_id text;
begin
  select * into s
  from public.venue_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'venue_submission % not found', p_submission_id;
  end if;

  if s.published_venue_id is not null then
    return s.published_venue_id;
  end if;

  if s.status not in ('pending', 'approved') then
    raise exception 'Cannot publish submission in status %', s.status;
  end if;

  v_id := s.proposed_venue_id;

  insert into public.venues (
    id,
    host_id,
    submission_id,
    name,
    city,
    location,
    price,
    price_amount,
    rating,
    image,
    tag,
    description,
    capacity,
    capacity_max,
    availability,
    status,
    published_at
  )
  values (
    v_id,
    s.host_id,
    s.id,
    s.name,
    s.city,
    s.location,
    s.price,
    s.price_amount,
    s.rating,
    s.image,
    s.tag,
    s.description,
    s.capacity,
    s.capacity_max,
    s.availability,
    'approved',
    now()
  )
  on conflict (id) do update set
    host_id = excluded.host_id,
    submission_id = excluded.submission_id,
    name = excluded.name,
    city = excluded.city,
    location = excluded.location,
    price = excluded.price,
    price_amount = excluded.price_amount,
    rating = excluded.rating,
    image = excluded.image,
    tag = excluded.tag,
    description = excluded.description,
    capacity = excluded.capacity,
    capacity_max = excluded.capacity_max,
    availability = excluded.availability,
    status = 'approved',
    published_at = coalesce(public.venues.published_at, now()),
    updated_at = now();

  update public.venue_submissions
  set
    status = 'approved',
    published_venue_id = v_id,
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    rejection_reason = null,
    updated_at = now()
  where id = s.id;

  perform public.create_notification(
    s.host_id,
    'venue_approved',
    'Venue approved',
    format('"%s" is now live on Venora.', s.name),
    '/host/dashboard/venues',
    jsonb_build_object('submission_id', s.id, 'venue_id', v_id)
  );

  return v_id;
end;
$$;

-- Reject submission (stays in venue_submissions only)
create or replace function public.reject_venue_submission(
  p_submission_id uuid,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.venue_submissions%rowtype;
begin
  select * into s
  from public.venue_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'venue_submission % not found', p_submission_id;
  end if;

  if s.status <> 'pending' then
    raise exception 'Only pending submissions can be rejected (current: %)', s.status;
  end if;

  update public.venue_submissions
  set
    status = 'rejected',
    rejection_reason = nullif(trim(coalesce(p_reason, '')), ''),
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    updated_at = now()
  where id = s.id;

  perform public.create_notification(
    s.host_id,
    'venue_rejected',
    'Venue submission declined',
    coalesce(nullif(trim(p_reason), ''), format('"%s" was not approved at this time.', s.name)),
    '/host/dashboard/venues',
    jsonb_build_object('submission_id', s.id)
  );
end;
$$;

-- Trigger: when admin sets status = approved, publish to venues
create or replace function public.on_venue_submission_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
    and old.status = 'pending'
    and new.status = 'approved' then
    perform public.publish_venue_from_submission(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists venue_submissions_status_change on public.venue_submissions;
create trigger venue_submissions_status_change
  after update of status on public.venue_submissions
  for each row
  execute function public.on_venue_submission_status_change();

-- Default proposed_venue_id from name when host inserts without one
create or replace function public.set_submission_proposed_venue_id()
returns trigger
language plpgsql
as $$
begin
  if new.proposed_venue_id is null or trim(new.proposed_venue_id) = '' then
    new.proposed_venue_id := public.slugify(new.name);
  end if;
  if new.proposed_venue_id is null or new.proposed_venue_id = '' then
  new.proposed_venue_id := 'venue-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  end if;
  return new;
end;
$$;

drop trigger if exists venue_submissions_set_proposed_id on public.venue_submissions;
create trigger venue_submissions_set_proposed_id
  before insert on public.venue_submissions
  for each row
  execute function public.set_submission_proposed_venue_id();

-- Notify host on new booking for their venue
create or replace function public.on_booking_created_notify()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.host_id is not null then
    perform public.create_notification(
      new.host_id,
      'booking',
      'New booking request',
      format('%s requested %s on %s.', new.client_name, new.venue_name, new.event_date::text),
      '/host/dashboard/bookings',
      jsonb_build_object('booking_id', new.id, 'venue_id', new.venue_id)
    );
  end if;

  if new.client_id is not null then
    perform public.create_notification(
      new.client_id,
      'booking',
      'Booking request sent',
      format('Your request for %s is pending confirmation.', new.venue_name),
      '/dashboard/bookings',
      jsonb_build_object('booking_id', new.id)
    );
  end if;

  perform public.increment_venue_analytics(
    new.venue_id,
    current_date,
    0,
    0,
    1,
    0
  );

  return new;
end;
$$;

drop trigger if exists bookings_created_notify on public.bookings;
create trigger bookings_created_notify
  after insert on public.bookings
  for each row
  execute function public.on_booking_created_notify();

-- Notify on new enquiry
create or replace function public.on_enquiry_created_notify()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.host_id is not null then
    perform public.create_notification(
      new.host_id,
      'enquiry',
      'New enquiry',
      format('%s sent a message about %s.', new.full_name, coalesce(new.venue_name, 'your venue')),
      '/host/dashboard',
      jsonb_build_object('enquiry_id', new.id)
    );
  end if;

  if new.venue_id is not null then
    perform public.increment_venue_analytics(
      new.venue_id,
      current_date,
      0,
      1,
      0,
      0
    );
  end if;

  return new;
end;
$$;

drop trigger if exists enquiries_created_notify on public.enquiries;
create trigger enquiries_created_notify
  after insert on public.enquiries
  for each row
  execute function public.on_enquiry_created_notify();

-- Sync venues.cover image when venue_images cover changes
create or replace function public.sync_venue_cover_image()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_cover then
    update public.venues
    set image = new.url, updated_at = now()
    where id = new.venue_id;
  end if;
  return new;
end;
$$;

drop trigger if exists venue_images_sync_cover on public.venue_images;
create trigger venue_images_sync_cover
  after insert or update of is_cover, url on public.venue_images
  for each row
  when (new.is_cover = true)
  execute function public.sync_venue_cover_image();

-- Callable from admin tools (RLS still applies on underlying tables)
grant execute on function public.publish_venue_from_submission(uuid) to authenticated;
grant execute on function public.reject_venue_submission(uuid, text) to authenticated;
grant execute on function public.increment_venue_analytics(text, date, integer, integer, integer, integer) to authenticated;
grant execute on function public.create_notification(uuid, text, text, text, text, jsonb) to authenticated;
