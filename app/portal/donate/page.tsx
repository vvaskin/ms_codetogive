import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DonationForm } from "@/components/portal/DonationForm";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Donation",
  description: "Make a one-time gift or set up recurring giving.",
};

export default async function DonatePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login?next=/portal/donate");
  if ((session.user.role as UserRole) !== "donor") redirect("/portal");

  return (
    <div className="portal-subpage">
      <header className="portal-subpage-head">
        <p className="eyebrow">SUPPORT LOVE 21</p>
        <h1>Make a donation</h1>
        <p>Give once or set up recurring support for our programmes.</p>
      </header>

      <DonationForm />
    </div>
  );
}
