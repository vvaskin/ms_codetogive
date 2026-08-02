import type {
  DonationRow,
  EventGuestSignupRow,
  EventParticipationRow,
  EventRow,
  UserRow,
} from "@/lib/supabase/types";

const DAY_MS = 24 * 60 * 60 * 1_000;
const HONG_KONG_OFFSET_MS = 8 * 60 * 60 * 1_000;

export const DASHBOARD_PERIODS = ["7d", "30d", "12w"] as const;
export type DashboardPeriod = (typeof DASHBOARD_PERIODS)[number];

const periodDefinitions: Record<
  DashboardPeriod,
  { label: string; days: number; bucketCount: number }
> = {
  "7d": { label: "7 days", days: 7, bucketCount: 7 },
  "30d": { label: "30 days", days: 30, bucketCount: 10 },
  "12w": { label: "12 weeks", days: 84, bucketCount: 12 },
};

const bucketLabelFormatter = new Intl.DateTimeFormat("en-HK", {
  timeZone: "Asia/Hong_Kong",
  day: "numeric",
  month: "short",
});

type DashboardEventRow = Pick<
  EventRow,
  "id" | "title" | "starts_at" | "status"
>;
type DashboardParticipationRow = Pick<
  EventParticipationRow,
  "event_id" | "user_id" | "status" | "hours_logged"
>;
type DashboardGuestSignupRow = Pick<
  EventGuestSignupRow,
  "event_id" | "status"
>;
type DashboardUserRow = Pick<UserRow, "id" | "name" | "role">;
type DashboardDonationRow = Pick<
  DonationRow,
  "id" | "donor_id" | "amount_cents" | "currency" | "status" | "created_at"
>;

export interface DashboardEventCoverage {
  id: number;
  title: string;
  startsAt: string;
  confirmedVolunteers: number;
}

export interface DashboardEventOperations {
  upcomingNextSevenDays: number;
  nextEvent: DashboardEventCoverage | null;
  eventsWithZeroVolunteerRegistrations: number;
  upcomingCoverage: DashboardEventCoverage[];
  volunteerHoursThisMonth: number;
}

export interface DonationTrendBucket {
  label: string;
  amountCents: number;
  donationCount: number;
}

export interface DonationTrend {
  period: DashboardPeriod;
  periodLabel: string;
  currency: string;
  availableCurrencies: string[];
  totalAmountCents: number;
  completedDonationCount: number;
  averageAmountCents: number | null;
  previousTotalAmountCents: number;
  changeAmountCents: number;
  changePercent: number | null;
  buckets: DonationTrendBucket[];
}

export interface RecentDashboardDonation {
  id: number;
  createdAt: string;
  amountCents: number;
  currency: string;
  donorName: string;
}

export interface AdminOperationalDashboard {
  events: DashboardEventOperations;
  donations: DonationTrend;
  recentDonations: RecentDashboardDonation[];
}

export function parseDashboardPeriod(value: unknown): DashboardPeriod {
  return DASHBOARD_PERIODS.includes(value as DashboardPeriod)
    ? (value as DashboardPeriod)
    : "30d";
}

export function normalizeDashboardCurrency(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : null;
}

export function daysWaiting(value: string, referenceDate: Date) {
  const appliedAt = Date.parse(value);
  if (Number.isNaN(appliedAt)) return null;
  return Math.max(0, Math.floor((referenceDate.getTime() - appliedAt) / DAY_MS));
}

export function buildEventOperations({
  events,
  participations,
  guestSignups,
  users,
  referenceDate,
}: {
  events: DashboardEventRow[];
  participations: DashboardParticipationRow[];
  guestSignups: DashboardGuestSignupRow[];
  users: DashboardUserRow[];
  referenceDate: Date;
}): DashboardEventOperations {
  assertValidDate(referenceDate);
  const now = referenceDate.getTime();
  const sevenDaysFromNow = now + 7 * DAY_MS;
  const roleByUserId = new Map(users.map((user) => [user.id, user.role]));
  const volunteerRegistrationsByEvent = new Map<number, number>();

  for (const participation of participations) {
    if (
      participation.status === "accepted" &&
      roleByUserId.get(participation.user_id) === "contributor"
    ) {
      volunteerRegistrationsByEvent.set(
        participation.event_id,
        (volunteerRegistrationsByEvent.get(participation.event_id) ?? 0) + 1,
      );
    }
  }

  // Guest sign-ups originate from the public "Volunteer at an event" flow,
  // so a registered guest is a defensible volunteer registration here.
  for (const signup of guestSignups) {
    if (signup.status !== "accepted") continue;
    volunteerRegistrationsByEvent.set(
      signup.event_id,
      (volunteerRegistrationsByEvent.get(signup.event_id) ?? 0) + 1,
    );
  }

  const upcomingCoverage = events
    .filter(
      (event) =>
        event.status === "published" &&
        new Date(event.starts_at).getTime() >= now,
    )
    .sort(
      (left, right) =>
        new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime(),
    )
    .map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.starts_at,
      confirmedVolunteers: volunteerRegistrationsByEvent.get(event.id) ?? 0,
    }));

  const monthWindow = hongKongMonthWindow(referenceDate);
  const eventStartById = new Map(
    events.map((event) => [event.id, new Date(event.starts_at).getTime()]),
  );
  const volunteerHoursThisMonth = participations.reduce((total, row) => {
    const eventStart = eventStartById.get(row.event_id);
    const hours = row.hours_logged ?? 0;
    if (
      row.status !== "attended" ||
      roleByUserId.get(row.user_id) !== "contributor" ||
      eventStart === undefined ||
      eventStart < monthWindow.start ||
      eventStart >= monthWindow.end ||
      !Number.isFinite(hours) ||
      hours <= 0
    ) {
      return total;
    }
    return total + hours;
  }, 0);

  return {
    upcomingNextSevenDays: upcomingCoverage.filter(
      (event) => new Date(event.startsAt).getTime() < sevenDaysFromNow,
    ).length,
    nextEvent: upcomingCoverage[0] ?? null,
    eventsWithZeroVolunteerRegistrations: upcomingCoverage.filter(
      (event) => event.confirmedVolunteers === 0,
    ).length,
    upcomingCoverage: upcomingCoverage.slice(0, 5),
    volunteerHoursThisMonth,
  };
}

