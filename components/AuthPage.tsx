import type { ReactNode } from "react";
import styles from "./AuthPage.module.css";

export function AuthPage({
  eyebrow,
  title,
  description,
  children,
  variant = "login",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  variant?: "login" | "signup";
}) {
  return (
    <section className={styles.page}>
      <div
        className={`${styles.panel} ${variant === "signup" ? styles.panelSignup : ""}`}
      >
        <div className={styles.panelInner}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.formColumn}>{children}</div>
    </section>
  );
}
