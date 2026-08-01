-- Staff authorization + event scheduling hardening.
--
-- Ports the staff-safety fixes from a teammate's branch (originally written
-- as a standalone migration that assumed a schema not yet touched by
-- 20260801000004/5) onto the schema that is ALREADY live: `staff` already
-- exists in user_role, starts_at/ends_at/status/_zh/_cn columns already
-- exist on events, and event_status is already just published|cancelled.
--
-- Part of this migration's target state was ALREADY applied directly to the
-- shared project outside of migration tracking (handle_new_user's role
-- allowlist, the "own public profile" policies, the events_end_after_start
-- constraint, events_set_updated_at trigger, and two indexes already exist).
-- Every statement below is written to be safe to run whether or not that
-- happened, so this migration converges to the same end state either way.

-- ---------------------------------------------------------------------------
-- Close the self-promotion hole: signup metadata is untrusted input. Without
-- this, a user could pass { role: "staff" } to auth.signUp() and the trigger
-- below would happily assign it, and — separately — any authenticated user
-- could UPDATE their own `role` column directly (RLS alone only restricts
-- *which row*, not *which column*).
-- ---------------------------------------------------------------------------

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

-- Column privileges: keep self-service profile editing (name, contact info,
-- avatar, bio) while making `role` and the localized name variants
-- staff-only. Idempotent — revoke-then-grant converges regardless of
-- current state.
revoke update on table public.users from anon, authenticated;

grant update (
  name, phone_number, address, profile_image, about
) on table public.users to authenticated;

drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can update own public profile" on public.users;

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
drop policy if exists "Users can insert own public profile" on public.users;

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
-- Event audience targeting (new — not covered by migrations 4/5, and not
-- yet present on the remote).
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_audience') then
    create type public.event_audience as enum ('members', 'volunteers', 'everyone');
  end if;
end $$;

alter table public.events
  add column if not exists audience public.event_audience not null default 'everyone';

-- ---------------------------------------------------------------------------
-- Integrity + query performance for the event schedule.
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'events_end_after_start'
  ) then
    alter table public.events
      add constraint events_end_after_start
        check (ends_at is null or ends_at > starts_at);
  end if;
end $$;

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_status_starts_at_idx
  on public.events (status, starts_at);
create index if not exists events_audience_status_starts_at_idx
  on public.events (audience, status, starts_at);

-- events.updated_at exists (added in migration 4); keep it fresh.
drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Fix: migration 5's "Published events are readable by everyone" policy
-- (`status = 'published'`) unintentionally hides cancelled events from
-- their own registrants — breaking the portal's "My events" cancelled-chip
-- view, which joins event_participations -> events under the user's own
-- session (RLS applies to that join too). Since `draft` no longer exists in
-- event_status, there's no remaining case where a row needs to be hidden.
-- ---------------------------------------------------------------------------

drop policy if exists "Published events are readable by everyone" on public.events;
drop policy if exists "Events are readable by everyone" on public.events;

create policy "Events are readable by everyone"
  on public.events for select
  using (true);
