import type { Metadata } from "next";
import Link from "next/link";
import { ApplicationDirectory } from "@/components/admin/ApplicationDirectory";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { PeopleDirectoryContent } from "@/components/admin/PeoplePage";
import styles from "./Volunteers.module.css";

export const metadata: Metadata = { title: "Volunteers" };

type VolunteersPageProps = {
  searchParams: Promise<{ view?: string | string[] }>;
};

export default async function VolunteersPage({ searchParams }: VolunteersPageProps) {
  const { view: requestedView } = await searchParams;
  const value = Array.isArray(requestedView) ? requestedView[0] : requestedView;
  const view = value === "applications" ? "applications" : "directory";

  return (
    <>
      <AdminPageHeader
        eyebrow="People"
        title="Volunteers"
        description="Review applications and manage volunteer accounts in one place."
      />

      <nav className={styles.tabs} aria-label="Volunteer records">
        <Link
          aria-current={view === "applications" ? "page" : undefined}
          href="/admin/people/volunteers?view=applications"
        >
          Applications
        </Link>
        <Link
          aria-current={view === "directory" ? "page" : undefined}
          href="/admin/people/volunteers?view=directory"
        >
          Volunteer directory
        </Link>
      </nav>

      {view === "applications" ? (
        <ApplicationDirectory />
      ) : (
        <PeopleDirectoryContent role="volunteer" />
      )}
    </>
  );
}
