import type { Metadata } from "next";
import { ApplicationDirectory } from "@/components/admin/ApplicationDirectory";
import { AdminPageHeader } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "Volunteer applications" };

export default function VolunteerApplicationsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="People"
        title="Volunteer Applications"
        description="Preview the proposed application-review workflow without mixing fictional records into Supabase."
      />
      <ApplicationDirectory />
    </>
  );
}
