"use client";

import { useId, useMemo, useState } from "react";
import {
  demoVolunteerApplications,
  type DemoVolunteerApplication,
} from "@/lib/admin/demo-data";
import styles from "./PeopleDirectory.module.css";

type ApplicationStatusFilter = DemoVolunteerApplication["status"] | "all";

const applicationDateFormatter = new Intl.DateTimeFormat("en-HK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("en");
}

function formatApplicationDate(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? "Date unavailable"
    : applicationDateFormatter.format(timestamp);
}

function formatApplicationStatus(status: DemoVolunteerApplication["status"]) {
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

function applicationStatusClass(status: DemoVolunteerApplication["status"]) {
  if (status === "approved") return styles.statusPositive;
  if (status === "rejected") return styles.statusNegative;
  return styles.statusPending;
}

export function ApplicationDirectory({
  applications = demoVolunteerApplications,
}: {
  applications?: DemoVolunteerApplication[];
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
        normalize(application.email).includes(query) ||
        application.interests.some((interest) => normalize(interest).includes(query));
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
            placeholder="Name, email, or interest"
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
                <th scope="col">Interests</th>
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
                    <span className={styles.secondaryText}>{application.email}</span>
                  </td>
                  <td>
                    <ul className={styles.interestList} aria-label="Interests">
                      {application.interests.map((interest) => (
                        <li key={interest}>{interest}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <time dateTime={application.appliedAt}>
                      {formatApplicationDate(application.appliedAt)}
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
                    <details className={styles.applicationDetails}>
                      <summary>Review details</summary>
                      <div className={styles.applicationPanel}>
                        <div className={styles.applicationPanelHeading}>
                          <div>
                            <h3>{application.name}</h3>
                            <a href={`mailto:${application.email}`}>
                              {application.email}
                            </a>
                          </div>
                          <span
                            className={`${styles.status} ${applicationStatusClass(application.status)}`}
                          >
                            {formatApplicationStatus(application.status)}
                          </span>
                        </div>

                        <dl className={styles.applicationGrid}>
                          <div>
                            <dt>Applied</dt>
                            <dd>{formatApplicationDate(application.appliedAt)}</dd>
                          </div>
                          <div>
                            <dt>Availability</dt>
                            <dd>{application.availability}</dd>
                          </div>
                          <div className={styles.wideDetail}>
                            <dt>Interests</dt>
                            <dd>{application.interests.join(", ")}</dd>
                          </div>
                          <div className={styles.wideDetail}>
                            <dt>Motivation</dt>
                            <dd>{application.motivation}</dd>
                          </div>
                          <div className={styles.wideDetail}>
                            <dt>Relevant experience</dt>
                            <dd>{application.experience}</dd>
                          </div>
                        </dl>
                      </div>
                    </details>
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
