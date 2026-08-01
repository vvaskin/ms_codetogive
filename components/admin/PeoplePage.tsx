import { AdminPageHeader } from "./AdminUI";
import {
  PeopleDirectory,
  type PeopleDirectoryRow,
  type PeopleDirectoryRole,
} from "./PeopleDirectory";
import { getPeopleDirectory } from "@/lib/admin/queries";

export async function PeoplePage({
  role,
  title,
  description,
}: {
  role: PeopleDirectoryRole;
  title: string;
  description: string;
}) {
  const directory = await getPeopleDirectory(role);
  const rows: PeopleDirectoryRow[] = directory.records.map((record) => {
    const base = {
      id: record.profile.id,
      name: record.profile.name,
      email: record.profile.email,
      createdAt: record.profile.created_at,
    };

    if (role === "donor") {
      return {
        ...base,
        role: "donor" as const,
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

  return (
    <>
      <AdminPageHeader
        eyebrow="People"
        title={title}
        description={description}
      />
      <PeopleDirectory rows={rows} role={role} />
    </>
  );
}
