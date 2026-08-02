import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "@/components/portal/ContributorPortalExperience";
import { MemberPortalExperience } from "@/components/portal/MemberPortalExperience";
import { getContributorPortalData } from "@/lib/portal/contributor-data";
import { getMemberPortalData } from "@/lib/server/member-portal";
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

  const data = await getMemberPortalData(profile.id);
  return (
    <MemberPortalExperience name={profile.name} view="dashboard" data={data} />
  );
}
