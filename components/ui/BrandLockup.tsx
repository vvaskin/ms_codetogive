import Link from "next/link";
import styles from "./BrandLockup.module.css";

export function BrandLockup({
  href,
  compact = false,
}: {
  href: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${styles.lockup} ${compact ? styles.compact : ""}`}
      aria-label="Love 21"
    >
      <span className={styles.mark} aria-hidden="true">
        21
      </span>
      <span className={styles.wordmark}>Love 21</span>
    </Link>
  );
}
