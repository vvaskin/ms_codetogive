import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DonationForm } from "@/components/portal/DonationForm";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Donation",
  description: "Make a one-time gift or set up recurring giving.",
};

export default async function DonatePage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/donate");
  if (profile.role !== "donor") redirect("/portal");

  return (
    <div className="portal-subpage">
      <header className="portal-subpage-head">
        <p className="eyebrow">SUPPORT LOVE 21</p>
        <h1>Make a donation</h1>
        <p>Give once or set up recurring support for our programmes.</p>
      </header>

      <DonationForm guest={false} donorName={profile.name} />
    </div>
  );
}
