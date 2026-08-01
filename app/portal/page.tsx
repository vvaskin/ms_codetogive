import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DonorDashboard } from "@/components/portal/DonorDashboard";
import { PlaceholderDashboard } from "@/components/portal/PlaceholderDashboard";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Your portal",
  description: "Your Love 21 Foundation account portal.",
};

export default async function PortalPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal");
  if (profile.role === "staff") redirect("/admin");

  if (profile.role === "donor") {
    return <DonorDashboard name={profile.name} />;
  }

  return <PlaceholderDashboard name={profile.name} role={profile.role} />;
}
