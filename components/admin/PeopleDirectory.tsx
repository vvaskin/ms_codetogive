"use client";

import { useId, useMemo, useState } from "react";
import { deleteUser } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import styles from "./PeopleDirectory.module.css";

export type PeopleDirectoryRole = "member" | "volunteer" | "donor";

export type DirectoryCurrencyTotal = {
  currency: string;
  amountCents: number;
};

type DirectoryRowBase = {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
  status?: string | null;
};

export type ParticipantDirectoryRow = DirectoryRowBase & {
  role: "member" | "volunteer";
  participationCount: number;
};

export type DonorDirectoryRow = DirectoryRowBase & {
  role: "donor";
  donationCount: number;
  donationTotals: DirectoryCurrencyTotal[];
};

export type PeopleDirectoryRow = ParticipantDirectoryRow | DonorDirectoryRow;

type DateFilter = "all" | "30-days" | "year";

const dateFormatter = new Intl.DateTimeFormat("en-HK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const roleLabels: Record<PeopleDirectoryRole, string> = {
  member: "members and families",
  volunteer: "volunteers",
  donor: "donors",
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("en");
}

function formatDate(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? "Date unavailable" : dateFormatter.format(timestamp);
}

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(value: string) {
  const normalized = normalize(value);

  if (["active", "approved", "published", "completed"].includes(normalized)) {
    return styles.statusPositive;
  }
  if (["pending", "registered", "draft"].includes(normalized)) {
    return styles.statusPending;
  }
  if (["inactive", "rejected", "cancelled", "no show", "no_show"].includes(normalized)) {
    return styles.statusNegative;
  }
  return styles.statusNeutral;
}

function matchesDate(createdAt: string, filter: DateFilter, referenceTime: number) {
  if (filter === "all") return true;

  const createdTime = Date.parse(createdAt);
  if (Number.isNaN(createdTime)) return false;

  if (filter === "30-days") {
    return createdTime >= referenceTime - 30 * 24 * 60 * 60 * 1_000;
  }

  return new Date(createdTime).getFullYear() === new Date(referenceTime).getFullYear();
}

