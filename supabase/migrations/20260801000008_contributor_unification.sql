-- Unify donor/volunteer into a single `contributor` role, and introduce
-- volunteer_applications as the gate for volunteer functionality.
--
-- Assumes the enum is currently ('member','donor','volunteer','staff') per
-- 20260801000001_init.sql:9 + 20260801000004_events_schema_v2.sql:29. Written
-- to be idempotent / safe to re-run on this shared dev project, per the
-- established convention in migrations 5 and 6.
--
-- Statement order matters: the volunteer_applications backfill must run BEFORE
-- the enum swap so `where role = 'volunteer'` still resolves.

-- ---------------------------------------------------------------------------
-- 1. volunteer_application_status enum
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'volunteer_application_status') then
    create type public.volunteer_application_status as enum (
      'submitted', 'under_review', 'approved', 'rejected', 'withdrawn'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. volunteer_applications table
-- status is nullable, default NULL: NULL means "no application" / "does not
-- want to volunteer". Application code explicitly sets 'submitted' when
-- inserting/updating — nothing should rely on the column default to mean
-- "applied".
-- ---------------------------------------------------------------------------

create table if not exists public.volunteer_applications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  status public.volunteer_application_status,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.users(id) on delete set null,
  rejection_reason text,
  rejection_reason_visible boolean not null default false,
  age_group text,
  gender text,
  referral_source text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Partial unique index: at most one active (non-rejected, non-withdrawn)
-- application per user. Also excludes NULL status explicitly so a
-- no-application row never blocks a real submission.
create unique index if not exists volunteer_applications_one_active_per_user
  on public.volunteer_applications (user_id)
  where status is not null and status not in ('rejected', 'withdrawn');

create index if not exists volunteer_applications_status_idx
  on public.volunteer_applications (status);

create index if not exists volunteer_applications_user_id_idx
  on public.volunteer_applications (user_id);

drop trigger if exists volunteer_applications_set_updated_at on public.volunteer_applications;
create trigger volunteer_applications_set_updated_at
  before update on public.volunteer_applications
  for each row execute function public.set_updated_at();

alter table public.volunteer_applications enable row level security;

drop policy if exists "Users can read own application" on public.volunteer_applications;
create policy "Users can read own application"
  on public.volunteer_applications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own application" on public.volunteer_applications;
create policy "Users can insert own application"
  on public.volunteer_applications for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own application" on public.volunteer_applications;
create policy "Users can update own application"
  on public.volunteer_applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. Backfill: existing role='volunteer' accounts become approved contributors
-- so they don't lose access to volunteer features. Must run BEFORE the enum
-- swap below removes the 'volunteer' value. Guarded so re-runs don't duplicate.
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'user_role' and e.enumlabel = 'volunteer')
  then
    insert into public.volunteer_applications (
      user_id, status, submitted_at, reviewed_at
    )
    select u.id, 'approved'::public.volunteer_application_status, u.created_at, now()
    from public.users u
    where u.role::text = 'volunteer'
      and not exists (
        select 1 from public.volunteer_applications va where va.user_id = u.id
      );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 4. Enum swap: user_role -> ('member','contributor','staff').
-- Drop the dependent insert policy first (it references role values by name);
-- recreate after the swap. Follows the pattern in 20260801000005_events_users_cn.sql.
-- ---------------------------------------------------------------------------

drop policy if exists "Users can insert own public profile" on public.users;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role_v2') then
    create type public.user_role_v2 as enum ('member', 'contributor', 'staff');
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'user_role' and e.enumlabel = 'donor')
  or exists (select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'user_role' and e.enumlabel = 'volunteer')
  then
    alter table public.users
      alter column role type public.user_role_v2
      using (
        case
          when role::text in ('donor', 'volunteer') then 'contributor'
          else role::text
        end::public.user_role_v2
      );

    drop type public.user_role;
    alter type public.user_role_v2 rename to user_role;
  end if;
end $$;

-- Cleanup: drop the transient v2 type if it survived the block above
-- (e.g. an interrupted first run left it orphaned).
drop type if exists public.user_role_v2;

-- ---------------------------------------------------------------------------
-- 5. handle_new_user() trigger — new role mapping. Staff still never
-- self-assignable via signup metadata.
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
    when 'contributor' then 'contributor'::public.user_role
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

-- ---------------------------------------------------------------------------
-- 6. Recreate the users insert policy against the new enum values.
-- ---------------------------------------------------------------------------

create policy "Users can insert own public profile"
  on public.users for insert
  with check (
    auth.uid() = id
    and role::text in ('member', 'contributor')
    and (
      profile_image is null
      or split_part(profile_image, '/', 1) = auth.uid()::text
    )
  );
