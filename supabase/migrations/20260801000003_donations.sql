-- Donations (event-linked and general) + a slug/seed for events so guests can
-- register to volunteer for a real event row.

-- ---------------------------------------------------------------------------
-- Replace event_sponsorships with a unified donations table.
-- A donation with event_id set is "earmarked for that event" (what
-- event_sponsorships used to mean); event_id NULL is a general donation.
-- ---------------------------------------------------------------------------

drop table if exists public.event_sponsorships;

create type public.donation_kind as enum ('one_time', 'recurring');
create type public.donation_frequency as enum ('monthly', 'quarterly', 'yearly');
create type public.donation_status as enum (
  'completed', -- a finished one-time gift
  'active',    -- a live recurring gift
  'paused',
  'cancelled'
);

create table public.donations (
  id               bigint generated always as identity primary key,
  donor_id         uuid not null references public.users (id) on delete cascade,
  -- NULL = general donation; set = earmarked for a specific event.
  event_id         bigint references public.events (id) on delete set null,
  kind             public.donation_kind not null,
  amount_cents     integer not null check (amount_cents >= 0),
  currency         text not null default 'HKD',
  -- Required for recurring, forbidden for one-time.
  frequency        public.donation_frequency,
  status           public.donation_status not null,
  certificate_path text, -- sponsorship PDF (object path in `certificates`)
  note             text,
  created_at       timestamptz not null default now(),
  constraint frequency_matches_kind check (
    (kind = 'recurring') = (frequency is not null)
  ),
  constraint status_matches_kind check (
    (kind = 'one_time' and status = 'completed')
    or (kind = 'recurring' and status in ('active', 'paused', 'cancelled'))
  )
);

create index donations_donor_idx on public.donations (donor_id);
create index donations_event_idx on public.donations (event_id);

alter table public.donations enable row level security;

create policy "Donors can read own donations"
  on public.donations for select
  using (auth.uid() = donor_id);

create policy "Donors can create own donations"
  on public.donations for insert
  with check (auth.uid() = donor_id);

create policy "Donors can update own donations"
  on public.donations for update
  using (auth.uid() = donor_id)
  with check (auth.uid() = donor_id);

-- ---------------------------------------------------------------------------
-- events: add a stable slug (nice URLs + idempotent seeding).
-- ---------------------------------------------------------------------------

alter table public.events add column if not exists slug text unique;

-- Seed the August 2026 events from content/activities.ts so the volunteer
-- registration feed has real rows. Activity categories map to the fixed
-- event_type set; the original category is kept in `subtype`.
insert into public.events (slug, title, date, type, subtype, location, location_link)
values
  ('yoga-04',    'Inclusive Yoga',           '2026-08-04', 'sport',          'sports',    'Love 21 Space', null),
  ('food-06',    'Food Explorers',           '2026-08-06', 'nutrition',      'nutrition', 'Love 21 Space', null),
  ('family-08',  'Family Coffee Morning',    '2026-08-08', 'family_support', 'family',    'Love 21 Space', null),
  ('fitness-11', 'Fitness Club',             '2026-08-11', 'sport',          'sports',    'Love 21 Space', null),
  ('csr-14',     'Corporate Volunteer Visit','2026-08-14', 'family_support', 'csr',       'Love 21 Space', null),
  ('dance-18',   'Dance & Rhythm',           '2026-08-18', 'sport',          'sports',    'Love 21 Space', null),
  ('food-18',    'Kitchen Skills',           '2026-08-18', 'nutrition',      'nutrition', 'Love 21 Space', null),
  ('family-22',  'Weekend Family Club',      '2026-08-22', 'family_support', 'family',    'Love 21 Space', null),
  ('sports-27',  'Team Sports',              '2026-08-27', 'sport',          'sports',    'Love 21 Space', null)
on conflict (slug) do nothing;
