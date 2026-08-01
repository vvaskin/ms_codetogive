import type { ReactNode } from "react";
import styles from "./StatusPill.module.css";

type Tone = "pink" | "blue" | "teal" | "yellow" | "purple" | "coral" | "ink";

export function StatusPill({
  children,
  tone = "pink",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return <span className={`${styles.pill} ${styles[tone]}`}>{children}</span>;
}
