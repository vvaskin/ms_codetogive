import Link from "next/link";
import {
  DASHBOARD_PERIODS,
  type DonationTrend,
} from "@/lib/admin/dashboard";
import { formatMoney } from "@/lib/admin/format";
import styles from "./DonationTrendCard.module.css";

const periodLabels = {
  "7d": "7 days",
  "30d": "30 days",
  "12w": "12 weeks",
} as const;

export function DonationTrendCard({ trend }: { trend: DonationTrend }) {
  // floor of 1 keeps the bar-height math safe when every bucket is empty
  const maximumBucketAmount = Math.max(
    ...trend.buckets.map((bucket) => bucket.amountCents),
    1,
  );
  const direction = trend.changeAmountCents >= 0 ? "up" : "down";
  const signedChange = `${trend.changeAmountCents >= 0 ? "+" : "−"}${formatMoney(
    Math.abs(trend.changeAmountCents),
    trend.currency,
  )}`;

  return (
    <section className={styles.card} aria-labelledby="donation-trend-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Completed gifts</p>
          <h2 id="donation-trend-title">Donation trend</h2>
        </div>

        {/* period/currency live in the query string rather than local state —
            this card is server-rendered, so a full navigation is how the data
            refreshes, and filters stay shareable via URL */}
        <div className={styles.filters}>
          {trend.availableCurrencies.length > 1 ? (
            <nav aria-label="Donation currency" className={styles.filterGroup}>
              {trend.availableCurrencies.map((currency) => (
                <Link
                  aria-current={currency === trend.currency ? "page" : undefined}
                  href={`/admin?period=${trend.period}&currency=${currency}`}
                  key={currency}
                >
                  {currency}
                </Link>
              ))}
            </nav>
          ) : null}
          <nav aria-label="Donation trend period" className={styles.filterGroup}>
            {DASHBOARD_PERIODS.map((period) => (
              <Link
                aria-current={period === trend.period ? "page" : undefined}
                href={`/admin?period=${period}&currency=${trend.currency}`}
                key={period}
              >
                {periodLabels[period]}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.summary}>
          <span className={styles.summaryLabel}>{trend.periodLabel} total</span>
          <strong>{formatMoney(trend.totalAmountCents, trend.currency)}</strong>
          <span>{trend.completedDonationCount} completed {trend.completedDonationCount === 1 ? "gift" : "gifts"}</span>
          {trend.changePercent !== null ? (
            <span className={styles.comparison}>
              {signedChange} ({Math.abs(trend.changePercent)}% {direction}) vs previous {trend.periodLabel}
            </span>
          ) : null}
        </div>

        {trend.completedDonationCount === 0 ? (
          <div className={styles.emptyState}>
            <span aria-hidden="true">○</span>
            <div>
              <strong>No completed {trend.currency} donations</strong>
              <p>No completed gifts were recorded during the selected {trend.periodLabel.toLowerCase()}.</p>
            </div>
          </div>
        ) : (
          <figure className={styles.figure}>
            <figcaption className={styles.srOnly}>
              Completed {trend.currency} donation totals over the last {trend.periodLabel}.
            </figcaption>
            <ol className={styles.chart}>
              {trend.buckets.map((bucket, index) => {
                const height = bucket.amountCents === 0
                  ? 0
                  : Math.max(6, (bucket.amountCents / maximumBucketAmount) * 100);
                const value = formatMoney(bucket.amountCents, trend.currency);
                return (
                  <li
                    aria-label={`${bucket.label}: ${value} from ${bucket.donationCount} completed ${bucket.donationCount === 1 ? "gift" : "gifts"}`}
                    key={`${bucket.label}-${index}`}
                  >
                    <span className={styles.barTrack} aria-hidden="true">
                      <span className={styles.bar} style={{ height: `${height}%` }} />
                    </span>
                    <span className={styles.bucketLabel}>{bucket.label}</span>
                    <span className={styles.srOnly}>{value}</span>
                  </li>
                );
              })}
            </ol>
          </figure>
        )}
      </div>
    </section>
  );
}
