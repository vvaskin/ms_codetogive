import Link from "next/link";
import { upcomingEvents } from "@/lib/portal/mock-data";
import type { UserRole } from "@/lib/roles";
import { DashboardHead } from "./DashboardHead";
import { EventCarousel } from "./EventCarousel";
import styles from "./dashboard.module.css";

const roleContent: Record<
  UserRole,
  { intro: string; placeholder: string }
> = {
  member: {
    intro: "Your personal Love 21 member space.",
    placeholder: "Member updates and programme information will appear here.",
  },
  contributor: {
    intro: "Your personal Love 21 supporter space.",
    placeholder: "Contribution and supporter updates will appear here.",
  },
  // TODO: staff admin console. For now, staff falls through to the member view.
  staff: {
    intro: "Your Love 21 staff space.",
    placeholder: "Admin tools will appear here.",
  },
};

export function PlaceholderDashboard({
  name,
  role,
}: {
  name: string;
  role: UserRole;
}) {
  const content = roleContent[role] ?? roleContent.member;

  return (
    <>
      <DashboardHead
        title={`Welcome, ${name.split(" ")[0]}`}
        subtitle={content.intro}
      />

      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.gridFull}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upcoming events</h2>
            <Link href="/events" className={styles.cardHeadLink}>
              View all ➜
            </Link>
          </div>
          <EventCarousel events={upcomingEvents} />
        </section>

        <section className={styles.card}>
          <div className={styles.cardStack}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>My profile</h2>
              <Link href="/portal/profile" className={styles.cardHeadLink}>
                Edit ➜
              </Link>
            </div>
            <p className={styles.cardNote}>
              Keep your contact details up to date so we can reach you.
            </p>
            <Link href="/portal/profile" className={styles.cta}>
              Update profile
            </Link>
          </div>
        </section>

        <section className={styles.placeholderCard}>
          <span aria-hidden="true">♡</span>
          <div>
            <h2>Your portal is ready</h2>
            <p>{content.placeholder}</p>
          </div>
        </section>
      </div>
    </>
  );
}
