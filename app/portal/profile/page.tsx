import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContributorPortalExperience } from "../../../components/portal/ContributorPortalExperience";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "My profile",
  description: "Read and update your Love 21 account details.",
};

export default async function ProfilePage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/profile");

  if (profile.role !== "contributor") redirect("/portal");
  return <ContributorPortalExperience initialNav="Profile" name={profile.name} />;
}
