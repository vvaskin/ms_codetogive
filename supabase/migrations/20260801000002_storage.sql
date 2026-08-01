-- Storage buckets + access policies.
-- Path convention for per-user files: "<auth.uid()>/<filename>", so the first
-- folder segment is the owner's id and policies can check it.

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('event-images', 'event-images', true),
  ('certificates', 'certificates', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- avatars — world-readable, but you may only write inside your own folder.
-- ---------------------------------------------------------------------------

create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ---------------------------------------------------------------------------
-- event-images — world-readable; uploads are staff-only via the service-role
-- key (which bypasses RLS), so no insert/update policy is granted here.
-- ---------------------------------------------------------------------------

create policy "Event images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'event-images');

-- ---------------------------------------------------------------------------
-- certificates — PRIVATE. A user may only read their own certificates, and
-- they are served through short-lived signed URLs. Certificates are issued by
-- staff using the service-role key, so there is no client insert policy.
-- ---------------------------------------------------------------------------

create policy "Users can read their own certificates"
  on storage.objects for select
  using (
    bucket_id = 'certificates'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
