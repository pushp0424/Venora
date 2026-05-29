# Venora — Production Database Schema

Supabase (PostgreSQL) schema for the Venora marketplace. Apply migrations in filename order under `supabase/migrations/`.

## Migration order

| File | Purpose |
|------|---------|
| `20250529120000_create_public_profiles.sql` | Legacy bootstrap (profiles + auth trigger) |
| `20250530100000_extensions_and_helpers.sql` | Extensions, role helpers, `set_updated_at`, `slugify` |
| `20250530100100_profiles.sql` | Profiles table enhancements |
| `20250530100200_venues.sql` | Published venue listings |
| `20250530100300_venue_submissions.sql` | Host submission workflow |
| `20250530100400_venue_images.sql` | Venue gallery images |
| `20250530100500_bookings.sql` | Booking requests |
| `20250530100600_enquiries.sql` | Contact / inquiry messages |
| `20250530100700_venue_analytics.sql` | Daily venue metrics |
| `20250530100800_notifications.sql` | User notifications |
| `20250530100900_triggers_workflows.sql` | Approval, notify, analytics triggers |
| `20250530101000_rls_policies.sql` | Row Level Security |

## Entity relationship overview

```
auth.users 1──1 profiles
profiles 1──* venue_submissions
profiles 1──* venues (host_id)
venue_submissions 1──0..1 venues (published_venue_id / submission_id)
venues 1──* venue_images
venues 1──* bookings
venues 1──* enquiries
venues 1──* venue_analytics
profiles 1──* bookings (client_id / host_id)
profiles 1──* enquiries (client_id / host_id)
profiles 1──* notifications
```

## Tables

### 1. `profiles`

Extends Supabase Auth. One row per user.

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | FK → `auth.users(id)` |
| `email` | `text` UNIQUE | |
| `full_name` | `text` | |
| `phone` | `text` | Optional |
| `avatar_url` | `text` | Optional |
| `role` | `text` | `admin` \| `host` \| `client` |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Auth trigger:** `on_auth_user_created` → `handle_new_user()` inserts profile with role from signup metadata (default `client`). Admins are assigned manually in SQL.

---

### 2. `venues`

Live listings shown on the public site. **Only `status = 'approved'` is visible to anonymous users.**

| Column | Type | Notes |
|--------|------|--------|
| `id` | `text` PK | URL slug (e.g. `glass-pavilion`) — matches current app |
| `host_id` | `uuid` FK → `profiles` | Owning host |
| `submission_id` | `uuid` FK → `venue_submissions` | Source submission |
| `name`, `city`, `location` | `text` | |
| `price`, `price_amount` | `text`, `int` | |
| `rating`, `image`, `tag` | `text` | `image` = cover URL |
| `description`, `capacity`, `capacity_max` | | |
| `availability` | `text` | `available` \| `limited` \| `unavailable` |
| `status` | `text` | `approved` \| `archived` \| `suspended` |
| `published_at` | `timestamptz` | |
| `created_at`, `updated_at` | `timestamptz` | |

---

### 3. `venue_submissions`

Hosts submit new or updated listings here. **Rejected rows stay in this table only.**

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | |
| `host_id` | `uuid` FK | Submitter |
| `proposed_venue_id` | `text` UNIQUE | Target slug when published |
| `published_venue_id` | `text` FK → `venues` | Set on approval |
| (venue fields) | | Same shape as `venues` |
| `status` | `text` | `pending` \| `approved` \| `rejected` \| `draft` |
| `rejection_reason` | `text` | |
| `reviewed_by`, `reviewed_at` | | Admin review |
| `submitted_at`, `created_at`, `updated_at` | | |

**Workflow**

1. Host inserts row with `status = 'pending'` (or `draft`).
2. Admin sets `status = 'approved'` → trigger `publish_venue_from_submission()` copies row into `venues`.
3. Admin sets `status = 'rejected'` → row remains here; optional `reject_venue_submission()` RPC.

---

### 4. `bookings`

Reservation requests from clients.

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | |
| `venue_id` | `text` FK → `venues` | |
| `venue_name` | `text` | Denormalized |
| `client_id` | `uuid` FK | |
| `client_name`, `client_email` | `text` | |
| `host_id` | `uuid` FK | From venue |
| `event_date` | `date` | |
| `guests` | `int` | |
| `status` | `text` | `pending` \| `confirmed` \| `cancelled` \| `declined` |
| `amount` | `text` | |
| `special_requests`, `admin_notes` | `text` | |
| `created_at`, `updated_at` | | |

