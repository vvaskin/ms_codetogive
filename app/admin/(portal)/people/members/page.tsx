import type { Metadata } from "next";
import { PeoplePage } from "@/components/admin/PeoplePage";

export const metadata: Metadata = { title: "Members & Families" };

export default function MembersPage() {
  return (
    <PeoplePage
      role="member"
      title="Members & Families"
      description="Member accounts in Supabase. Household and family relationships are not tracked by the current data model."
    />
  );
}
