import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ImpactPanel } from "@/components/portal/ImpactPanel";
import { isContributorRole } from "@/lib/roles";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "My impact",
  description: "See the difference your donations make.",
};

export default async function ImpactPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/impact");
  if (profile.role !== "contributor") redirect("/portal");

  return (
    <div className="portal-subpage">
      <header className="portal-subpage-head">
        <p className="eyebrow">YOUR CONTRIBUTION</p>
        <h1>My impact</h1>
        <p>A snapshot of your giving and the community it supports.</p>
      </header>

      <ImpactPanel variant="full" />
    </div>
  );
}
