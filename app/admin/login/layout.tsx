import type { ReactNode } from "react";
import { BrandLockup } from "@/components/ui/BrandLockup";
import styles from "./AdminLogin.module.css";

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <BrandLockup href="/" compact />
        <span>Staff portal</span>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
