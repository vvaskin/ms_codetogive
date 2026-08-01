import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { USER_ROLES, type UserRole } from "@/lib/roles";
import {
  createAdminClient,
  getAdminAuthState,
} from "@/lib/supabase/admin";
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
] as const satisfies ReadonlyArray<{ key: UserRole; label: string }>;

export default async function AdminPortal({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { user: staffUser, isStaff } = await getAdminAuthState();

  if (!staffUser || !isStaff) {
    redirect("/admin/login");
  }

  const requestedView = (await searchParams).view;
  const activeView = USER_ROLES.includes(requestedView as UserRole)
    ? (requestedView as UserRole)
    : "member";
  const admin = createAdminClient();
  const { data: allUsers, error } = await admin
    .from("users")
    .select("id, email, name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load the people database.");
  }

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
          <span>Signed in as {staffUser.email ?? "Staff"}</span>
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
                    <td className={styles.email}>
                      {record.email ?? "Email unavailable"}
                    </td>
                    <td>{new Date(record.created_at).toLocaleDateString("en-GB")}</td>
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
