import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "@/components/portal/ContributorPortalExperience";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "My donations",
  description: "See your giving history and donation impact.",
};

export default async function ImpactPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/impact");
  if (profile.role !== "contributor") redirect("/portal");

  return <ContributorPortalExperience initialNav="My Donations" name={profile.name} />;
}
