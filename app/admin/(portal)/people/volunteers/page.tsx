import type { Metadata } from "next";
import { PeoplePage } from "@/components/admin/PeoplePage";

export const metadata: Metadata = { title: "Volunteers" };

export default function VolunteersPage() {
  return (
    <PeoplePage
      role="volunteer"
      title="Volunteers"
      description="Volunteer accounts and their recorded event participation. The current schema does not track active or inactive account status."
    />
  );
}
