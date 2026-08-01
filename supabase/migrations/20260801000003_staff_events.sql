-- Staff authorization and the editable event schedule used by /admin/events.
--
-- This migration is deliberately additive. The original event columns remain
-- available for existing consumers while the richer schedule fields are added.

-- ---------------------------------------------------------------------------
-- Staff profiles
-- ---------------------------------------------------------------------------

alter type public.user_role add value if not exists 'staff';

-- Public signup metadata is untrusted. In particular, adding `staff` to the
-- database enum must not make it possible to self-select that role at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role := case new.raw_user_meta_data ->> 'role'
    when 'donor' then 'donor'::public.user_role
    when 'volunteer' then 'volunteer'::public.user_role
    else 'member'::public.user_role
  end;

  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    requested_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- RLS decides which rows may be updated, but PostgreSQL column privileges
-- decide which fields may be changed. Keep self-service profile editing while
-- preventing an authenticated user from promoting their own profile to staff.
revoke update on table public.users from anon, authenticated;

grant update (name, phone_number, address, profile_image)
  on table public.users to authenticated;

drop policy if exists "Users can update own profile" on public.users;

create policy "Users can update own public profile"
  on public.users for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      profile_image is null
      or split_part(profile_image, '/', 1) = auth.uid()::text
    )
  );

drop policy if exists "Users can insert own profile" on public.users;

create policy "Users can insert own public profile"
  on public.users for insert
  with check (
    auth.uid() = id
    and role::text in ('member', 'donor', 'volunteer')
    and (
      profile_image is null
      or split_part(profile_image, '/', 1) = auth.uid()::text
    )
  );

-- ---------------------------------------------------------------------------
-- Editable event schedule
-- ---------------------------------------------------------------------------

create type public.event_audience as enum (
  'members',
  'volunteers',
  'everyone'
);

create type public.event_status as enum (
  'draft',
  'published',
  'cancelled'
);

alter table public.events
  alter column date drop not null,
  alter column type drop not null,
  add column title_zh text,
  add column description text,
  add column description_zh text,
  add column location_zh text,
  add column starts_at timestamptz,
  add column ends_at timestamptz,
  add column audience public.event_audience not null default 'everyone',
  add column status public.event_status not null default 'draft',
  add column updated_at timestamptz not null default now();

-- Legacy events had only a Hong Kong calendar date. Preserve those rows by
-- treating the stored date as midnight Hong Kong time, and retain their prior
-- public visibility by marking them published.
update public.events
set
  starts_at = date::timestamp at time zone 'Asia/Hong_Kong',
  status = 'published'::public.event_status
where starts_at is null;

alter table public.events
  alter column starts_at set not null,
  add constraint events_end_after_start
    check (ends_at is null or ends_at > starts_at);

create index events_starts_at_idx on public.events (starts_at);
create index events_status_starts_at_idx
  on public.events (status, starts_at);
create index events_audience_status_starts_at_idx
  on public.events (audience, status, starts_at);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- Drafts are staff work-in-progress. The service-role client used by the staff
-- portal bypasses RLS, while public clients only receive publishable records.
drop policy if exists "Events are readable by everyone" on public.events;

create policy "Published events are readable by everyone"
  on public.events for select
  using (status in ('published', 'cancelled'));
