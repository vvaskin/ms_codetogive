-- Drops the testimonial headline.
--
-- The headline was removed from the admin editor and from the homepage story
-- card, so nothing writes it any more and the not-null column rejects every
-- save. 20260803000001 no longer creates the column, so this migration only
-- does work in environments that applied the earlier version of that file.
--
-- No other table or column is touched.

alter table public.testimonial_translations
  drop constraint if exists testimonial_translations_headline_length;

alter table public.testimonial_translations
  drop column if exists headline;
