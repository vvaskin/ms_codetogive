import Link from "next/link";
import { formatCurrency, upcomingEvents } from "@/lib/portal/mock-data";
import { createClient } from "@/lib/supabase/server";
import { DashboardHead } from "./DashboardHead";
import { EventCarousel } from "./EventCarousel";
import { ImpactPanel } from "./ImpactPanel";
import styles from "./dashboard.module.css";

export async function DonorDashboard({ name }: { name: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: rows } = user
    ? await supabase
        .from("donations")
        .select("amount_cents, status")
        .eq("donor_id", user.id)
    : { data: [] as Array<{ amount_cents: number; status: string }> };
  const totalCents = (rows ?? [])
    .filter((r) => r.status === "completed" || r.status === "active")
    .reduce((sum, r) => sum + r.amount_cents, 0);
  const donationCount = (rows ?? []).length;
  const recurringCount = (rows ?? []).filter((r) => r.status === "active").length;

  return (
    <>
      <DashboardHead
        title={`Welcome back, ${name.split(" ")[0]}.`}
        subtitle="Because of contributors like you, more families get to show the world so much ability."
        stat={{
          value: formatCurrency(totalCents / 100),
          label: "total donated",
        }}
      />

      <section className={styles.metricStrip}>
        <article className={styles.metricCard}>
          <p>Donations made</p>
          <strong>{donationCount}</strong>
        </article>
        <article className={styles.metricCard}>
          <p>Active recurring plans</p>
          <strong>{recurringCount}</strong>
        </article>
        <article className={styles.metricCard}>
          <p>Events in calendar</p>
          <strong>{upcomingEvents.length}</strong>
        </article>
      </section>

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
            <h2 className={styles.cardTitle}>My donations</h2>
            <Link href="/portal/impact" className={styles.cardHeadLink}>
              See details ➜
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
              Edit profile
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
