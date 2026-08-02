-- RLS policies decide which application rows a signed-in user may access,
-- but PostgreSQL table privileges must allow the operation before RLS runs.
-- Keep this grant limited to the operations used by the contributor portal.

grant select, insert, update
  on table public.volunteer_applications
  to authenticated;

-- The primary key is an identity column. Grant access to its backing sequence
-- explicitly so inserts do not depend on project-level default privileges.
grant usage, select
  on sequence public.volunteer_applications_id_seq
  to authenticated;
