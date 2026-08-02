-- Rename 'registered' -> 'accepted' so the event-participation lifecycle can
-- express a real staff-review workflow: pending -> accepted / rejected.
-- The rename preserves every existing row (Postgres updates the column default
-- automatically since it's the same enum label being renamed).
do $$
begin
  if exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'participation_status'
      and e.enumlabel = 'registered'
  ) then
    alter type public.participation_status rename value 'registered' to 'accepted';
  end if;
end $$;
