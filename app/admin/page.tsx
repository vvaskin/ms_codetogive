import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { SignOutButton } from "@/components/SignOutButton";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { isStaffRole } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, type PublicUserRole } from "@/lib/db/schema";
import { deleteUser } from "./actions";
import styles from "./AdminPortal.module.css";

export const metadata: Metadata = {
  title: "Admin portal",
  robots: { index: false, follow: false },
};

const views = [
  { key: "member", label: "Users" },
  { key: "donor", label: "Donors" },
  { key: "volunteer", label: "Volunteers" },
] as const satisfies ReadonlyArray<{ key: PublicUserRole; label: string }>;

export default async function AdminPortal({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !isStaffRole(session.user.role)) {
    redirect("/admin/login");
  }

  const requestedView = (await searchParams).view;
  const activeView = views.some(({ key }) => key === requestedView)
    ? (requestedView as PublicUserRole)
    : "member";
  const allUsers = await db.select().from(user).orderBy(desc(user.createdAt));
  const visibleUsers = allUsers.filter(({ role }) => role === activeView);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ADMINISTRATION</p>
          <h1>People database</h1>
          <p>Manage member, donor, and volunteer accounts.</p>
        </div>
        <div className={styles.headerActions}>
          <span>Signed in as {session.user.email}</span>
          <SignOutButton />
        </div>
      </header>

      <nav className={styles.workspaceNav} aria-label="Admin sections">
        <Link href="/admin" className={styles.activeWorkspace}>People</Link>
        <Link href="/admin/events" className={styles.workspaceLink}>Events</Link>
      </nav>

      <nav className={styles.tabs} aria-label="Account type">
        {views.map(({ key, label }) => {
          const count = allUsers.filter(({ role }) => role === key).length;
          return (
            <Link
              href={`/admin?view=${key}`}
              className={activeView === key ? styles.activeTab : styles.tab}
              key={key}
            >
              {label} <span>{count}</span>
            </Link>
          );
        })}
      </nav>

      <section className={styles.tablePanel}>
        <div className={styles.tableHeading}>
          <div>
            <p className={styles.eyebrow}>ACCOUNT DIRECTORY</p>
            <h2>{views.find(({ key }) => key === activeView)?.label}</h2>
          </div>
          <span>{visibleUsers.length} records</span>
        </div>

        {visibleUsers.length === 0 ? (
          <p className={styles.empty}>No accounts in this view yet.</p>
        ) : (
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((record) => (
                  <tr key={record.id}>
                    <td className={styles.name}>{record.name}</td>
                    <td className={styles.email}>{record.email}</td>
                    <td>{record.createdAt.toLocaleDateString("en-GB")}</td>
                    <td>
                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={record.id} />
                        <input type="hidden" name="currentView" value={activeView} />
                        <ConfirmSubmitButton
                          className={styles.deleteButton}
                          message={`Delete ${record.name}'s account? This cannot be undone.`}
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
