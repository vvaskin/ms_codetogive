import { NextResponse } from "next/server";
import {
  readInstagramPosts,
  saveInstagramPosts,
  type InstagramPost,
} from "@/lib/instagram-storage";

export const runtime = "nodejs";

const IG_APP_ID = "936619743392459";

interface InstagramNode {
  id: string;
  shortcode: string;
  taken_at_timestamp: number;
  display_url: string;
  is_video?: boolean;
  edge_media_to_caption?: { edges?: { node?: { text?: string } }[] };
}

interface ProfileResponse {
  data?: {
    user?: {
      edge_owner_to_timeline_media?: {
        edges?: { node?: InstagramNode }[];
      };
    };
  };
  status?: string;
  message?: string;
}

export async function POST() {
  const username = process.env.INSTAGRAM_USERNAME || "love21foundation";

  const url =
    `https://i.instagram.com/api/v1/users/web_profile_info/` +
    `?username=${encodeURIComponent(username)}`;

  const headers: Record<string, string> = {
    "X-IG-App-ID": IG_APP_ID,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  };
  if (process.env.INSTAGRAM_SESSIONID) {
    headers["Cookie"] = `sessionid=${process.env.INSTAGRAM_SESSIONID}`;
  }

  let response: Response;
  try {
    response = await fetch(url, { headers, cache: "no-store" });
  } catch {
    return NextResponse.json(
      { error: "Could not reach Instagram." },
      { status: 502 },
    );
  }

  const json = (await response.json().catch(() => ({}))) as ProfileResponse;

  if (!response.ok || json.status === "fail" || !json.data?.user) {
    return NextResponse.json(
      {
        error:
          json.message ||
          "Instagram returned an error. The profile may be private or the request was blocked.",
      },
      { status: 502 },
    );
  }

  const edges =
    json.data.user.edge_owner_to_timeline_media?.edges ?? [];

  const incoming: InstagramPost[] = edges
    .map((edge) => {
      const node = edge.node;
      if (!node) return null;
      return {
        id: node.id,
        caption:
          node.edge_media_to_caption?.edges?.[0]?.node?.text ?? "",
        mediaType: node.is_video ? "VIDEO" : "IMAGE",
        imageUrl: node.display_url,
        permalink: `https://www.instagram.com/p/${node.shortcode}/`,
        timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
      };
    })
    .filter((post): post is InstagramPost => post !== null && Boolean(post.imageUrl));

  if (incoming.length === 0) {
    return NextResponse.json(
      { error: "No posts were found on this Instagram account." },
      { status: 404 },
    );
  }

  const existing = await readInstagramPosts();
  const byId = new Map(existing.map((post) => [post.id, post]));
  let added = 0;
  for (const post of incoming) {
    if (!byId.has(post.id)) added += 1;
    byId.set(post.id, post);
  }
  const merged = [...byId.values()].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );
  await saveInstagramPosts(merged);

  return NextResponse.json({ ok: true, added, total: merged.length });
}
