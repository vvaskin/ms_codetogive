-- Member testimonials shown in the homepage carousel and managed from the
-- admin portal.
--
-- One row per story, plus one translation row per language so the carousel can
-- render the same story in English, Traditional Chinese and Simplified Chinese.
-- Editors never write HTML: each translation is a fixed set of fields that maps
-- directly onto the homepage story card (label, headline, story text, quote,
-- attribution).
--
-- Only testimonial objects are touched. Every other table, policy, function and
-- storage bucket in the project is left exactly as it is.
--
-- An abandoned branch left a different, block-based set of testimonial tables in
-- some environments. Nothing reads them any more and the only row they hold is
-- the seeded Crystal story, which this migration recreates below, so they are
-- dropped first to keep a single definition of a testimonial.
drop function if exists public.replace_testimonial_content(bigint, jsonb);
drop table if exists public.testimonial_blocks;
drop table if exists public.testimonial_translations;
drop table if exists public.testimonials;
drop type if exists public.testimonial_block_type;
drop type if exists public.testimonial_status;
drop type if exists public.testimonial_locale;
create type public.testimonial_status as enum ('draft', 'published');
create type public.testimonial_locale as enum ('en', 'zh', 'cn');
create table public.testimonials (
  id         bigint generated always as identity primary key,
  slug       text not null unique,
  status     public.testimonial_status not null default 'published',
  image_path text not null,
  sort_order integer not null default 100,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 120),
  constraint testimonials_image_path_length
    check (char_length(trim(image_path)) between 1 and 500),
  constraint testimonials_sort_order_range
    check (sort_order between 0 and 9999)
);
-- Carousel ordering: published stories, lowest sort_order first, oldest first
-- when two stories share an order.
create index testimonials_carousel_idx
  on public.testimonials (status, sort_order, created_at);
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();
create table public.testimonial_translations (
  testimonial_id bigint not null
    references public.testimonials (id) on delete cascade,
  locale         public.testimonial_locale not null,
  story_label    text not null,
  headline       text not null,
  body           text not null,
  quote          text,
  attribution    text,
  image_alt      text,
  primary key (testimonial_id, locale),
  constraint testimonial_translations_story_label_length
    check (char_length(trim(story_label)) between 1 and 80),
  constraint testimonial_translations_headline_length
    check (char_length(trim(headline)) between 1 and 120),
  constraint testimonial_translations_body_length
    check (char_length(trim(body)) between 1 and 1000),
  constraint testimonial_translations_quote_length
    check (quote is null or char_length(trim(quote)) between 1 and 500),
  constraint testimonial_translations_attribution_length
    check (attribution is null or char_length(trim(attribution)) between 1 and 160),
  constraint testimonial_translations_image_alt_length
    check (image_alt is null or char_length(trim(image_alt)) between 1 and 200),
  -- An attribution without a quote has nothing to attribute.
  constraint testimonial_translations_attribution_needs_quote
    check (attribution is null or quote is not null)
);
-- The homepage is rendered on the server and testimonials are public content,
-- so published stories are world-readable. Every write goes through the admin
-- server actions using the service-role key (which bypasses RLS), so there is
-- deliberately no insert/update/delete policy for anon or authenticated users.
alter table public.testimonials enable row level security;
alter table public.testimonial_translations enable row level security;
create policy "Published testimonials are publicly readable"
  on public.testimonials for select
  using (status = 'published');
create policy "Published testimonial translations are publicly readable"
  on public.testimonial_translations for select
  using (
    exists (
      select 1
      from public.testimonials
      where testimonials.id = testimonial_translations.testimonial_id
        and testimonials.status = 'published'
    )
  );
-- Uploaded story photos. Public bucket, staff-only writes via service role.
insert into storage.buckets (id, name, public)
values ('testimonial-images', 'testimonial-images', true)
on conflict (id) do nothing;
drop policy if exists "Testimonial images are publicly readable" on storage.objects;
create policy "Testimonial images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'testimonial-images');
-- Seed the existing Crystal story so the carousel is populated on first deploy
-- and staff can edit it like any other testimonial. The static copy in
-- content/homepage.ts stays as the fallback when this table is empty.
insert into public.testimonials (slug, status, image_path, sort_order)
values ('crystal-story', 'published', '/assets/images/crystal-fitness.jpg', 0)
on conflict (slug) do nothing;
insert into public.testimonial_translations (
  testimonial_id,
  locale,
  story_label,
  headline,
  body,
  quote,
  attribution,
  image_alt
)
select
  testimonials.id,
  seed.locale::public.testimonial_locale,
  seed.story_label,
  seed.headline,
  seed.body,
  seed.quote,
  seed.attribution,
  seed.image_alt
from public.testimonials
cross join (
  values
    (
      'en',
      'Crystal’s story',
      'Steady. Strong. Smiling.',
      'Each week Crystal trains with Love 21—planks, push-ups and wall sits—then takes on bocce competitions.',
      'I am very proud of how steadily she performs.',
      'Crystal’s mother · FY2024–25 Annual Report',
      'Crystal taking part in a Love 21 movement activity'
    ),
    (
      'zh',
      'Crystal 的故事',
      '穩健。堅強。笑容滿面。',
      'Crystal 每週參與 Love 21 健身訓練——平板支撐、掌上壓、無影櫈，再參加硬地滾球比賽。',
      '我為她的穩定表現深感驕傲！',
      'Crystal 媽媽 · 2024–25 年度報告',
      'Crystal 參與 Love 21 運動活動'
    ),
    (
      'cn',
      'Crystal 的故事',
      '稳健。坚强。笑容满面。',
      'Crystal 每周参与 Love 21 健身训练——平板支撑、俯卧撑、靠墙静蹲，再参加硬地滚球比赛。',
      '我为她的稳定表现深感骄傲！',
      'Crystal 妈妈 · 2024–25 年度报告',
      'Crystal 参与 Love 21 运动活动'
    )
) as seed(locale, story_label, headline, body, quote, attribution, image_alt)
where testimonials.slug = 'crystal-story'
on conflict (testimonial_id, locale) do nothing;
