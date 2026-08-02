import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateVolunteerApplicationStatus } from "@/app/admin/applications/actions";
import { AdminStatusBadge } from "@/components/admin/AdminUI";
import {
  getVolunteerApplicationById,
  type AdminVolunteerApplication,
} from "@/lib/admin/queries";
import styles from "./ApplicationReview.module.css";

type ApplicationReviewProps = { params: Promise<{ id: string }> };

const applicationStatuses: NonNullable<AdminVolunteerApplication["status"]>[] = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "withdrawn",
];

function statusBadge(status: AdminVolunteerApplication["status"]) {
  switch (status) {
    case "approved":
      return <AdminStatusBadge status="approved" label="Approved" />;
    case "rejected":
      return <AdminStatusBadge status="rejected" label="Rejected" />;
    default:
      return <AdminStatusBadge status="pending" label={status?.replaceAll("_", " ") ?? "No status"} />;
  }
}

function formatDate(value: string | null) {
  if (!value) return "Not yet";
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? "Unavailable"
    : new Intl.DateTimeFormat("en-HK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(timestamp);
}

export async function generateMetadata({
  params,
}: ApplicationReviewProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Application ${id}` };
}

export default async function ApplicationReviewPage({
  params,
}: ApplicationReviewProps) {
  const { id: rawId } = await params;
  // route params are untrusted; a malformed id is a 404, not a 500
  const applicationId = Number(rawId);
  if (!Number.isSafeInteger(applicationId) || applicationId < 1) notFound();

  const application = await getVolunteerApplicationById(applicationId);
  if (!application) notFound();

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderCopy}>
          <p className={styles.eyebrow}>Volunteer review</p>
          <h1>{application.name}</h1>
          <p>
            {application.email ? (
              <a href={`mailto:${application.email}`}>{application.email}</a>
            ) : (
              "Email unavailable"
            )}
          </p>
        </div>
        <Link className={styles.backLink} href="/admin/people/applications">
          ← Back to applications
        </Link>
      </header>

      <dl className={styles.summary}>
        <div className={styles.summaryCard}>
          <dt>Status</dt>
          <dd>{statusBadge(application.status)}</dd>
        </div>
        <div className={styles.summaryCard}>
          <dt>Applied</dt>
          <dd>{formatDate(application.submittedAt)}</dd>
        </div>
        <div className={styles.summaryCard}>
          <dt>Reviewed</dt>
          <dd>{formatDate(application.reviewedAt)}</dd>
        </div>
      </dl>

      <section className={styles.panel} aria-label="Application details">
        <div className={styles.panelHeader}>
          <h2>Application details</h2>
        </div>
        <div className={styles.panelBody}>
          <dl className={styles.details}>
            <div>
              <dt>Applicant</dt>
              <dd>{application.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                {application.email ? (
                  <a href={`mailto:${application.email}`}>{application.email}</a>
                ) : (
                  "Email unavailable"
                )}
              </dd>
            </div>
            <div>
              <dt>Age group</dt>
              <dd>{application.ageGroup ?? "Not provided"}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{application.gender ?? "Not provided"}</dd>
            </div>
            <div>
              <dt>Referral source</dt>
              <dd>{application.referralSource ?? "Not provided"}</dd>
            </div>
            <div>
              <dt>Applied</dt>
              <dd>{formatDate(application.submittedAt)}</dd>
            </div>
            <div>
              <dt>Reviewed</dt>
              <dd>{formatDate(application.reviewedAt)}</dd>
            </div>
            <div>
              <dt>Application id</dt>
              <dd>#{application.id}</dd>
            </div>
            <div className={styles.wide}>
              <dt>Bio</dt>
              <dd className={styles.body}>{application.bio || "No bio provided."}</dd>
            </div>
            {application.rejectionReason ? (
              <div className={styles.wide}>
                <dt>Rejection reason</dt>
                <dd>
                  {application.rejectionReason}
                  {application.rejectionReasonVisible
                    ? ""
                    : " (hidden from applicant)"}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <section className={styles.panel} aria-label="Update application status">
        <div className={styles.panelHeader}>
          <h2>Update status</h2>
        </div>
        <div className={styles.panelBody}>
          <form className={styles.statusForm} action={updateVolunteerApplicationStatus}>
            <input type="hidden" name="id" value={application.id} />
            <label className={styles.statusField}>
              <span>Status</span>
              <select name="status" defaultValue={application.status ?? "submitted"}>
                {applicationStatuses.map((status) => (
                  <option value={status} key={status}>
                    {status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.reasonField}>
              <span>Rejection reason</span>
              <input
                name="rejectionReason"
                type="text"
                placeholder="Required when rejecting"
                defaultValue={application.rejectionReason ?? ""}
              />
            </label>
            <button className={styles.statusSave} type="submit">
              Update status
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
