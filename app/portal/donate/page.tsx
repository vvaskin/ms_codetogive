import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "@/components/portal/ContributorPortalExperience";
import { getContributorPortalData } from "@/lib/portal/contributor-data";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Donation",
  description: "Make a one-time gift or set up recurring giving.",
};

export default async function DonatePage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/donate");
  if (profile.role !== "contributor") redirect("/portal");
  const data = await getContributorPortalData(profile.id);

  return (
    <ContributorPortalExperience
      initialNav="Donate"
      name={profile.name}
      data={data}
    />
  );
}
