import type { ReactNode } from "react";
import styles from "./SectionShell.module.css";

type Tone = "canvas" | "white" | "blush" | "sky" | "blue" | "dark" | "mint";
type Width = "wide" | "standard" | "narrow";

export function SectionShell({
  children,
  tone = "canvas",
  width = "wide",
  id,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  tone?: Tone;
  width?: Width;
  id?: string;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag
      id={id}
      className={`${styles.shell} ${styles[tone]} ${className}`.trim()}
    >
      <div className={`${styles.inner} ${styles[width]}`}>{children}</div>
    </Tag>
  );
}
