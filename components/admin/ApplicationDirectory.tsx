"use client";

import { useId, useMemo, useState } from "react";
import type { AdminVolunteerApplication } from "@/lib/admin/queries";
import styles from "./PeopleDirectory.module.css";

type ApplicationStatusFilter =
  | Exclude<AdminVolunteerApplication["status"], null>
  | "all";

const applicationDateFormatter = new Intl.DateTimeFormat("en-HK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("en");
}

function formatApplicationDate(value: string | null) {
  if (!value) return "Date unavailable";
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? "Date unavailable"
    : applicationDateFormatter.format(timestamp);
}

function formatApplicationStatus(status: AdminVolunteerApplication["status"]) {
  if (!status) return "No status";
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function applicationStatusClass(status: AdminVolunteerApplication["status"]) {
  if (status === "approved") return styles.statusPositive;
  if (status === "rejected") return styles.statusNegative;
  return styles.statusPending;
}

export function ApplicationDirectory({
  applications,
}: {
  applications: AdminVolunteerApplication[];
}) {
  const searchId = useId();
  const statusId = useId();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatusFilter>("all");

  const filteredApplications = useMemo(() => {
    const query = normalize(search);

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        normalize(application.name).includes(query) ||
        normalize(application.email ?? "").includes(query) ||
        normalize(application.referralSource ?? "").includes(query);
      const matchesStatus = status === "all" || application.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, status]);

  const isFiltered = Boolean(search.trim()) || status !== "all";

  function resetFilters() {
    setSearch("");
    setStatus("all");
  }

  return (
    <section className={styles.directory} aria-labelledby={`${searchId}-heading`}>
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Volunteer review</p>
          <h2 id={`${searchId}-heading`}>Applications</h2>
        </div>
        <p className={styles.recordCount} aria-live="polite">
          {filteredApplications.length === applications.length
            ? `${applications.length} ${applications.length === 1 ? "record" : "records"}`
            : `${filteredApplications.length} of ${applications.length} records`}
        </p>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.searchField} htmlFor={searchId}>
          <span>Search</span>
          <input
            id={searchId}
            type="search"
            value={search}
            placeholder="Name, email, or referral source"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className={styles.filterField} htmlFor={statusId}>
          <span>Status</span>
          <select
            id={statusId}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ApplicationStatusFilter)
            }
          >
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </label>
      </div>

      {filteredApplications.length === 0 ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">⌕</span>
          <h3>No matching applications</h3>
          <p>Try changing the search term or status filter.</p>
          {isFiltered ? (
            <button type="button" onClick={resetFilters}>
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <div
          className={styles.tableRegion}
          role="region"
          aria-label="Volunteer applications"
          tabIndex={0}
        >
          <table>
            <caption className={styles.srOnly}>Volunteer applications</caption>
            <thead>
              <tr>
                <th scope="col">Applicant</th>
                <th scope="col">Applied</th>
                <th scope="col">Status</th>
                <th scope="col">Review</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <strong className={styles.personName}>{application.name}</strong>
                    <span className={styles.secondaryText}>{application.email ?? "Email unavailable"}</span>
                  </td>
                  <td>
                    <time dateTime={application.submittedAt ?? undefined}>
                      {formatApplicationDate(application.submittedAt)}
                    </time>
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${applicationStatusClass(application.status)}`}
                    >
                      {formatApplicationStatus(application.status)}
                    </span>
                  </td>
                  <td>
                    <a
                      className={styles.reviewLink}
                      href={`/admin/people/applications/${application.id}`}
                    >
                      Review details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
