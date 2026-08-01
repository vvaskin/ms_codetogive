import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { auth } from "@/lib/auth";
import type { PublicUserRole } from "@/lib/db/schema";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Your portal",
  description: "Your Love 21 Foundation account portal.",
};

const roleContent: Record<
  PublicUserRole,
  { label: string; intro: string; placeholder: string }
> = {
  member: {
    label: "Member",
    intro: "Your personal Love 21 member space.",
    placeholder: "Member updates and programme information will appear here.",
  },
  donor: {
    label: "Donor",
    intro: "Your personal Love 21 supporter space.",
    placeholder: "Donation information and supporter updates will appear here.",
  },
  volunteer: {
    label: "Volunteer",
    intro: "Your personal Love 21 volunteer space.",
    placeholder: "Volunteer opportunities and event information will appear here.",
  },
};

export default async function PortalPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login?next=/portal");

  if (session.user.role === "staff") redirect("/admin");

  const role = session.user.role as PublicUserRole;
  const content = roleContent[role] ?? roleContent.member;

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topline}>
          <span className={`${styles.roleBadge} ${styles[role] ?? styles.member}`}>{content.label}</span>
          <SignOutButton />
        </div>

        <div className={styles.welcome}>
          <p className={styles.eyebrow}>YOUR LOVE 21 PORTAL</p>
          <h1>Welcome, {session.user.name}</h1>
          <p>{content.intro}</p>
        </div>

        <div className={styles.placeholder}>
          <span aria-hidden="true">♡</span>
          <div>
            <h2>Your portal is ready</h2>
            <p>{content.placeholder}</p>
          </div>
        </div>

        <dl className={styles.summary}>
          <div>
            <dt>Email</dt>
            <dd>{session.user.email}</dd>
          </div>
          <div>
            <dt>Account type</dt>
            <dd>{content.label}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
