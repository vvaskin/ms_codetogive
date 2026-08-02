import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "@/components/portal/ContributorPortalExperience";
import { PlaceholderDashboard } from "@/components/portal/PlaceholderDashboard";
import { getContributorPortalData } from "@/lib/portal/contributor-data";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Your portal",
  description: "Your Love 21 Foundation account portal.",
};

export default async function PortalPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal");

  if (profile.role === "contributor") {
    const data = await getContributorPortalData(profile.id);
    return (
      <ContributorPortalExperience
        initialNav="My Portal"
        name={profile.name}
        data={data}
      />
    );
  }

  // Staff is redirected to /admin by app/portal/layout.tsx; fall back to member
  // copy for any non-contributor session that lands here.
  return <PlaceholderDashboard name={profile.name} role="member" />;
}
