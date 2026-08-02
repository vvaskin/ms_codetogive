import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "../../../components/portal/ContributorPortalExperience";
import { MemberPortalExperience } from "@/components/portal/MemberPortalExperience";
import { getContributorPortalData } from "@/lib/portal/contributor-data";
import { getMemberPortalData } from "@/lib/server/member-portal";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming events and the ones you've signed up for.",
};

export default async function PortalEventsPage({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  void _searchParams;
  const profile = await getSessionProfile();
  if (!profile) redirect("/login?next=/portal/events");
  if (profile.role === "contributor") {
    const data = await getContributorPortalData(profile.id);
    return (
      <ContributorPortalExperience
        initialNav="Events"
        name={profile.name}
        data={data}
      />
    );
  }
  const data = await getMemberPortalData(profile.id);
  return <MemberPortalExperience name={profile.name} view="events" data={data} />;
}