---

### 5. `enquiries`

Contact forms and venue inquiries.

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | |
| `venue_id` | `text` FK | Nullable (general contact) |
| `venue_name` | `text` | |
| `client_id`, `host_id` | `uuid` FK | Optional / auto from venue |
| `full_name`, `email`, `phone` | | |
| `message` | `text` | |
| `source` | `text` | `contact_form` \| `venue_page` \| … |
| `status` | `text` | `new` \| `in_progress` \| `replied` \| `closed` \| `spam` |
| `admin_notes` | `text` | |
| `created_at`, `updated_at` | | |

---

### 6. `venue_images`

Gallery for published venues. Cover image syncs to `venues.image`.

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | |
| `venue_id` | `text` FK | |
| `storage_path` | `text` | Supabase Storage path |
| `url` | `text` | Public URL |
| `alt_text` | `text` | |
| `sort_order` | `int` | |
| `is_cover` | `boolean` | One per venue (partial unique index) |
| `created_at`, `updated_at` | | |

---

### 7. `venue_analytics`

Daily aggregates per venue.

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | |
| `venue_id` | `text` FK | |
| `metric_date` | `date` | UNIQUE with `venue_id` |
| `views`, `enquiries`, `booking_requests`, `confirmed_bookings` | `int` | |
| `created_at`, `updated_at` | | |

**Function:** `increment_venue_analytics(venue_id, date, …)` — upserts counters (used by triggers).

---

### 8. `notifications`

In-app alerts.

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles` | |
| `type` | `text` | `booking`, `enquiry`, `venue_approved`, … |
| `title`, `body` | `text` | |
| `link` | `text` | In-app path |
| `metadata` | `jsonb` | |
| `read_at` | `timestamptz` | NULL = unread |
| `created_at` | | |

**Function:** `create_notification(...)` — security definer; called from triggers.

---

## Helper functions

| Function | Purpose |
|----------|---------|
| `is_admin()`, `is_host()`, `is_client()` | RLS role checks |
| `normalize_profile_role(text)` | Coerce role enum |
| `handle_new_user()` | Auth signup profile |
| `publish_venue_from_submission(uuid)` | Copy approved submission → `venues` |
| `reject_venue_submission(uuid, reason)` | Reject pending submission |
| `increment_venue_analytics(...)` | Bump daily metrics |
| `create_notification(...)` | Insert notification |

## Row Level Security summary

| Table | Public | Client | Host | Admin |
|-------|--------|--------|------|-------|
| `profiles` | — | own read/update | own read/update | all |
| `venues` | approved read | approved read | own read/update | all |
| `venue_submissions` | — | — | own CRUD (not approve) | all |
| `venue_images` | approved venue | approved | own venues | all |
| `bookings` | — | own read, insert | own read/update | all |
| `enquiries` | insert | own read | own read | all |
| `venue_analytics` | — | — | own venues read | all |
| `notifications` | — | own read/update | own read/update | read all |

## Legacy tables (not part of core 8)

The app may still reference these until frontend migration:

- `host_leads` — “Become a Host” marketing form (`lib/hostLeads.ts`)
- `content_blocks` — CMS snippets (`lib/admin/content.ts`)

Do not drop without updating the application.

## Manual admin creation

```sql
-- After user exists in auth.users:
update public.profiles
set role = 'admin', updated_at = now()
where email = 'admin@example.com';
```

## Approving a submission (admin)

```sql
update public.venue_submissions
set status = 'approved'
where id = '<submission-uuid>';
-- Trigger publishes to venues automatically.
```

Or:

```sql
select public.publish_venue_from_submission('<submission-uuid>');
```

## Frontend compatibility notes

Current app reads/writes `venues`, `profiles`, `bookings`, `host_leads`, `content_blocks` with columns defined in `lib/venues-map.ts`. New tables (`venue_submissions`, `enquiries`, `venue_images`, `venue_analytics`, `notifications`) are ready for integration without breaking existing queries.

Venue `id` remains **text** (slug). Host listing flow should move from direct `venues` inserts to `venue_submissions` when the app is updated.
