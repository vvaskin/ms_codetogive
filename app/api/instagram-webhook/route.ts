import { NextResponse } from "next/server";
import {
  countInstagramPosts,
  hasInstagramPost,
  upsertInstagramPosts,
  type InstagramPost,
} from "@/lib/instagram-storage";

export const runtime = "nodejs";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object") return null;
  if (Array.isArray(value)) return asRecord(value[0]);
  return value as Record<string, unknown>;
}

function firstString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body." },
      { status: 400 },
    );
  }

  const data = asRecord(payload);
  if (!data) {
    return NextResponse.json(
      { error: "Expected a JSON object." },
      { status: 400 },
    );
  }

  const imageUrl = firstString(data, [
    "media_url",
    "image_url",
    "display_url",
    "thumbnail_url",
  ]);
  if (!imageUrl) {
    return NextResponse.json(
      { error: "No image URL was found in the payload." },
      { status: 400 },
    );
  }

  const permalink = firstString(data, ["permalink"]) ||
    `https://www.instagram.com/p/${data.id ?? data.ig_id ?? "post"}/`;
  const id = String(
    data.id ?? data.ig_id ?? permalink.split("/").filter(Boolean).pop() ?? permalink,
  );
  const caption = firstString(data, ["caption", "text", "description"]);
  const timestamp = firstString(data, ["timestamp", "taken_at"])
    ? new Date(firstString(data, ["timestamp", "taken_at"])).toISOString()
    : new Date().toISOString();

  const post: InstagramPost = {
    id,
    caption,
    mediaType: String(data.media_type ?? "IMAGE"),
    imageUrl,
    permalink,
    timestamp,
  };

  const added = !(await hasInstagramPost(post.id));
  await upsertInstagramPosts([post]);
  const total = await countInstagramPosts();

  return NextResponse.json({ ok: true, added, total });
}
