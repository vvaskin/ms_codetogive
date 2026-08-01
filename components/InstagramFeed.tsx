import Image from "next/image";
import { readInstagramPosts } from "@/lib/instagram-storage";
import styles from "./InstagramFeed.module.css";

export async function InstagramFeed() {
  const posts = await readInstagramPosts();

  if (posts.length === 0) {
    return <p className={styles.empty}>No Instagram posts synced yet.</p>;
  }

  return (
    <>
      {posts.map((post) => (
        <article className={styles.card} key={post.id}>
          <div className={styles.meta}>
            <span aria-hidden="true">♥</span>
            <time dateTime={post.timestamp}>
              {new Date(post.timestamp).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
          <a
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className={styles.image}
          >
            <Image
              src={post.imageUrl}
              alt={post.caption || "Instagram post"}
              fill
              unoptimized
              sizes="(max-width: 700px) 100vw, 33vw"
            />
          </a>
          <div className={styles.copy}>
            <span>Instagram</span>
            <h3>{post.caption || "Instagram post"}</h3>
          </div>
        </article>
      ))}
    </>
  );
}
