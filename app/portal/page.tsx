import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorDashboard } from "@/components/portal/ContributorDashboard";
import { PlaceholderDashboard } from "@/components/portal/PlaceholderDashboard";
import { isContributorRole } from "@/lib/roles";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Your portal",
  description: "Your Love 21 Foundation account portal.",
};

export default async function PortalPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal");

  if (isContributorRole(profile.role)) {
    return <ContributorDashboard name={profile.name} />;
  }

  const portalRole = profile.role === "staff" ? "member" : profile.role;
  return <PlaceholderDashboard name={profile.name} role={portalRole} />;
}
