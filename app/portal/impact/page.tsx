import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ImpactPanel } from "@/components/portal/ImpactPanel";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "My impact",
  description: "See the difference your donations make.",
};

export default async function ImpactPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login?next=/portal/impact");
  if ((session.user.role as UserRole) !== "donor") redirect("/portal");

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
