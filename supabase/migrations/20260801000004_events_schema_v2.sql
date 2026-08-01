-- Drift capture — reflects schema changes made directly on the remote via
-- Supabase Studio. This file is marked applied via
--   npx supabase migration repair --status applied 20260801000004
-- so the SQL below is never executed against the remote; it exists so the
-- local migration history matches truth and future `db push` diffs cleanly.

-- events: new time model + status + bilingual (zh) columns; slug removed
create type public.event_status as enum ('draft', 'published', 'cancelled');

alter table public.events
  alter column date drop not null,
  alter column type drop not null,
  drop column if exists slug,
  add column if not exists starts_at timestamptz not null default now(),
  add column if not exists ends_at timestamptz,
  add column if not exists status public.event_status not null default 'published',
  add column if not exists title_zh text,
  add column if not exists description text,
  add column if not exists description_zh text,
  add column if not exists location_zh text,
  add column if not exists updated_at timestamptz not null default now();

-- users: extra profile fields + zh name
alter table public.users
  add column if not exists about text,
  add column if not exists name_zh text;

-- role gains an admin tier
alter type public.user_role add value if not exists 'staff';
