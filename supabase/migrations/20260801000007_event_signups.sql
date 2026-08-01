-- Public event sign-ups split into two tables.
--   event_participations   — registered users (members/donors/volunteers).
--                            user_id NOT NULL, interest set for volunteers.
--   event_guest_signups     — logged-out visitors. No account is created; the
--                            guest's name + email are recorded here.
-- Both tables use simple full UNIQUE constraints so supabase-js upsert
-- ON CONFLICT can infer them.

-- ---------------------------------------------------------------------------
-- Restore event_participations to registered users only
-- ---------------------------------------------------------------------------

-- Drop any leftover guest-related objects from earlier iterations.
drop index if exists public.event_participations_guest_event_key;
drop index if exists public.event_participations_user_event_key;

alter table public.event_participations
  drop constraint if exists participations_owner_present,
  drop constraint if exists participations_guest_has_name;

alter table public.event_participations
  drop column if exists guest_name,
  drop column if exists guest_email;

-- Volunteers store the interest they picked for an event here.
alter table public.event_participations
  add column if not exists interest text;

-- Delete any orphaned guest rows (user_id NULL) before restoring NOT NULL.
delete from public.event_participations where user_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'event_participations'
      and column_name = 'user_id'
      and is_nullable = 'YES'
  ) then
    alter table public.event_participations alter column user_id set not null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.event_participations'::regclass
      and conname = 'event_participations_user_id_event_id_key'
  ) then
    alter table public.event_participations
      add constraint event_participations_user_id_event_id_key unique (user_id, event_id);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- New table: event_guest_signups (logged-out visitors)
-- ---------------------------------------------------------------------------

create table if not exists public.event_guest_signups (
  id          bigint generated always as identity primary key,
  event_id    bigint not null references public.events (id) on delete cascade,
  guest_name  text not null,
  guest_email text not null,
  interest    text,
  status      public.participation_status not null default 'registered',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (guest_email, event_id)
);

create index if not exists event_guest_signups_event_idx
  on public.event_guest_signups (event_id);

create trigger event_guest_signups_set_updated_at
  before update on public.event_guest_signups
  for each row execute function public.set_updated_at();

alter table public.event_guest_signups enable row level security;

-- Guest sign-ups are written by a server action using the service-role client
-- (bypasses RLS). Deny all access for anon/authenticated as a safety net.
create policy "Guest signups are private"
  on public.event_guest_signups for select
  using (false);
create policy "Guest signups are private (insert)"
  on public.event_guest_signups for insert
  with check (false);
create policy "Guest signups are private (update)"
  on public.event_guest_signups for update
  using (false)
  with check (false);
create policy "Guest signups are private (delete)"
  on public.event_guest_signups for delete
  using (false);