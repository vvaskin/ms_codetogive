import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
}

const file = path.join(process.cwd(), "data", "instagram-posts.json");

export async function readInstagramPosts(): Promise<InstagramPost[]> {
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as { posts?: InstagramPost[] };
    return parsed.posts ?? [];
  } catch {
    return [];
  }
}

export async function saveInstagramPosts(posts: InstagramPost[]) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(
    file,
    JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 2),
    "utf8",
  );
}
