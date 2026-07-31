import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/db/schema";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login?next=/portal");

  const user = {
    name: session.user.name,
    email: session.user.email,
    role: session.user.role as UserRole,
    image: session.user.image,
  };

  return <PortalShell user={user}>{children}</PortalShell>;
}
