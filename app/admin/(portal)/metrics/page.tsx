import type { Metadata } from "next";
import {
  AdminMetricCard,
  AdminPageHeader,
  AdminPanel,
  DemoNotice,
} from "@/components/admin/AdminUI";
import { mediaArticles } from "@/content/site-data";
import { demoVolunteerApplications } from "@/lib/admin/demo-data";
import { formatMoney } from "@/lib/admin/format";
import { getAdminImpactMetrics } from "@/lib/admin/queries";
import styles from "./Metrics.module.css";

export const metadata: Metadata = { title: "Impact metrics" };

const programmeTypes = [
  { key: "sport", label: "Sport" },
  { key: "nutrition", label: "Nutrition" },
  { key: "family_support", label: "Family Support" },
] as const;

export default async function AdminMetricsPage() {
  const metrics = await getAdminImpactMetrics();
  const pendingDemoApplications = demoVolunteerApplications.filter(
    (application) => application.status === "pending",
  ).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Impact"
        title="Metrics"
        description="Operational counts calculated from the linked Supabase records, with repository content shown separately."
      />

      <section className={styles.metricGrid} aria-label="Impact overview">
        <AdminMetricCard
          label="Member accounts"
          value={metrics.accounts.byRole.member}
          description="Accounts with the member role; family relationships are not stored"
          tone="pink"
          icon="M"
        />
        <AdminMetricCard
          label="Published sessions"
          value={metrics.programmes.publishedEventRecords}
          description={`${metrics.programmes.upcomingPublishedEvents} upcoming published events`}
          tone="blue"
          icon="◷"
        />
        <AdminMetricCard
          label="Recorded attendance"
          value={metrics.participation.byStatus.attended}
          description={`${metrics.participation.totalRecords} total participation records`}
          tone="teal"
          icon="✓"
        />
        <AdminMetricCard
          label="Stories published"
          value={mediaArticles.length}
          description="Public stories stored in the website repository"
          tone="purple"
          icon="N"
        />
        <AdminMetricCard
          label="Volunteer accounts"
          value={metrics.accounts.byRole.volunteer}
          description={`${metrics.participation.volunteerParticipationRecords} volunteer participation records`}
          tone="yellow"
          icon="V"
        />
        <AdminMetricCard
          label="Volunteer attendance"
          value={metrics.participation.volunteerAttendances}
          description="Attendance records linked to volunteer accounts"
          tone="coral"
          icon="◎"
        />
      </section>

      <div className={styles.sectionGrid}>
        <AdminPanel
          eyebrow="Programmes"
          title="Programme breakdown"
          description="Event and attendance records grouped by the categories supported by the current schema."
        >
          <div className={styles.tableScroll} role="region" aria-label="Programme metrics" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th>Programme</th>
                  <th>Event records</th>
                  <th>Published</th>
                  <th>Attendances</th>
                </tr>
              </thead>
              <tbody>
                {programmeTypes.map(({ key, label }) => (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    <td>{metrics.programmes.eventsByType[key]}</td>
                    <td>{metrics.programmes.publishedEventsByType[key]}</td>
                    <td>{metrics.participation.attendancesByEventType[key]}</td>
                  </tr>
                ))}
                {metrics.programmes.uncategorizedEvents > 0 || metrics.participation.uncategorizedAttendances > 0 ? (
                  <tr>
                    <th scope="row">Uncategorised</th>
                    <td>{metrics.programmes.uncategorizedEvents}</td>
                    <td>—</td>
                    <td>{metrics.participation.uncategorizedAttendances}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </AdminPanel>

        <AdminPanel
          eyebrow="Donations"
          title="Donation snapshot"
          description="Currencies remain separate; totals include completed donation records only."
          tone="blush"
        >
          <dl className={styles.donationSummary}>
            <div><dt>Donor accounts</dt><dd>{metrics.accounts.byRole.donor}</dd></div>
            <div><dt>Accounts with donation records</dt><dd>{metrics.donations.accountsWithDonationRecords}</dd></div>
            <div><dt>Accounts with multiple records</dt><dd>{metrics.donations.accountsWithMultipleDonationRecords}</dd></div>
            <div><dt>Active recurring records</dt><dd>{metrics.donations.activeRecurringRecords}</dd></div>
            <div><dt>Event-earmarked records</dt><dd>{metrics.donations.eventEarmarkedRecords}</dd></div>
          </dl>

          <div className={styles.currencyTotals}>
            <h3>Completed totals</h3>
            {metrics.donations.completedTotalsByCurrency.length > 0 ? (
              metrics.donations.completedTotalsByCurrency.map((total) => (
                <div key={total.currency}>
                  <strong>{formatMoney(total.amountCents, total.currency)}</strong>
                  <span>{total.donationCount} completed {total.donationCount === 1 ? "record" : "records"}</span>
                </div>
              ))
            ) : (
              <p>No completed donation records.</p>
            )}
          </div>
        </AdminPanel>
      </div>

      <section className={styles.demoSection} aria-labelledby="prototype-metrics-title">
        <DemoNotice title="Prototype-only application metric">
          Volunteer applications do not have a database table yet. This count comes only from the clearly separated demo module and is not a live submission total.
        </DemoNotice>
        <div className={styles.demoMetric}>
          <h2 id="prototype-metrics-title">Pending applications</h2>
          <strong>{pendingDemoApplications}</strong>
          <span>demonstration records</span>
        </div>
      </section>

      <AdminPanel
        eyebrow="Data scope"
        title="What is not calculated"
        description="The dashboard leaves unsupported measures blank instead of inventing impact figures."
        tone="sky"
      >
        <ul className={styles.limitations}>
          <li>Volunteer hours and event capacity are not fields in the current schema.</li>
          <li>Employment and CSR are not standalone event categories in the current enum.</li>
          <li>Donation campaigns and member activity status are not currently modelled.</li>
          <li>These operational totals should not be treated as audited public impact claims.</li>
        </ul>
      </AdminPanel>
    </>
  );
}
