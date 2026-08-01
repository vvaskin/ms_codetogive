import type { ReactNode } from "react";
import { PortalSidebar, type PortalUser } from "./PortalSidebar";

export function PortalShell({
  user,
  children,
}: {
  user: PortalUser;
  children: ReactNode;
}) {
  return (
    <div className="portal-layout">
      <PortalSidebar user={user} />
      <main className="portal-content">{children}</main>
    </div>
  );
}
