import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "@/components/portal/ContributorPortalExperience";
import { getContributorPortalData } from "@/lib/portal/contributor-data";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "My volunteer",
  description: "Track your volunteer application and volunteering activity.",
};

export default async function MyVolunteeringPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login?next=/portal/volunteering");
  if (profile.role !== "contributor") redirect("/portal");
  const data = await getContributorPortalData(profile.id);
  return (
    <ContributorPortalExperience
      initialNav="My Volunteer"
      name={profile.name}
      data={data}
    />
  );
}