export function buildDonationTrend({
  donations,
  period,
  requestedCurrency,
  referenceDate,
}: {
  donations: DashboardDonationRow[];
  period: DashboardPeriod;
  requestedCurrency: string | null;
  referenceDate: Date;
}): DonationTrend {
  assertValidDate(referenceDate);
  const definition = periodDefinitions[period];
  const completed = donations.filter((row) => row.status === "completed");
  const availableCurrencies = [
    ...new Set(
      completed.map((row) => normalizeStoredCurrency(row.currency)),
    ),
  ].sort();
  const requested = normalizeDashboardCurrency(requestedCurrency);
  const currency =
    (requested && availableCurrencies.includes(requested) ? requested : null) ??
    (availableCurrencies.includes("HKD") ? "HKD" : availableCurrencies[0]) ??
    requested ??
    "HKD";
  const currentEnd = referenceDate.getTime();
  const periodDuration = definition.days * DAY_MS;
  const currentStart = currentEnd - periodDuration;
  const previousStart = currentStart - periodDuration;
  const selected = completed.filter(
    (row) => normalizeStoredCurrency(row.currency) === currency,
  );
  const current = selected.filter((row) => {
    const createdAt = new Date(row.created_at).getTime();
    return createdAt >= currentStart && createdAt < currentEnd;
  });
  const previous = selected.filter((row) => {
    const createdAt = new Date(row.created_at).getTime();
    return createdAt >= previousStart && createdAt < currentStart;
  });
  const totalAmountCents = sumDonationAmounts(current);
  const previousTotalAmountCents = sumDonationAmounts(previous);
  const bucketDuration = periodDuration / definition.bucketCount;
  const buckets = Array.from({ length: definition.bucketCount }, (_, index) => {
    const start = currentStart + index * bucketDuration;
    const end = index === definition.bucketCount - 1
      ? currentEnd
      : start + bucketDuration;
    const rows = current.filter((row) => {
      const createdAt = new Date(row.created_at).getTime();
      return createdAt >= start && createdAt < end;
    });
    return {
      label: bucketLabelFormatter.format(new Date(start)),
      amountCents: sumDonationAmounts(rows),
      donationCount: rows.length,
    };
  });

  return {
    period,
    periodLabel: definition.label,
    currency,
    availableCurrencies,
    totalAmountCents,
    completedDonationCount: current.length,
    averageAmountCents:
      current.length > 0 ? Math.round(totalAmountCents / current.length) : null,
    previousTotalAmountCents,
    changeAmountCents: totalAmountCents - previousTotalAmountCents,
    changePercent:
      previousTotalAmountCents > 0
        ? Math.round(
            ((totalAmountCents - previousTotalAmountCents) /
              previousTotalAmountCents) *
              1_000,
          ) / 10
        : null,
    buckets,
  };
}

export function buildRecentDonations({
  donations,
  users,
}: {
  donations: DashboardDonationRow[];
  users: DashboardUserRow[];
}): RecentDashboardDonation[] {
  const donorNameById = new Map(users.map((user) => [user.id, user.name]));
  return donations
    .filter((row) => row.status === "completed")
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime(),
    )
    .slice(0, 5)
    .map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      amountCents: row.amount_cents,
      currency: normalizeStoredCurrency(row.currency),
      donorName: donorNameById.get(row.donor_id) ?? "Donor profile unavailable",
    }));
}

function normalizeStoredCurrency(value: string) {
  const normalized = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : "HKD";
}

function sumDonationAmounts(
  rows: ReadonlyArray<Pick<DonationRow, "amount_cents">>,
) {
  return rows.reduce((total, row) => total + row.amount_cents, 0);
}

function hongKongMonthWindow(referenceDate: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "numeric",
  }).formatToParts(referenceDate);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const start = Date.UTC(year, month - 1, 1) - HONG_KONG_OFFSET_MS;
  const end = Date.UTC(year, month, 1) - HONG_KONG_OFFSET_MS;
  return { start, end };
}

function assertValidDate(value: Date) {
  if (Number.isNaN(value.getTime())) {
    throw new Error("The dashboard reference date is invalid.");
  }
}
