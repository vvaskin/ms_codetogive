import Link from "next/link";
import { formatDayMonthYear } from "@/lib/format-date";
import { formatCurrency } from "@/lib/portal/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { DonationRow } from "@/lib/supabase/types";
import { ImpactCharts } from "./ImpactCharts";

/**
 * Real-data replacement for the previously-mocked donor impact view. Renders
 * a live summary + history of the caller's own donations, gated by RLS
 * (`donor_id = auth.uid()`), plus an empty state when there are no rows.
 */
export async function ImpactPanel({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = user
    ? await supabase
        .from("donations")
        .select("id, amount_cents, kind, frequency, status, created_at")
        .eq("donor_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] as DonationPreviewRow[] };

  const donations = (rows ?? []) as DonationPreviewRow[];
  const totalCents = donations
    .filter((d) => d.status === "completed" || d.status === "active")
    .reduce((sum, d) => sum + d.amount_cents, 0);
  const activeRecurring = donations.filter(
    (d) => d.kind === "recurring" && d.status === "active",
  );
  const recurringMonthlyCents = activeRecurring.reduce((sum, d) => {
    const per = d.frequency === "monthly" ? 1
      : d.frequency === "quarterly" ? 1 / 3
      : d.frequency === "yearly" ? 1 / 12
      : 0;
    return sum + Math.round(d.amount_cents * per);
  }, 0);

  const stats: Array<{ label: string; value: string; hint: string }> = [
    {
      label: "Total given",
      value: formatCurrency(totalCents / 100),
      hint: "Across every completed gift on your account.",
    },
    {
      label: "Gifts made",
      value: String(donations.length),
      hint: "Every donation you've recorded here.",
    },
    {
      label: "Active recurring",
      value: recurringMonthlyCents
        ? `${formatCurrency(recurringMonthlyCents / 100)} / mo`
        : "None",
      hint: activeRecurring.length
        ? `${activeRecurring.length} active plan${activeRecurring.length === 1 ? "" : "s"}.`
        : "Set up recurring giving to appear here.",
    },
  ];
  const shownStats = variant === "compact" ? stats.slice(0, 2) : stats;
  const shownHistory = variant === "compact" ? donations.slice(0, 3) : donations;

  return (
    <div className={`impact-panel impact-panel-${variant}`}>
      <div className="impact-stats">
        {shownStats.map((stat) => (
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
        {shownHistory.length === 0 ? (
          <p className="impact-empty">
            No donations yet.{" "}
            <Link href="/portal/donate">Make your first gift ➜</Link>
          </p>
        ) : (
          <ul>
            {shownHistory.map((record) => (
              <li key={record.id}>
                <span className="impact-history-date">
                  {formatDayMonthYear(record.created_at.slice(0, 10), "T00:00:00")}
                </span>
                <span className="impact-history-amount">
                  {formatCurrency(record.amount_cents / 100)}
                </span>
                <span className={`impact-history-type type-${record.kind === "recurring" ? "recurring" : "one-time"}`}>
                  {record.kind === "recurring" ? "Recurring" : "One-time"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

type DonationPreviewRow = Pick<
  DonationRow,
  "id" | "amount_cents" | "kind" | "frequency" | "status" | "created_at"
>;