function currencyAmount({ currency, amountCents }: DirectoryCurrencyTotal) {
  try {
    return new Intl.NumberFormat("en-HK", {
      style: "currency",
      currency: currency.toUpperCase(),
      currencyDisplay: "narrowSymbol",
    }).format(amountCents / 100);
  } catch {
    return `${currency.toUpperCase()} ${(amountCents / 100).toLocaleString("en-HK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function plural(count: number, singular: string, pluralValue = `${singular}s`) {
  return `${count.toLocaleString("en-HK")} ${count === 1 ? singular : pluralValue}`;
}

function DonationTotals({ totals }: { totals: DirectoryCurrencyTotal[] }) {
  if (totals.length === 0) return <span className={styles.muted}>No donations</span>;

  return (
    <ul className={styles.currencyList} aria-label="Donation totals by currency">
      {totals.map((total) => (
        <li key={total.currency}>{currencyAmount(total)}</li>
      ))}
    </ul>
  );
}

function ActivitySummary({ row }: { row: PeopleDirectoryRow }) {
  if (row.role === "donor") {
    return (
      <>
        <span>{plural(row.donationCount, "donation")}</span>
        <DonationTotals totals={row.donationTotals} />
      </>
    );
  }

  return <span>{plural(row.participationCount, "event registration")}</span>;
}

export function PeopleDirectory({
  rows,
  role,
}: {
  rows: PeopleDirectoryRow[];
  role: PeopleDirectoryRole;
}) {
  const searchId = useId();
  const dateId = useId();
  const statusId = useId();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [referenceTime] = useState(() => Date.now());

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          rows.flatMap((row) => (row.status ? [row.status] : [])),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = normalize(search);

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        normalize(row.name).includes(query) ||
        normalize(row.email ?? "").includes(query);
      const matchesStatus =
        selectedStatus === "all" || row.status === selectedStatus;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate(row.createdAt, dateFilter, referenceTime)
      );
    });
  }, [dateFilter, referenceTime, rows, search, selectedStatus]);

  const isFiltered =
    Boolean(search.trim()) || dateFilter !== "all" || selectedStatus !== "all";
  const roleLabel = roleLabels[role];

  function resetFilters() {
    setSearch("");
    setDateFilter("all");
    setSelectedStatus("all");
  }

  return (
    <section className={styles.directory} aria-labelledby={`${searchId}-heading`}>
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Account directory</p>
          <h2 id={`${searchId}-heading`}>{formatStatus(roleLabel)}</h2>
        </div>
        <p className={styles.recordCount} aria-live="polite">
          {filteredRows.length === rows.length
            ? plural(rows.length, "record")
            : `${filteredRows.length.toLocaleString("en-HK")} of ${plural(rows.length, "record")}`}
        </p>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.searchField} htmlFor={searchId}>
          <span>Search</span>
          <input
            id={searchId}
            type="search"
            value={search}
            placeholder="Name or email"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className={styles.filterField} htmlFor={dateId}>
          <span>Joined</span>
          <select
            id={dateId}
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value as DateFilter)}
          >
            <option value="all">Any date</option>
            <option value="30-days">Last 30 days</option>
            <option value="year">This year</option>
          </select>
        </label>

        {statusOptions.length > 0 ? (
          <label className={styles.filterField} htmlFor={statusId}>
            <span>Status</span>
            <select
              id={statusId}
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {filteredRows.length === 0 ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">⌕</span>
          <h3>{rows.length === 0 ? `No ${roleLabel} yet` : "No matching records"}</h3>
          <p>
            {rows.length === 0
              ? "Records will appear here when accounts are available."
              : "Try changing the search term or filters."}
          </p>
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
          aria-label={`${formatStatus(roleLabel)} account records`}
          tabIndex={0}
        >
          <table>
            <caption className={styles.srOnly}>
              {formatStatus(roleLabel)} account records
            </caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Joined</th>
                {statusOptions.length > 0 ? <th scope="col">Status</th> : null}
                {role === "donor" ? (
                  <>
                    <th scope="col">Donations</th>
                    <th scope="col">Total</th>
                  </>
                ) : (
                  <th scope="col">Participation</th>
                )}
                <th scope="col">Details</th>
                <th scope="col">
                  <span className={styles.srOnly}>More actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong className={styles.personName}>{row.name}</strong>
                  </td>
                  <td className={styles.emailCell}>{row.email ?? "Unavailable"}</td>
                  <td>
                    <time dateTime={row.createdAt}>{formatDate(row.createdAt)}</time>
                  </td>
                  {statusOptions.length > 0 ? (
                    <td>
                      {row.status ? (
                        <span className={`${styles.status} ${statusClass(row.status)}`}>
                          {formatStatus(row.status)}
                        </span>
                      ) : (
                        <span className={styles.muted}>Not set</span>
                      )}
                    </td>
                  ) : null}
                  {row.role === "donor" ? (
                    <>
                      <td>{row.donationCount.toLocaleString("en-HK")}</td>
                      <td><DonationTotals totals={row.donationTotals} /></td>
                    </>
                  ) : (
                    <td>{row.participationCount.toLocaleString("en-HK")}</td>
                  )}
                  <td>
                    <details className={styles.viewDetails}>
                      <summary>View</summary>
                      <div className={styles.detailPanel}>
                        <strong>{row.name}</strong>
                        <dl>
                          <div>
                            <dt>Email</dt>
                            <dd>{row.email ?? "Unavailable"}</dd>
                          </div>
                          <div>
                            <dt>Joined</dt>
                            <dd>{formatDate(row.createdAt)}</dd>
                          </div>
                          {row.status ? (
                            <div>
                              <dt>Status</dt>
                              <dd>{formatStatus(row.status)}</dd>
                            </div>
                          ) : null}
                          <div>
                            <dt>Activity</dt>
                            <dd className={styles.activitySummary}>
                              <ActivitySummary row={row} />
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </details>
                  </td>
                  <td className={styles.actionCell}>
                    <details className={styles.overflowDetails}>
                      <summary aria-label={`More actions for ${row.name}`}>
                        <span aria-hidden="true">•••</span>
                      </summary>
                      <div className={styles.overflowMenu}>
                        <form action={deleteUser}>
                          <input type="hidden" name="id" value={row.id} />
                          <input type="hidden" name="currentView" value={role} />
                          <ConfirmSubmitButton
                            className={styles.deleteAction}
                            message={`Delete ${row.name}'s account? This cannot be undone.`}
                          >
                            Delete account
                          </ConfirmSubmitButton>
                        </form>
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
