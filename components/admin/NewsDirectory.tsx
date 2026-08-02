"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./NewsDirectory.module.css";

export type AdminNewsRecord = {
  slug: string;
  title: string;
  publishedAt: string;
  channel: "News & media";
  status: "Published";
};

export function NewsDirectory({ records }: { records: AdminNewsRecord[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return records;
    return records.filter((record) =>
      record.title.toLocaleLowerCase().includes(normalized),
    );
  }, [query, records]);

  return (
    <div>
      <div className={styles.toolbar}>
        <label>
          <span>Search stories</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title"
          />
        </label>
        <span className={styles.count} aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "story" : "stories"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>No repository stories match this search.</p>
      ) : (
        <div
          className={styles.tableScroll}
          role="region"
          aria-label="Published news and stories"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Publish date</th>
                <th><span className={styles.srOnly}>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.slug}>
                  <td className={styles.title}>{record.title}</td>
                  <td>{record.channel}</td>
                  <td><span className={styles.published}>{record.status}</span></td>
                  <td>{record.publishedAt}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/${record.slug}/`} target="_blank">
                        View
                      </Link>
                      <button
                        type="button"
                        disabled
                        title="Stories are currently edited in content/site-data.ts"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
