import type { Metadata } from "next";
import { AdminPostForm } from "@/components/AdminPostForm";
import styles from "@/components/AdminPost.module.css";

export const metadata: Metadata = {
  title: "Social Media Post",
  description: "Post to Love 21 social media channels.",
};

export default function AdminPostPage() {
  const configured = Boolean(process.env.MAKE_WEBHOOK_URL);

  return (
    <section className={styles.page}>
      <div className={styles.wrap}>
        <h1>Social Media Post</h1>
        <p>
          Add photos and a description, then send them to Instagram and
          Facebook.
        </p>
        <AdminPostForm configured={configured} />
      </div>
    </section>
  );
}
