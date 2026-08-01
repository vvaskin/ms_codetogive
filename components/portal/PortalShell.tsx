import type { ReactNode } from "react";
import { PortalSidebar, type PortalUser } from "./PortalSidebar";
import styles from "./PortalShell.module.css";

export function PortalShell({
  user,
  children,
}: {
  user: PortalUser;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <PortalSidebar user={user} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
