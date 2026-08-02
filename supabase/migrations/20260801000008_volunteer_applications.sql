-- Contributor signup → volunteer application.
--
-- Donor and volunteer were merged into a single `contributor` role. The
-- public signup form now offers only member/contributor, and every contributor
-- gets a `volunteer_applications` row (status 'registered') at signup so they
-- can later complete the Volunteer Application form in the portal.
--
-- This migration is idempotent: the `volunteer_application_status` enum and
-- `volunteer_applications` table were already created directly in the shared
-- project, so every statement here is safe to run against either state.

-- ---------------------------------------------------------------------------
-- Enum + table (must match what is already live)
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'volunteer_application_status') then
    create type public.volunteer_application_status as enum (
      'submitted',
      'under_review',
      'approved',
      'rejected',
      'withdrawn',
      'registered'
    );
  end if;
end $$;

create table if not exists public.volunteer_applications (
  id                       bigint generated always as identity primary key,
  user_id                  uuid not null references public.users (id) on delete cascade,
  status                   public.volunteer_application_status default 'registered',
  age_group                text,
  gender                   text,
  bio                      text,
  referral_source          text,
  volunteer_policy_doc     text, -- object path in the `volunteer-applications` bucket
  scrc_check_doc           text, -- object path in the `volunteer-applications` bucket
  submitted_at             timestamptz,
  reviewed_at              timestamptz,
  reviewed_by              uuid references public.users (id),
  rejection_reason         text,
  rejection_reason_visible boolean not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  unique (user_id)
);

create index if not exists volunteer_applications_user_idx
  on public.volunteer_applications (user_id);

drop trigger if exists volunteer_applications_set_updated_at on public.volunteer_applications;
create trigger volunteer_applications_set_updated_at
  before update on public.volunteer_applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- handle_new_user: contributor signups get a proper role. No automatic
-- volunteer_applications row — the application is created on first submit.
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
  -- Untrusted signup metadata is allowlisted: only member/contributor are
  -- assignable. Anything else (including legacy donor/volunteer) becomes a
  -- member; staff is never assignable through signup.
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
-- Self-service submit. A user may fill in their own application, but the
-- status can only move to 'submitted' — never to 'approved'. To keep that
-- guarantee, clients get NO update/insert privilege on the table; submission
-- goes through this SECURITY DEFINER function, which performs the same caller
-- check the app would (auth.uid()) and is the only path that writes status.
-- ---------------------------------------------------------------------------

create or replace function public.submit_volunteer_application(
  p_user_id          uuid,
  p_age_group        text default null,
  p_gender           text default null,
  p_bio              text default null,
  p_referral_source  text default null,
  p_volunteer_policy_doc text default null,
  p_scrc_check_doc   text default null
)
returns public.volunteer_application_status
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_status public.volunteer_application_status;
  result_status   public.volunteer_application_status;
begin
  -- Caller must be operating on their own application.
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'You can only update your own application.';
  end if;

  select status into existing_status
    from public.volunteer_applications
    where user_id = p_user_id;

  if existing_status = 'approved'::public.volunteer_application_status then
    raise exception 'Your application is already approved.';
  end if;

  if existing_status is null then
    insert into public.volunteer_applications
      (user_id, status, age_group, gender, bio, referral_source,
       volunteer_policy_doc, scrc_check_doc, submitted_at)
    values
      (p_user_id, 'submitted'::public.volunteer_application_status,
       p_age_group, p_gender, p_bio, p_referral_source,
       p_volunteer_policy_doc, p_scrc_check_doc, now());
  else
    update public.volunteer_applications
      set status = 'submitted'::public.volunteer_application_status,
          age_group = p_age_group,
          gender = p_gender,
          bio = p_bio,
          referral_source = p_referral_source,
          volunteer_policy_doc = p_volunteer_policy_doc,
          scrc_check_doc = p_scrc_check_doc,
          submitted_at = now()
      where user_id = p_user_id;
  end if;

  result_status := 'submitted'::public.volunteer_application_status;
  return result_status;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS on volunteer_applications — a user may only READ their own row.
-- Writes go exclusively through the SECURITY DEFINER function above.
-- ---------------------------------------------------------------------------

alter table public.volunteer_applications enable row level security;

drop policy if exists "Users can read own volunteer application" on public.volunteer_applications;
create policy "Users can read own volunteer application"
  on public.volunteer_applications for select
  using (auth.uid() = user_id);

-- Deny client-side write access as a safety net (the function bypasses RLS).
revoke insert, update, delete on table public.volunteer_applications
  from anon, authenticated;
revoke all on function public.submit_volunteer_application(uuid, text, text, text, text, text, text)
  from anon;
grant execute on function public.submit_volunteer_application(uuid, text, text, text, text, text, text)
  to authenticated;

-- ---------------------------------------------------------------------------
-- users.insert policy: the old donor/volunteer allowlist no longer applies.
-- ---------------------------------------------------------------------------

drop policy if exists "Users can insert own public profile" on public.users;
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

-- ---------------------------------------------------------------------------
-- Storage: private per-user folder for the two application documents.
-- Path convention: "<auth.uid()>/<filename>".
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('volunteer-applications', 'volunteer-applications', false)
on conflict (id) do nothing;

create policy "Users can read own volunteer application documents"
  on storage.objects for select
  using (
    bucket_id = 'volunteer-applications'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload own volunteer application documents"
  on storage.objects for insert
  with check (
    bucket_id = 'volunteer-applications'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own volunteer application documents"
  on storage.objects for update
  using (
    bucket_id = 'volunteer-applications'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own volunteer application documents"
  on storage.objects for delete
  using (
    bucket_id = 'volunteer-applications'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
