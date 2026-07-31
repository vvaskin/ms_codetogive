import type { ReactNode } from "react";
import styles from "./PreviewPanel.module.css";

export function PreviewPanel({
  children,
  notice,
}: {
  children: ReactNode;
  notice: string;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.content} aria-disabled="true">
        {children}
      </div>
      <p className={styles.notice} role="note">
        {notice}
      </p>
    </div>
  );
}
