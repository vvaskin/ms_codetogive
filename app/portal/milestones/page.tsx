import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberPortalExperience } from "@/components/portal/MemberPortalExperience";
import { getMemberPortalData } from "@/lib/server/member-portal";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Milestones",
  description: "Explore your Love 21 event participation milestones.",
};

export default async function MemberMilestonesPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login?next=/portal/milestones");
  if (profile.role !== "member") redirect("/portal");

  const data = await getMemberPortalData(profile.id);
  return <MemberPortalExperience name={profile.name} view="milestones" data={data} />;
}
