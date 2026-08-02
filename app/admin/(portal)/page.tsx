import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DonationTrendCard } from "@/components/admin/DonationTrendCard";
import {
  AdminEmptyState,
  AdminMetricCard,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/AdminUI";
import {
  daysWaiting,
  normalizeDashboardCurrency,
  parseDashboardPeriod,
} from "@/lib/admin/dashboard";
import {
  formatAdminDate,
  formatAdminDateTime,
  formatMoney,
} from "@/lib/admin/format";
import {
  getAdminOperationalDashboard,
  getVolunteerApplications,
} from "@/lib/admin/queries";
import styles from "./Dashboard.module.css";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

type AdminDashboardProps = {
  searchParams: Promise<{
    view?: string | string[];
    period?: string | string[];
    currency?: string | string[];
  }>;
};

const legacyPeopleViews: Record<string, string> = {
  member: "/admin/people/members",
  contributor: "/admin/people/contributors",
};

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const params = await searchParams;
  const legacyView = firstQueryValue(params.view);
  if (legacyView && legacyPeopleViews[legacyView]) {
    redirect(legacyPeopleViews[legacyView]);
  }

  const referenceDate = new Date();
  const period = parseDashboardPeriod(firstQueryValue(params.period));
  const currency = normalizeDashboardCurrency(firstQueryValue(params.currency));
  const dashboard = await getAdminOperationalDashboard({
    period,
    currency,
    referenceDate,
  });
  const applications = await getVolunteerApplications();
  const pendingApplications = applications
    .filter(({ status }) => status === "submitted" || status === "under_review")
    .sort(
      (left, right) =>
        new Date(left.submittedAt ?? 0).getTime() -
        new Date(right.submittedAt ?? 0).getTime(),
    );
  return (
    <>
      <AdminPageHeader
        eyebrow="Operational overview"
        title="Dashboard"
        description="See what needs attention now across applications, events, donations and volunteer activity."
      />

      <section aria-labelledby="attention-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Priorities</p>
            <h2 id="attention-title">Needs attention</h2>
          </div>
        </div>

        <div className={styles.attentionGrid}>
          <AdminMetricCard
            label="Pending applications"
            value={pendingApplications.length}
            href="/admin/people/applications"
            linkLabel="Review applications"
            tone="purple"
            icon="◎"
          />
          <AdminMetricCard
            label="Events needing volunteers"
            value={dashboard.events.eventsWithZeroVolunteerRegistrations}
            href="/admin/events"
            linkLabel="Review coverage"
            tone="teal"
            icon="V"
          />
          <AdminMetricCard
            label="Upcoming in 7 days"
            value={dashboard.events.upcomingNextSevenDays}
            href="/admin/events"
            linkLabel="View schedule"
            tone="pink"
            icon="◷"
          />
        </div>
      </section>

      <DonationTrendCard trend={dashboard.donations} />

      <section className={styles.operations} aria-labelledby="operations-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Operational lists</p>
            <h2 id="operations-title">Work queues</h2>
          </div>
          <p>Small, focused lists for the records most likely to need a follow-up.</p>
        </div>

        <div className={styles.operationsGrid}>
          <AdminPanel
            eyebrow="Applications"
            title="Awaiting review"
            description="Oldest pending applications first."
            actions={<Link className={styles.panelLink} href="/admin/people/applications">View all</Link>}
          >
            {pendingApplications.length === 0 ? (
              <AdminEmptyState
                title="No applications waiting"
                description="There are no volunteer applications awaiting review."
                icon="✓"
              />
            ) : (
              <ul className={styles.recordList}>
                {pendingApplications.slice(0, 5).map((application) => {
                  const waitDays = daysWaiting(application.submittedAt ?? "", referenceDate);
                  return (
                    <li key={application.id}>
                      <div>
                        <strong>{application.name}</strong>
                        <span>Applied {formatAdminDate(application.submittedAt ?? "")}</span>
                      </div>
                      <div className={styles.recordAction}>
                        <AdminStatusBadge
                          status="demo"
                          label={waitDays === null ? "Date unavailable" : `${waitDays}d waiting`}
                        />
                        <Link href="/admin/people/applications">Review</Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminPanel>

          <AdminPanel
            eyebrow="Events"
            title="Upcoming volunteer coverage"
            description="Confirmed volunteer registrations on the next published events."
            actions={<Link className={styles.panelLink} href="/admin/events">View all</Link>}
            tone="mint"
          >
            {dashboard.events.upcomingCoverage.length === 0 ? (
              <AdminEmptyState
                title="No upcoming events"
                description="There are no published upcoming events to check for coverage."
                icon="◷"
              />
            ) : (
              <ul className={styles.recordList}>
                {dashboard.events.upcomingCoverage.map((event) => (
                  <li key={event.id}>
                    <div>
                      <strong>{event.title}</strong>
                      <span>{formatAdminDateTime(event.startsAt)}</span>
                    </div>
                    <div className={styles.recordAction}>
                      <AdminStatusBadge
                        status={event.confirmedVolunteers === 0 ? "pending" : "registered"}
                        label={event.confirmedVolunteers === 0
                          ? "Needs volunteers"
                          : `${event.confirmedVolunteers} confirmed`}
                      />
                      <Link href={`/admin/events/${event.id}`}>View</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>

          <div className={styles.donationsPanel}>
            <AdminPanel
              eyebrow="Donations"
              title="Recent completed gifts"
              actions={<Link className={styles.panelLink} href="/admin/people/contributors">View contributors</Link>}
              tone="blush"
            >
              {dashboard.recentDonations.length === 0 ? (
                <AdminEmptyState
                  title="No completed gifts"
                  description="No completed donation records are available yet."
                  icon="$"
                />
              ) : (
                <ul className={`${styles.recordList} ${styles.donationList}`}>
                  {dashboard.recentDonations.map((donation) => (
                    <li key={donation.id}>
                      <div>
                        <strong>{donation.donorName}</strong>
                        <span>{formatAdminDateTime(donation.createdAt)}</span>
                      </div>
                      <div className={styles.donationMeta}>
                        <AdminStatusBadge status="completed" />
                        <strong className={styles.money}>
                          {formatMoney(donation.amountCents, donation.currency)}
                        </strong>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </AdminPanel>
          </div>
        </div>
      </section>
    </>
  );
}
