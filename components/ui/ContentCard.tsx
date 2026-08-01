import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ContentCard.module.css";

export function ContentCard({
  href,
  image,
  imageAlt = "",
  meta,
  title,
  summary,
  footer,
}: {
  href: string;
  image?: string;
  imageAlt?: string;
  meta?: ReactNode;
  title: string;
  summary?: string;
  footer?: ReactNode;
}) {
  return (
    <Link href={href} className={styles.card}>
      {image ? (
        <span className={styles.media}>
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
        </span>
      ) : (
        <span className={styles.mediaPlaceholder} aria-hidden="true" />
      )}
      <span className={styles.body}>
        {meta ? <span className={styles.meta}>{meta}</span> : null}
        <strong className={styles.title}>{title}</strong>
        {summary ? <span className={styles.summary}>{summary}</span> : null}
        {footer}
      </span>
    </Link>
  );
}
