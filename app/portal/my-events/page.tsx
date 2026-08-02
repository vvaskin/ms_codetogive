import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberPortalExperience } from "@/components/portal/MemberPortalExperience";
import { getMemberPortalData } from "@/lib/server/member-portal";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "My events",
  description: "View the Love 21 events connected to your member account.",
};

export default async function MemberEventsPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login?next=/portal/my-events");
  if (profile.role !== "member") redirect("/portal/events");

  const data = await getMemberPortalData(profile.id);
  return <MemberPortalExperience name={profile.name} view="my-events" data={data} />;
}
