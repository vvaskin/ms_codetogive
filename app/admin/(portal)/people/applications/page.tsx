import type { Metadata } from "next";
import { ApplicationDirectory } from "@/components/admin/ApplicationDirectory";
import { getVolunteerApplications } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Volunteer applications" };

export default async function VolunteerApplicationsPage() {
  const applications = await getVolunteerApplications();

  return (
    <>
      <ApplicationDirectory applications={applications} />
    </>
  );
}
