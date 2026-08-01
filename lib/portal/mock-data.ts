// Static mock data for the donor portal. In a real build these would come from
// the database and a payment provider; for now they power the dashboard, the
// My Impact page, and the donation history preview.

export interface PortalEvent {
  id: string;
  title: string;
  date: string; // ISO date
  location: string;
  category: "Sport" | "Nutrition" | "Family" | "Community";
  image: string;
}

export interface DonationRecord {
  id: string;
  date: string; // ISO date
  amount: number; // HKD
  type: "one-time" | "recurring";
}

export interface ImpactStat {
  label: string;
  value: string;
  hint: string;
}

export const upcomingEvents: PortalEvent[] = [
  {
    id: "beyond-limits-banquet",
    title: "Beyond Limits Banquet",
    date: "2026-09-12",
    location: "Trium Lab, San Po Kong",
    category: "Community",
    image: "/assets/images/media-beyond.png",
  },
  {
    id: "inclusive-sports-day",
    title: "Inclusive Sports Day",
    date: "2026-08-23",
    location: "Kowloon Bay Sports Ground",
    category: "Sport",
    image: "/assets/images/home-sports.jpg",
  },
  {
    id: "nutrition-workshop",
    title: "Family Nutrition Workshop",
    date: "2026-08-09",
    location: "Love 21 Space",
    category: "Nutrition",
    image: "/assets/images/home-nutrition.jpg",
  },
  {
    id: "family-fun-day",
    title: "Family Fun Day",
    date: "2026-10-04",
    location: "Trium Lab, San Po Kong",
    category: "Family",
    image: "/assets/images/programme-family.jpg",
  },
];

export const impactStats: ImpactStat[] = [
  {
    label: "Total donated",
    value: "HK$4,800",
    hint: "Across 9 gifts since 2024",
  },
  {
    label: "Recurring support",
    value: "HK$200 / mo",
    hint: "Active monthly gift",
  },
  {
    label: "People supported",
    value: "37",
    hint: "Beneficiaries reached by your gifts",
  },
  {
    label: "Programmes funded",
    value: "4",
    hint: "Sport, Nutrition, Family, CSR",
  },
];

export const donationHistory: DonationRecord[] = [
  { id: "d-2026-07", date: "2026-07-01", amount: 200, type: "recurring" },
  { id: "d-2026-06", date: "2026-06-01", amount: 200, type: "recurring" },
  { id: "d-2026-05", date: "2026-05-11", amount: 1000, type: "one-time" },
  { id: "d-2026-04", date: "2026-04-01", amount: 200, type: "recurring" },
  { id: "d-2026-03", date: "2026-03-01", amount: 200, type: "recurring" },
];

export interface MonthlyGift {
  month: string; // short label
  amount: number;
}

// Giving over the last seven months (drives the bar chart).
export const monthlyGiving: MonthlyGift[] = [
  { month: "Jan", amount: 150 },
  { month: "Feb", amount: 200 },
  { month: "Mar", amount: 200 },
  { month: "Apr", amount: 200 },
  { month: "May", amount: 1000 },
  { month: "Jun", amount: 200 },
  { month: "Jul", amount: 200 },
];

export interface ProgrammeShare {
  name: string;
  share: number; // percent of giving, sums to 100
  color: string;
}

// Validated categorical palette (dataviz skill, light mode): blue / orange /
// aqua / yellow. Each bar is direct-labeled, so identity is never colour-alone.
export const programmeShares: ProgrammeShare[] = [
  { name: "Sport", share: 35, color: "#2a78d6" },
  { name: "Nutrition", share: 25, color: "#eb6834" },
  { name: "Family", share: 22, color: "#1baf7a" },
  { name: "CSR", share: 18, color: "#eda100" },
];

export const presetAmounts = [100, 300, 500, 1000] as const;

export const frequencies = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
] as const;

export type Frequency = (typeof frequencies)[number]["value"];

const dateFormatter = new Intl.DateTimeFormat("en-HK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatEventDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0,
  }).format(amount);
}
