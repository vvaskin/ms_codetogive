import type { Metadata } from "next";
import { PeoplePage } from "@/components/admin/PeoplePage";

export const metadata: Metadata = { title: "Members & Families" };

export default function MembersPage() {
  return <PeoplePage role="member" />;
}
