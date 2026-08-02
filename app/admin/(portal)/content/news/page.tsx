import type { Metadata } from "next";
import {
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/AdminUI";
import {
  NewsDirectory,
  type AdminNewsRecord,
} from "@/components/admin/NewsDirectory";
import { mediaArticles } from "@/content/site-data";
import styles from "./News.module.css";

export const metadata: Metadata = { title: "News & Stories" };

const records: AdminNewsRecord[] = mediaArticles.map((article) => ({
  slug: article.slug,
  title: article.title,
  publishedAt: article.date,
  channel: "News & media",
  status: "Published",
}));

export default function AdminNewsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="News & Stories"
        description="Review the public stories and media records currently defined by the website."
        actions={(
          <button
            className={styles.disabledAction}
            type="button"
            disabled
            title="There is no writable news backend in this project yet"
          >
            Add story
          </button>
        )}
      />

      <aside className={styles.repositoryNotice} aria-label="Content storage information">
        <span aria-hidden="true">i</span>
        <div>
          <strong>Repository-managed content</strong>
          <p>
            These are real public-site records from <code>content/site-data.ts</code>.
            The project has no news database or write API, so create and edit actions
            stay disabled instead of pretending to save changes.
          </p>
        </div>
      </aside>

      <AdminPanel
        eyebrow="Published content"
        title="Story directory"
        description={`${records.length} ${records.length === 1 ? "story" : "stories"} available on the public website`}
      >
        <NewsDirectory records={records} />
      </AdminPanel>
    </>
  );
}
