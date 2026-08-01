import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { getSessionProfile } from "@/lib/supabase/profile";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal");
  if (profile.role === "staff") redirect("/admin");

  return (
    <PortalShell
      user={{
        name: profile.name,
        email: profile.email,
        role: profile.role,
        image: profile.avatarUrl,
      }}
    >
      {children}
    </PortalShell>
  );
}
