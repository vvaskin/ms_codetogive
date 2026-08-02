import Link from "next/link";
import {
  donationHistory,
  formatCurrency,
  upcomingEvents,
} from "@/lib/portal/mock-data";
import { DashboardHead } from "./DashboardHead";
import { EventCarousel } from "./EventCarousel";
import { ImpactPanel } from "./ImpactPanel";
import styles from "./dashboard.module.css";

export function ContributorDashboard({ name }: { name: string }) {
  const totalDonated = donationHistory.reduce((sum, r) => sum + r.amount, 0);

  return (
    <>
      <DashboardHead
        title={`Welcome back, ${name.split(" ")[0]}`}
        subtitle="Here is what is happening and the difference you are making."
        stat={{
          value: formatCurrency(totalDonated),
          label: "Total contributed",
        }}
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
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>My impact</h2>
            <Link href="/portal/impact" className={styles.cardHeadLink}>
              Details ➜
            </Link>
          </div>
          <ImpactPanel variant="compact" />
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
              Keep your contact details up to date so we can reach you about the
              programmes you support.
            </p>
            <Link href="/portal/profile" className={styles.cta}>
              Update profile
            </Link>
          </div>
        </section>

        <section className={`${styles.card} ${styles.gridFull}`}>
          <div className={styles.cardStack}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Make a donation</h2>
              <Link href="/portal/donate" className={styles.cardHeadLink}>
                Give ➜
              </Link>
            </div>
            <p className={styles.cardNote}>
              Support Love 21 with a one-time gift or set up recurring giving.
            </p>
            <Link
              href="/portal/donate"
              className={`${styles.cta} ${styles.ctaPrimary}`}
            >
              Donate now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
