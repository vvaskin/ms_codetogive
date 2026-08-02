import type { Metadata } from "next";
import { PeoplePage } from "@/components/admin/PeoplePage";

export const metadata: Metadata = { title: "Donors" };

export default function DonorsPage() {
  return (
    <PeoplePage
      role="donor"
      title="Donors"
      description="Donor accounts with completed donation totals kept separate by currency."
    />
  );
}
