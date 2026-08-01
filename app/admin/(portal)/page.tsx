import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AdminMetricCard,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/AdminUI";
import { mediaArticles } from "@/content/site-data";
import { demoVolunteerApplications } from "@/lib/admin/demo-data";
import { formatMoney } from "@/lib/admin/format";
import { getAdminDashboardSummary } from "@/lib/admin/queries";
import styles from "./Dashboard.module.css";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

type AdminDashboardProps = {
  searchParams: Promise<{ view?: string | string[] }>;
};

const legacyPeopleViews: Record<string, string> = {
  member: "/admin/people/members",
  volunteer: "/admin/people/volunteers",
  donor: "/admin/people/donors",
};

const quickActions = [
  {
    href: "/admin/people/applications",
    label: "Review volunteer applications",
    note: "Demonstration workflow",
  },
  { href: "/admin/events#add-event", label: "Add event", note: "Supabase events" },
  {
    href: "/admin/content/news",
    label: "Add news story",
    note: "Repository-managed content",
  },
  {
    href: "/admin/people/members",
    label: "View people database",
    note: "Members, volunteers and donors",
  },
] as const;

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const { view: requestedView } = await searchParams;
  const legacyView = Array.isArray(requestedView) ? requestedView[0] : requestedView;
  if (legacyView && legacyPeopleViews[legacyView]) {
    redirect(legacyPeopleViews[legacyView]);
  }

  const summary = await getAdminDashboardSummary();
  const pendingDemoApplications = demoVolunteerApplications.filter(
    ({ status }) => status === "pending",
  ).length;
  const primaryCompletedTotal =
    summary.donations.completedTotalsByCurrency.find(
      ({ currency }) => currency === "HKD",
    ) ?? summary.donations.completedTotalsByCurrency[0];

  return (
    <>
      <AdminPageHeader
        eyebrow="Operational overview"
        title="Dashboard"
        description="A compact view of people, events, content and recorded impact across Love 21."
      />

      <section className={styles.metricGrid} aria-label="Dashboard summaries">
        <AdminMetricCard
          label="Pending applications"
          value={pendingDemoApplications}
          description="Demonstration records — not live submissions"
          href="/admin/people/applications"
          tone="purple"
          icon="◎"
        />
        <AdminMetricCard
          label="Volunteer accounts"
          value={summary.people.byRole.volunteer}
          description="Real Supabase volunteer accounts"
          href="/admin/people/volunteers"
          tone="teal"
          icon="V"
        />
        <AdminMetricCard
          label="Upcoming events"
          value={summary.events.upcomingPublishedEvents}
          description={`${summary.events.byStatus.draft} draft · ${summary.events.byStatus.published} published`}
          href="/admin/events"
          tone="pink"
          icon="◷"
        />
        <AdminMetricCard
          label="Published stories"
          value={mediaArticles.length}
          description="Repository-managed news and media articles"
          href="/admin/content/news"
          tone="blue"
          icon="N"
        />
        <AdminMetricCard
          label="Donor accounts"
          value={summary.people.byRole.donor}
          description={`${summary.donations.totalDonationRecords} recorded donation ${summary.donations.totalDonationRecords === 1 ? "entry" : "entries"}`}
          href="/admin/people/donors"
          tone="yellow"
          icon="♡"
        />
        <AdminMetricCard
          label="Completed gifts"
          value={
            primaryCompletedTotal
              ? formatMoney(
                  primaryCompletedTotal.amountCents,
                  primaryCompletedTotal.currency,
                )
              : "—"
          }
          description="Completed donation records only; currencies are never combined"
          href="/admin/metrics"
          tone="coral"
          icon="$"
        />
      </section>

      <div className={styles.dashboardColumns}>
        <AdminPanel
          eyebrow="Shortcuts"
          title="Quick actions"
          description="Move directly to the work that needs attention."
        >
          <div className={styles.quickActions}>
            {quickActions.map((action) => (
              <Link href={action.href} key={action.href}>
                <span>
                  <strong>{action.label}</strong>
                  <small>{action.note}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel
          eyebrow="Live records"
          title="Operational status"
          description="Counts below come from the linked Supabase project."
          tone="blush"
        >
          <dl className={styles.statusList}>
            <div>
              <dt><AdminStatusBadge status="registered" label="Registered" /></dt>
              <dd>{summary.participations.byStatus.registered} event registrations</dd>
            </div>
            <div>
              <dt><AdminStatusBadge status="draft" /></dt>
              <dd>{summary.events.byStatus.draft} events waiting to publish</dd>
            </div>
            <div>
              <dt><AdminStatusBadge status="completed" /></dt>
              <dd>{summary.donations.completedDonationRecords} completed gifts recorded</dd>
            </div>
          </dl>
        </AdminPanel>
      </div>
    </>
  );
}
