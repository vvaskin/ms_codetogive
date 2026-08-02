-- Add 'pending' and 'rejected' to participation_status so the guest-volunteer
-- signup path can create requests that staff review before confirming.
-- Split from the rename migration because Postgres cannot use a newly-added
-- enum value in the same transaction that added it.
do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'participation_status'
      and e.enumlabel = 'pending'
  ) then
    alter type public.participation_status add value 'pending';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'participation_status'
      and e.enumlabel = 'rejected'
  ) then
    alter type public.participation_status add value 'rejected';
  end if;
end $$;
