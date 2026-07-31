import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DonorDashboard } from "@/components/portal/DonorDashboard";
import { PlaceholderDashboard } from "@/components/portal/PlaceholderDashboard";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Your portal",
  description: "Your Love 21 Foundation account portal.",
};

export default async function PortalPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login?next=/portal");

  const role = session.user.role as UserRole;

  if (role === "donor") {
    return <DonorDashboard name={session.user.name} />;
  }

  return <PlaceholderDashboard name={session.user.name} role={role} />;
}
