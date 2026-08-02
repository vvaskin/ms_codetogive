import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { createAdminClient } from "@/lib/supabase/admin";

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
}

type InstagramPostRow = {
  id: string;
  caption: string | null;
  media_type: string | null;
  image_url: string | null;
  permalink: string | null;
  timestamp: string | null;
};

const legacyFile = path.join(process.cwd(), "data", "instagram-posts.json");

function mapRow(row: InstagramPostRow): InstagramPost {
  return {
    id: row.id,
    caption: row.caption ?? "",
    mediaType: row.media_type ?? "IMAGE",
    imageUrl: row.image_url ?? "",
    permalink: row.permalink ?? "",
    // missing timestamps collapse to the epoch so those posts sort last instead of crashing the ordering
    timestamp: row.timestamp ?? new Date(0).toISOString(),
  };
}

/** Newest posts first. Falls back to the legacy JSON file as a one-time seed. */
export async function readInstagramPosts(): Promise<InstagramPost[]> {
  // service-role client: this feeds a statically cached public page, so there
  // is no cookie session to authenticate against
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("id, caption, media_type, image_url, permalink, timestamp")
    .order("timestamp", { ascending: false });

  if (error) {
    throw new Error(`Unable to load Instagram posts: ${error.message}`);
  }

  // only an empty table triggers the seed; once rows exist the database owns
  // the data and the legacy file is never read again
  if (data.length === 0) {
    const seeded = await seedFromLegacyJson();
    if (seeded.length > 0) return seeded;
  }

  return data.map(mapRow);
}

/** Insert or replace posts by their Instagram media id. */
export async function upsertInstagramPosts(posts: InstagramPost[]) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("instagram_posts")
    .upsert(
      posts.map((post) => ({
        id: post.id,
        caption: post.caption,
        media_type: post.mediaType,
        image_url: post.imageUrl,
        permalink: post.permalink,
        timestamp: post.timestamp,
      })),
      { onConflict: "id" },
    );

  if (error) {
    throw new Error(`Unable to save Instagram posts: ${error.message}`);
  }
}

export async function hasInstagramPost(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to check Instagram post ${id}: ${error.message}`);
  }

  return data !== null;
}

export async function countInstagramPosts(): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("instagram_posts")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(`Unable to count Instagram posts: ${error.message}`);
  }

  return count ?? 0;
}

async function seedFromLegacyJson(): Promise<InstagramPost[]> {
  let posts: InstagramPost[];
  try {
    const raw = await readFile(legacyFile, "utf8");
    posts = (JSON.parse(raw) as { posts?: InstagramPost[] }).posts ?? [];
  } catch {
    // a missing or malformed file just means there is no legacy data to import
    return [];
  }

  // persist the seed immediately so the fallback path runs at most once
  if (posts.length > 0) await upsertInstagramPosts(posts);
  return posts;
}
