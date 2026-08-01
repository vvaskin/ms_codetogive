import { formatDayMonthYear } from "@/lib/format-date";
import {
  donationHistory,
  formatCurrency,
  impactStats,
} from "@/lib/portal/mock-data";
import { ImpactCharts } from "./ImpactCharts";

export function ImpactPanel({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const stats = variant === "compact" ? impactStats.slice(0, 2) : impactStats;
  const history =
    variant === "compact" ? donationHistory.slice(0, 3) : donationHistory;

  return (
    <div className={`impact-panel impact-panel-${variant}`}>
      <div className="impact-stats">
        {stats.map((stat) => (
          <div className="impact-stat" key={stat.label}>
            <span className="impact-stat-value">{stat.value}</span>
            <span className="impact-stat-label">{stat.label}</span>
            {variant === "full" && (
              <span className="impact-stat-hint">{stat.hint}</span>
            )}
          </div>
        ))}
      </div>

      {variant === "full" && <ImpactCharts />}

      <div className="impact-history">
        <h3>Recent donations</h3>
        <ul>
          {history.map((record) => (
            <li key={record.id}>
              <span className="impact-history-date">
                {formatDayMonthYear(record.date, "T00:00:00")}
              </span>
              <span className="impact-history-amount">
                {formatCurrency(record.amount)}
              </span>
              <span className={`impact-history-type type-${record.type}`}>
                {record.type === "recurring" ? "Recurring" : "One-time"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
