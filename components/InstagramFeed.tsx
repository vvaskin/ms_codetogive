import Image from "next/image";
import { readInstagramPosts } from "@/lib/instagram-storage";

export async function InstagramFeed() {
  const posts = await readInstagramPosts();

  if (posts.length === 0) {
    return <p className="instagram-empty">No Instagram posts synced yet.</p>;
  }

  return (
    <div className="instagram-feed">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noreferrer"
          className="instagram-card"
        >
          <div className="instagram-photo">
            <Image
              src={post.imageUrl}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 800px) 50vw, 25vw"
            />
          </div>
          <div className="instagram-copy">
            <time dateTime={post.timestamp}>
              {new Date(post.timestamp).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
            <p>{post.caption || "Instagram post"}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
