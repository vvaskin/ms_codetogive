-- Private storage bucket for SCRC / parental-consent documents attached to
-- volunteer applications. Uploads happen server-side via the service-role
-- client during application submission, so there is no client insert policy.

insert into storage.buckets (id, name, public)
values ('volunteer-documents', 'volunteer-documents', false)
on conflict (id) do nothing;

create policy "Users can read their own volunteer documents"
  on storage.objects for select
  using (
    bucket_id = 'volunteer-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

alter table public.volunteer_applications
  add column if not exists scrc_path text;

alter table public.volunteer_applications
  add column if not exists parental_consent_path text;
