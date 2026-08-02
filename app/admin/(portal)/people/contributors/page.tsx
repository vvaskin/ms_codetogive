import type { Metadata } from "next";
import { PeoplePage } from "@/components/admin/PeoplePage";

export const metadata: Metadata = { title: "Contributors" };

export default function ContributorsPage() {
  return (
    <PeoplePage
      role="contributor"
      title=""
      description=""
    />
  );
}
