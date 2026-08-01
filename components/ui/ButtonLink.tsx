import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ButtonLink.module.css";

type Variant = "pink" | "blue" | "teal" | "dark" | "outline" | "quiet";

export function ButtonLink({
  href,
  children,
  variant = "pink",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim();

  if (external) {
    return (
      <a
        className={classes}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
