-- Row Level Security: admin (all), host (own), client (own bookings), public (approved venues)

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Allow insert own profile on signup" on public.profiles;
create policy "Allow insert own profile on signup"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins manage all profiles" on public.profiles;
create policy "Admins manage all profiles"
  on public.profiles for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- venues (public: approved only)
-- ---------------------------------------------------------------------------
alter table public.venues enable row level security;

drop policy if exists "Allow public read access on venues" on public.venues;
drop policy if exists "Public read approved venues" on public.venues;
create policy "Public read approved venues"
  on public.venues for select to anon, authenticated
  using (
    status = 'approved'
    or (auth.uid() = host_id)
    or public.is_admin()
  );

drop policy if exists "Admins manage all venues" on public.venues;
create policy "Admins manage all venues"
  on public.venues for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Hosts manage own venues" on public.venues;
create policy "Hosts read own venues"
  on public.venues for select to authenticated
  using (host_id = auth.uid() and public.is_host());

-- Hosts must not insert directly into venues (use venue_submissions); admin publishes
drop policy if exists "Hosts update own venues" on public.venues;
create policy "Hosts update own venues"
  on public.venues for update to authenticated
  using (host_id = auth.uid() and public.is_host())
  with check (host_id = auth.uid() and public.is_host());

-- ---------------------------------------------------------------------------
-- venue_submissions
-- ---------------------------------------------------------------------------
alter table public.venue_submissions enable row level security;

drop policy if exists "Hosts read own submissions" on public.venue_submissions;
create policy "Hosts read own submissions"
  on public.venue_submissions for select to authenticated
  using (host_id = auth.uid() and public.is_host());

drop policy if exists "Hosts insert own submissions" on public.venue_submissions;
create policy "Hosts insert own submissions"
  on public.venue_submissions for insert to authenticated
  with check (host_id = auth.uid() and public.is_host() and status in ('pending', 'draft'));

drop policy if exists "Hosts update own pending submissions" on public.venue_submissions;
create policy "Hosts update own pending submissions"
  on public.venue_submissions for update to authenticated
  using (host_id = auth.uid() and public.is_host() and status in ('pending', 'draft', 'rejected'))
  with check (
    host_id = auth.uid()
    and public.is_host()
    and status in ('pending', 'draft', 'rejected')
  );

drop policy if exists "Admins manage all submissions" on public.venue_submissions;
create policy "Admins manage all submissions"
  on public.venue_submissions for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- venue_images
-- ---------------------------------------------------------------------------
alter table public.venue_images enable row level security;

drop policy if exists "Public read images for approved venues" on public.venue_images;
create policy "Public read images for approved venues"
  on public.venue_images for select to anon, authenticated
  using (
    exists (
      select 1 from public.venues v
      where v.id = venue_id
        and (v.status = 'approved' or v.host_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Hosts manage own venue images" on public.venue_images;
create policy "Hosts manage own venue images"
  on public.venue_images for all to authenticated
  using (
    exists (
      select 1 from public.venues v
      where v.id = venue_id and v.host_id = auth.uid() and public.is_host()
    )
  )
  with check (
    exists (
      select 1 from public.venues v
      where v.id = venue_id and v.host_id = auth.uid() and public.is_host()
    )
  );

drop policy if exists "Admins manage all venue images" on public.venue_images;
create policy "Admins manage all venue images"
  on public.venue_images for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
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

drop policy if exists "Hosts update own bookings" on public.bookings;
create policy "Hosts update own bookings"
  on public.bookings for update to authenticated
  using (host_id = auth.uid() and public.is_host())
  with check (host_id = auth.uid() and public.is_host());

drop policy if exists "Clients read own bookings" on public.bookings;
create policy "Clients read own bookings"
  on public.bookings for select to authenticated
  using (client_id = auth.uid());

drop policy if exists "Clients create own bookings" on public.bookings;
create policy "Clients create own bookings"
  on public.bookings for insert to authenticated
  with check (
    client_id = auth.uid()
    and public.is_client()
    and exists (
      select 1 from public.venues v
      where v.id = venue_id and v.status = 'approved'
    )
  );

-- ---------------------------------------------------------------------------
-- enquiries
-- ---------------------------------------------------------------------------
alter table public.enquiries enable row level security;

drop policy if exists "Anyone can submit enquiries" on public.enquiries;
create policy "Anyone can submit enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (true);

drop policy if exists "Clients read own enquiries" on public.enquiries;
create policy "Clients read own enquiries"
  on public.enquiries for select to authenticated
  using (client_id = auth.uid());

drop policy if exists "Hosts read own enquiries" on public.enquiries;
create policy "Hosts read own enquiries"
  on public.enquiries for select to authenticated
  using (host_id = auth.uid() and public.is_host());

drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Admins manage enquiries"
  on public.enquiries for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- venue_analytics
-- ---------------------------------------------------------------------------
alter table public.venue_analytics enable row level security;

drop policy if exists "Hosts read own venue analytics" on public.venue_analytics;
create policy "Hosts read own venue analytics"
  on public.venue_analytics for select to authenticated
  using (
    exists (
      select 1 from public.venues v
      where v.id = venue_id and v.host_id = auth.uid() and public.is_host()
    )
  );

drop policy if exists "Admins manage venue analytics" on public.venue_analytics;
create policy "Admins manage venue analytics"
  on public.venue_analytics for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
alter table public.notifications enable row level security;

drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
  on public.notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Admins read all notifications" on public.notifications;
create policy "Admins read all notifications"
  on public.notifications for select to authenticated
  using (public.is_admin());

-- Inserts via security definer functions (triggers) only; no direct client insert policy
