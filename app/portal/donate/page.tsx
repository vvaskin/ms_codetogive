import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "@/components/portal/ContributorPortalExperience";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Donation",
  description: "Make a one-time gift or set up recurring giving.",
};

export default async function DonatePage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/donate");
  if (profile.role !== "contributor") redirect("/portal");

  return <ContributorPortalExperience initialNav="Donate" name={profile.name} />;
}
