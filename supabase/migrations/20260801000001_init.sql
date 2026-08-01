-- Love 21 Foundation — initial schema
-- Auth credentials live in Supabase's managed `auth.users` table. This file
-- only defines PROFILE + domain data in `public`, linked to auth by user id.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('member', 'donor', 'volunteer');

create type public.event_type as enum ('sport', 'nutrition', 'family_support');

-- registered = signed up, event upcoming ("attending")
-- attended   = signed up and showed up
-- no_show    = signed up but did not show up
-- cancelled  = withdrew their registration before the event
create type public.participation_status as enum (
  'registered',
  'attended',
  'no_show',
  'cancelled'
);

-- ---------------------------------------------------------------------------
-- users (profile for an auth.users row — never stores passwords)
-- ---------------------------------------------------------------------------

create table public.users (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  name          text not null,
  phone_number  text,
  address       text,
  role          public.user_role not null,
  profile_image text, -- object path inside the `avatars` bucket
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on column public.users.id is 'Same value as auth.users.id.';
comment on column public.users.profile_image is 'Object path in the avatars storage bucket.';

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------

create table public.events (
  id            bigint generated always as identity primary key,
  title         text not null,
  image         text, -- object path inside the `event-images` bucket
  date          date not null,
  type          public.event_type not null,
  subtype       text, -- free-form, e.g. "Yoga", "Cooking class"
  location      text,
  location_link text, -- Google Maps URL
  created_at    timestamptz not null default now()
);

create index events_date_idx on public.events (date);
create index events_type_idx on public.events (type);

-- ---------------------------------------------------------------------------
-- event_participations — serves BOTH members and volunteers
-- ---------------------------------------------------------------------------

create table public.event_participations (
  id               bigint generated always as identity primary key,
  user_id          uuid not null references public.users (id) on delete cascade,
  event_id         bigint not null references public.events (id) on delete cascade,
  status           public.participation_status not null default 'registered',
  -- Volunteer attendance certificate (object path in `certificates`).
  -- Null for members, and only ever set once status = 'attended'.
  certificate_path text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, event_id),
  constraint certificate_requires_attendance
    check (certificate_path is null or status = 'attended')
);

create index event_participations_user_idx on public.event_participations (user_id);
create index event_participations_event_idx on public.event_participations (event_id);

-- ---------------------------------------------------------------------------
-- event_sponsorships — donors; how much of a donor's money went to an event
-- ---------------------------------------------------------------------------

create table public.event_sponsorships (
  id               bigint generated always as identity primary key,
  donor_id         uuid not null references public.users (id) on delete cascade,
  event_id         bigint not null references public.events (id) on delete cascade,
  -- Money is stored as integer minor units (cents) — never a float.
  amount_cents     integer not null check (amount_cents >= 0),
  currency         text not null default 'HKD',
  certificate_path text, -- sponsorship PDF (object path in `certificates`)
  created_at       timestamptz not null default now(),
  unique (donor_id, event_id)
);

create index event_sponsorships_donor_idx on public.event_sponsorships (donor_id);
create index event_sponsorships_event_idx on public.event_sponsorships (event_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger event_participations_set_updated_at
  before update on public.event_participations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever Supabase Auth creates a user.
-- `name` and `role` come from the signup metadata (options.data).
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'member')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.event_participations enable row level security;
alter table public.event_sponsorships enable row level security;

-- users: you may only see and edit your own profile.
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Insert happens through the SECURITY DEFINER trigger above; allowing an
-- explicit self-insert keeps things working if the trigger is ever bypassed.
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- events: readable by anyone (public calendar); writes are staff-only and go
-- through the service-role key, which bypasses RLS.
create policy "Events are readable by everyone"
  on public.events for select
  using (true);

-- participations: a user only ever touches their own rows.
create policy "Users can read own participations"
  on public.event_participations for select
  using (auth.uid() = user_id);

create policy "Users can register themselves"
  on public.event_participations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own participations"
  on public.event_participations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own participations"
  on public.event_participations for delete
  using (auth.uid() = user_id);

-- sponsorships: a donor only ever touches their own rows.
create policy "Donors can read own sponsorships"
  on public.event_sponsorships for select
  using (auth.uid() = donor_id);

create policy "Donors can create own sponsorships"
  on public.event_sponsorships for insert
  with check (auth.uid() = donor_id);

create policy "Donors can update own sponsorships"
  on public.event_sponsorships for update
  using (auth.uid() = donor_id)
  with check (auth.uid() = donor_id);
