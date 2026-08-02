// small static helpers for the contributor portal donation flow; real data
// would come from the database and a payment provider

export const frequencies = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
] as const;

export type Frequency = (typeof frequencies)[number]["value"];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0,
  }).format(amount);
}
