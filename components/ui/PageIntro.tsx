import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

export function PageIntro({
  eyebrow,
  title,
  description,
  scriptNote,
  actions,
  handEyebrow = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  scriptNote?: string;
  actions?: ReactNode;
  handEyebrow?: boolean;
}) {
  return (
    <header className={styles.intro}>
      {eyebrow ? (
        <p className={handEyebrow ? styles.handEyebrow : styles.eyebrow}>
          {eyebrow}
        </p>
      ) : null}
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.description}>{description}</p> : null}
      {scriptNote ? <p className={styles.scriptNote}>{scriptNote}</p> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
