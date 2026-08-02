import {
  PeopleDirectory,
  type PeopleDirectoryRow,
  type PeopleDirectoryRole,
} from "./PeopleDirectory";
import { getPeopleDirectory } from "@/lib/admin/queries";

export async function PeoplePage({
  role,
}: {
  role: PeopleDirectoryRole;
}) {
  return <PeopleDirectoryContent role={role} />;
}

export async function PeopleDirectoryContent({
  role,
}: {
  role: PeopleDirectoryRole;
}) {
  const directory = await getPeopleDirectory(role);
  const rows: PeopleDirectoryRow[] = directory.records.map((record) => {
    const base = {
      id: record.profile.id,
      name: record.profile.name,
      email: record.profile.email,
      createdAt: record.profile.created_at,
    };

    if (role === "contributor") {
      return {
        ...base,
        role: "contributor" as const,
        participationCount: record.participationCount,
        donationCount: record.donationCount,
        donationTotals: record.completedDonationTotalsByCurrency.map(
          ({ currency, amountCents }) => ({ currency, amountCents }),
        ),
      };
    }

    return {
      ...base,
      role,
      participationCount: record.participationCount,
    };
  });

  return <PeopleDirectory rows={rows} role={role} />;
}
