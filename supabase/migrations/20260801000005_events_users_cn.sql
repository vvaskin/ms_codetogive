-- Complete localization coverage: add `_cn` columns matching the app's
-- Locale = "en" | "zh" | "cn". Base column = en, `_zh` = Traditional (HK),
-- `_cn` = Simplified. App picks the right one via lib/localized.ts.
--
-- Also collapse event_status to just published + cancelled — the app never
-- surfaces `draft` and admin toggles between the two.

alter table public.events
  add column if not exists title_cn text,
  add column if not exists location_cn text,
  add column if not exists description_cn text;

alter table public.users
  add column if not exists name_cn text;

-- Reshape event_status: drop `draft`. Any lingering draft rows get promoted
-- to published to avoid blocking the type swap.
update public.events set status = 'published' where status = 'draft';

-- The "Published events are readable by everyone" policy on public.events
-- references the status column and blocks the type change; drop it, then
-- recreate against the new enum after the swap.
drop policy if exists "Published events are readable by everyone" on public.events;

alter table public.events alter column status drop default;

create type public.event_status_v2 as enum ('published', 'cancelled');

alter table public.events
  alter column status type public.event_status_v2
  using (status::text::public.event_status_v2);

drop type public.event_status;

alter type public.event_status_v2 rename to event_status;

alter table public.events
  alter column status set default 'published',
  alter column status set not null;

create policy "Published events are readable by everyone"
  on public.events for select
  using (status = 'published');
