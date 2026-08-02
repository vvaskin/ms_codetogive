import Image from "next/image";
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
      <Image
        src="/assets/images/love21_logo.png"
        alt=""
        width={330}
        height={202}
        priority
        className={styles.logo}
      />
    </Link>
  );
}
