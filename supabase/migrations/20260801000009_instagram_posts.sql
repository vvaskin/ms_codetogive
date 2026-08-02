-- Instagram media synced through /api/instagram-webhook.
--
-- Previously the webhook wrote to data/instagram-posts.json. Instagram posts
-- now live in this table; the legacy JSON file is only read once as a seed
-- source when the table is empty. Media is public, and the feed is rendered on
-- the server, so reads are allowed for everyone while writes stay server-side.

create table public.instagram_posts (
  id         text primary key,
  caption    text not null default '',
  media_type text not null default 'IMAGE',
  image_url  text not null,
  permalink  text not null,
  timestamp  timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index instagram_posts_timestamp_idx
  on public.instagram_posts (timestamp desc);

create trigger instagram_posts_set_updated_at
  before update on public.instagram_posts
  for each row execute function public.set_updated_at();

-- The media feed is public. The webhook and the seed path both use the
-- server-only service-role client, so no anonymous insert/update policy exists.
alter table public.instagram_posts enable row level security;

create policy "Instagram posts are readable by everyone"
  on public.instagram_posts for select
  using (true);
