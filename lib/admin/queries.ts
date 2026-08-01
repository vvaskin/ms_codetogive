import "server-only";

import { redirect } from "next/navigation";
import {
  createAdminClient,
  getAdminAuthState,
} from "@/lib/supabase/admin";
import type {
  DonationRow,
  DonationStatus,
  EventParticipationRow,
  EventRow,
  EventStatus,
  EventType,
  ParticipationStatus,
  UserRole,
  UserRow,
} from "@/lib/supabase/types";

const USER_ROLES = ["member", "donor", "volunteer", "staff"] as const satisfies
  readonly UserRole[];
const EVENT_STATUSES = ["draft", "published", "cancelled"] as const satisfies
  readonly EventStatus[];
const PARTICIPATION_STATUSES = [
  "registered",
  "attended",
  "no_show",
  "cancelled",
] as const satisfies readonly ParticipationStatus[];
const DONATION_STATUSES = [
  "completed",
  "active",
  "paused",
  "cancelled",
] as const satisfies readonly DonationStatus[];
const EVENT_TYPES = ["sport", "nutrition", "family_support"] as const satisfies
  readonly EventType[];

export const PEOPLE_DIRECTORY_ROLES = [
  "member",
  "volunteer",
  "donor",
] as const;

export type PeopleDirectoryRole = (typeof PEOPLE_DIRECTORY_ROLES)[number];
export type RoleCounts = Record<UserRole, number>;
export type EventStatusCounts = Record<EventStatus, number>;
export type ParticipationStatusCounts = Record<ParticipationStatus, number>;
export type DonationStatusCounts = Record<DonationStatus, number>;
export type EventTypeCounts = Record<EventType, number>;

export interface CurrencyTotal {
  currency: string;
  donationCount: number;
  amountCents: number;
}

export interface AdminDashboardSummary {
  people: {
    totalAccounts: number;
    byRole: RoleCounts;
  };
  events: {
    totalEvents: number;
    upcomingPublishedEvents: number;
    byStatus: EventStatusCounts;
  };
  participations: {
    totalParticipations: number;
    byStatus: ParticipationStatusCounts;
  };
  donations: {
    totalDonationRecords: number;
    completedDonationRecords: number;
    byStatus: DonationStatusCounts;
    completedTotalsByCurrency: CurrencyTotal[];
  };
}

export type AdminPersonProfile = Pick<
  UserRow,
  | "id"
  | "email"
  | "name"
  | "phone_number"
  | "address"
  | "role"
  | "profile_image"
  | "created_at"
  | "updated_at"
>;

export interface AdminPersonDirectoryRecord {
  profile: AdminPersonProfile;
  participationCount: number;
  participationsByStatus: ParticipationStatusCounts;
  donationCount: number;
  completedDonationTotalsByCurrency: CurrencyTotal[];
}

export interface AdminPeopleDirectory {
  role: PeopleDirectoryRole;
  recordCount: number;
  records: AdminPersonDirectoryRecord[];
}

export interface AdminEventListItem {
  event: EventRow;
  participationCount: number;
  registeredCount: number;
  participationsByStatus: ParticipationStatusCounts;
}

export type AdminEventParticipantProfile = Pick<
  UserRow,
  | "id"
  | "email"
  | "name"
  | "phone_number"
  | "role"
  | "profile_image"
  | "created_at"
>;

export type AdminEventParticipation = Pick<
  EventParticipationRow,
  | "id"
  | "user_id"
  | "event_id"
  | "status"
  | "certificate_path"
  | "created_at"
  | "updated_at"
>;

export interface AdminEventParticipant {
  participation: AdminEventParticipation;
  profile: AdminEventParticipantProfile | null;
}

export interface AdminEventDetail {
  event: EventRow;
  participantCount: number;
  registeredCount: number;
  participationsByStatus: ParticipationStatusCounts;
  participants: AdminEventParticipant[];
}

export interface AdminImpactMetrics {
  accounts: {
    totalAccounts: number;
    byRole: RoleCounts;
  };
  programmes: {
    totalEventRecords: number;
    publishedEventRecords: number;
    upcomingPublishedEvents: number;
    eventsByType: EventTypeCounts;
    publishedEventsByType: EventTypeCounts;
    uncategorizedEvents: number;
  };
  participation: {
    totalRecords: number;
    byStatus: ParticipationStatusCounts;
    volunteerParticipationRecords: number;
    volunteerAttendances: number;
    attendancesByEventType: EventTypeCounts;
    uncategorizedAttendances: number;
  };
  donations: {
    totalRecords: number;
    accountsWithDonationRecords: number;
    accountsWithMultipleDonationRecords: number;
    activeRecurringRecords: number;
    eventEarmarkedRecords: number;
    byStatus: DonationStatusCounts;
    completedTotalsByCurrency: CurrencyTotal[];
  };
}

type DonationAggregateRow = Pick<
  DonationRow,
  "donor_id" | "event_id" | "kind" | "amount_cents" | "currency" | "status"
>;
type ParticipationAggregateRow = Pick<
  EventParticipationRow,
  "event_id" | "user_id" | "status"
>;

const ADMIN_QUERY_PAGE_SIZE = 1_000;
const ADMIN_ID_CHUNK_SIZE = 100;

type AdminQueryPage<T> = PromiseLike<{
  data: T[] | null;
  error: { message: string } | null;
}>;

async function loadAllRows<T>(
  context: string,
  loadPage: (from: number, to: number) => AdminQueryPage<T>,
) {
  const rows: T[] = [];

  for (let from = 0; ; from += ADMIN_QUERY_PAGE_SIZE) {
    const { data, error } = await loadPage(
      from,
      from + ADMIN_QUERY_PAGE_SIZE - 1,
    );
    if (error) throw actionableError(context, error.message);

    const page = data ?? [];
    rows.push(...page);
    if (page.length < ADMIN_QUERY_PAGE_SIZE) return rows;
  }
}

async function loadRowsForUserIds<T>(
  userIds: string[],
  context: string,
  loadPage: (
    userIdChunk: string[],
    from: number,
    to: number,
  ) => AdminQueryPage<T>,
) {
  const rows: T[] = [];

  for (let index = 0; index < userIds.length; index += ADMIN_ID_CHUNK_SIZE) {
    const userIdChunk = userIds.slice(index, index + ADMIN_ID_CHUNK_SIZE);
    rows.push(
      ...(await loadAllRows(context, (from, to) =>
        loadPage(userIdChunk, from, to),
      )),
    );
  }

  return rows;
}

function emptyRoleCounts(): RoleCounts {
  return { member: 0, donor: 0, volunteer: 0, staff: 0 };
}

function emptyEventStatusCounts(): EventStatusCounts {
  return { draft: 0, published: 0, cancelled: 0 };
}

function emptyParticipationStatusCounts(): ParticipationStatusCounts {
  return { registered: 0, attended: 0, no_show: 0, cancelled: 0 };
}

function emptyDonationStatusCounts(): DonationStatusCounts {
  return { completed: 0, active: 0, paused: 0, cancelled: 0 };
}

function emptyEventTypeCounts(): EventTypeCounts {
  return { sport: 0, nutrition: 0, family_support: 0 };
}

function countRoles(rows: ReadonlyArray<Pick<UserRow, "role">>): RoleCounts {
  const counts = emptyRoleCounts();
  for (const row of rows) counts[row.role] += 1;
  return counts;
}

function countEventStatuses(
  rows: ReadonlyArray<Pick<EventRow, "status">>,
): EventStatusCounts {
  const counts = emptyEventStatusCounts();
  for (const row of rows) counts[row.status] += 1;
  return counts;
}

function countParticipationStatuses(
  rows: ReadonlyArray<Pick<EventParticipationRow, "status">>,
): ParticipationStatusCounts {
  const counts = emptyParticipationStatusCounts();
  for (const row of rows) counts[row.status] += 1;
  return counts;
}

function countDonationStatuses(
  rows: ReadonlyArray<Pick<DonationRow, "status">>,
): DonationStatusCounts {
  const counts = emptyDonationStatusCounts();
  for (const row of rows) counts[row.status] += 1;
  return counts;
}

function completedCurrencyTotals(
  rows: ReadonlyArray<Pick<DonationRow, "amount_cents" | "currency" | "status">>,
): CurrencyTotal[] {
  const totals = new Map<string, CurrencyTotal>();

  for (const row of rows) {
    if (row.status !== "completed") continue;

    // Never combine amounts from different currencies. Normalizing casing also
    // prevents separate HKD/hkd buckets without converting either value.
    const currency = row.currency.trim().toUpperCase() || "UNKNOWN";
    const existing = totals.get(currency);
    if (existing) {
      existing.donationCount += 1;
      existing.amountCents += row.amount_cents;
    } else {
      totals.set(currency, {
        currency,
        donationCount: 1,
        amountCents: row.amount_cents,
      });
    }
  }

  return [...totals.values()].sort((left, right) =>
    left.currency.localeCompare(right.currency),
  );
}

function actionableError(context: string, message: string) {
  return new Error(`${context} Check the linked Supabase schema and service-role configuration. ${message}`);
}

function assertValidDate(referenceDate: Date) {
  if (Number.isNaN(referenceDate.getTime())) {
    throw new Error("The admin metrics reference date is invalid.");
  }
}

function assertValidEventId(eventId: number) {
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    throw new Error("A positive integer event id is required.");
  }
}

async function staffAdminClient() {
  const { user, isStaff } = await getAdminAuthState();
  if (!user || !isStaff) {
    redirect("/admin/login");
  }
  return createAdminClient();
}

export function isPeopleDirectoryRole(value: unknown): value is PeopleDirectoryRole {
  return (
    typeof value === "string" &&
    PEOPLE_DIRECTORY_ROLES.some((role) => role === value)
  );
}

export async function getAdminDashboardSummary(
  referenceDate: Date = new Date(),
): Promise<AdminDashboardSummary> {
  assertValidDate(referenceDate);
  const admin = await staffAdminClient();

  const [users, events, participations, donations] = await Promise.all([
    loadAllRows<Pick<UserRow, "role">>(
      "Unable to load dashboard account totals.",
      (from, to) =>
        admin.from("users").select("role").order("id").range(from, to),
    ),
    loadAllRows<Pick<EventRow, "status" | "starts_at">>(
      "Unable to load dashboard event totals.",
      (from, to) =>
        admin
          .from("events")
          .select("status, starts_at")
          .order("id")
          .range(from, to),
    ),
    loadAllRows<Pick<EventParticipationRow, "status">>(
      "Unable to load dashboard participation totals.",
      (from, to) =>
        admin
          .from("event_participations")
          .select("status")
          .order("id")
          .range(from, to),
    ),
    loadAllRows<Pick<DonationRow, "status" | "amount_cents" | "currency">>(
      "Unable to load dashboard donation totals.",
      (from, to) =>
        admin
          .from("donations")
          .select("status, amount_cents, currency")
          .order("id")
          .range(from, to),
    ),
  ]);
  const eventStatuses = countEventStatuses(events);
  const donationStatuses = countDonationStatuses(donations);
  const now = referenceDate.getTime();

  return {
    people: {
      totalAccounts: users.length,
      byRole: countRoles(users),
    },
    events: {
      totalEvents: events.length,
      upcomingPublishedEvents: events.filter(
        (event) =>
          event.status === "published" &&
          new Date(event.starts_at).getTime() >= now,
      ).length,
      byStatus: eventStatuses,
    },
    participations: {
      totalParticipations: participations.length,
      byStatus: countParticipationStatuses(participations),
    },
    donations: {
      totalDonationRecords: donations.length,
      completedDonationRecords: donationStatuses.completed,
      byStatus: donationStatuses,
      completedTotalsByCurrency: completedCurrencyTotals(donations),
    },
  };
}

export async function getPeopleDirectory(
  role: PeopleDirectoryRole,
): Promise<AdminPeopleDirectory> {
  if (!isPeopleDirectoryRole(role)) {
    throw new Error("A valid people-directory role is required.");
  }

  const admin = await staffAdminClient();
  const people = await loadAllRows<AdminPersonProfile>(
    `Unable to load the ${role} directory.`,
    (from, to) =>
      admin
        .from("users")
        .select(
          "id, email, name, phone_number, address, role, profile_image, created_at, updated_at",
        )
        .eq("role", role)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(from, to),
  );
  const userIds = people.map((person) => person.id);
  let participations: ParticipationAggregateRow[] = [];
  let donations: DonationAggregateRow[] = [];

  if (userIds.length > 0 && role !== "donor") {
    participations = await loadRowsForUserIds<ParticipationAggregateRow>(
      userIds,
      `Unable to load participation totals for ${role} accounts.`,
      (userIdChunk, from, to) =>
        admin
          .from("event_participations")
          .select("user_id, event_id, status")
          .in("user_id", userIdChunk)
          .order("id")
          .range(from, to),
    );
  }

  if (userIds.length > 0 && role === "donor") {
    donations = await loadRowsForUserIds<DonationAggregateRow>(
      userIds,
      "Unable to load donation totals for donor accounts.",
      (userIdChunk, from, to) =>
        admin
          .from("donations")
          .select("donor_id, event_id, kind, amount_cents, currency, status")
          .in("donor_id", userIdChunk)
          .order("id")
          .range(from, to),
    );
  }

  const participationsByUser = new Map<string, ParticipationAggregateRow[]>();
  for (const participation of participations) {
    const rows = participationsByUser.get(participation.user_id) ?? [];
    rows.push(participation);
    participationsByUser.set(participation.user_id, rows);
  }

  const donationsByUser = new Map<string, DonationAggregateRow[]>();
  for (const donation of donations) {
    const rows = donationsByUser.get(donation.donor_id) ?? [];
    rows.push(donation);
    donationsByUser.set(donation.donor_id, rows);
  }

  const records = people.map((profile) => {
    const personParticipations = participationsByUser.get(profile.id) ?? [];
    const personDonations = donationsByUser.get(profile.id) ?? [];

    return {
      profile,
      participationCount: personParticipations.length,
      participationsByStatus: countParticipationStatuses(personParticipations),
      donationCount: personDonations.length,
      completedDonationTotalsByCurrency: completedCurrencyTotals(personDonations),
    } satisfies AdminPersonDirectoryRecord;
  });

  return { role, recordCount: records.length, records };
}

export async function getAdminEventList(): Promise<AdminEventListItem[]> {
  const admin = await staffAdminClient();
  const [events, participations] = await Promise.all([
    loadAllRows<EventRow>("Unable to load the admin event list.", (from, to) =>
      admin
        .from("events")
        .select("*")
        .order("starts_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to),
    ),
    loadAllRows<ParticipationAggregateRow>(
      "Unable to load event participation totals.",
      (from, to) =>
        admin
          .from("event_participations")
          .select("event_id, user_id, status")
          .order("id")
          .range(from, to),
    ),
  ]);

  const participationsByEvent = new Map<number, ParticipationAggregateRow[]>();
  for (const participation of participations) {
    const rows = participationsByEvent.get(participation.event_id) ?? [];
    rows.push(participation);
    participationsByEvent.set(participation.event_id, rows);
  }

  return events.map((event) => {
    const participations = participationsByEvent.get(event.id) ?? [];
    const statusCounts = countParticipationStatuses(participations);
    return {
      event,
      participationCount: participations.length,
      registeredCount: statusCounts.registered,
      participationsByStatus: statusCounts,
    };
  });
}

export async function getAdminEventDetail(
  eventId: number,
): Promise<AdminEventDetail | null> {
  assertValidEventId(eventId);
  const admin = await staffAdminClient();
  const { data: event, error: eventError } = await admin
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    throw actionableError(
      `Unable to load event ${eventId}.`,
      eventError.message,
    );
  }
  if (!event) return null;

  const participationRows = await loadAllRows<AdminEventParticipation>(
    `Unable to load participants for event ${eventId}.`,
    (from, to) =>
      admin
        .from("event_participations")
        .select(
          "id, user_id, event_id, status, certificate_path, created_at, updated_at",
        )
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(from, to),
  );
  const userIds = [...new Set(participationRows.map((row) => row.user_id))];
  let profiles: AdminEventParticipantProfile[] = [];

  if (userIds.length > 0) {
    profiles = await loadRowsForUserIds<AdminEventParticipantProfile>(
      userIds,
      `Unable to load participant profiles for event ${eventId}.`,
      (userIdChunk, from, to) =>
        admin
          .from("users")
          .select("id, email, name, phone_number, role, profile_image, created_at")
          .in("id", userIdChunk)
          .order("id")
          .range(from, to),
    );
  }

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const statusCounts = countParticipationStatuses(participationRows);

  return {
    event,
    participantCount: participationRows.length,
    registeredCount: statusCounts.registered,
    participationsByStatus: statusCounts,
    participants: participationRows.map((participation) => ({
      participation,
      profile: profilesById.get(participation.user_id) ?? null,
    })),
  };
}

export async function getAdminImpactMetrics(
  referenceDate: Date = new Date(),
): Promise<AdminImpactMetrics> {
  assertValidDate(referenceDate);
  const admin = await staffAdminClient();
  const [users, events, participations, donations] = await Promise.all([
    loadAllRows<Pick<UserRow, "id" | "role">>(
      "Unable to load impact account metrics.",
      (from, to) =>
        admin.from("users").select("id, role").order("id").range(from, to),
    ),
    loadAllRows<Pick<EventRow, "id" | "type" | "status" | "starts_at">>(
      "Unable to load impact event metrics.",
      (from, to) =>
        admin
          .from("events")
          .select("id, type, status, starts_at")
          .order("id")
          .range(from, to),
    ),
    loadAllRows<ParticipationAggregateRow>(
      "Unable to load impact participation metrics.",
      (from, to) =>
        admin
          .from("event_participations")
          .select("event_id, user_id, status")
          .order("id")
          .range(from, to),
    ),
    loadAllRows<DonationAggregateRow>(
      "Unable to load impact donation metrics.",
      (from, to) =>
        admin
          .from("donations")
          .select("donor_id, event_id, kind, amount_cents, currency, status")
          .order("id")
          .range(from, to),
    ),
  ]);
  const userRoleById = new Map(users.map((user) => [user.id, user.role]));
  const eventTypeById = new Map(events.map((event) => [event.id, event.type]));
  const eventsByType = emptyEventTypeCounts();
  const publishedEventsByType = emptyEventTypeCounts();
  const attendancesByEventType = emptyEventTypeCounts();
  let uncategorizedEvents = 0;
  let uncategorizedAttendances = 0;

  for (const event of events) {
    if (event.type) {
      eventsByType[event.type] += 1;
      if (event.status === "published") publishedEventsByType[event.type] += 1;
    } else {
      uncategorizedEvents += 1;
    }
  }

  for (const participation of participations) {
    if (participation.status !== "attended") continue;
    const eventType = eventTypeById.get(participation.event_id);
    if (eventType) attendancesByEventType[eventType] += 1;
    else uncategorizedAttendances += 1;
  }

  const donationsPerDonor = new Map<string, number>();
  for (const donation of donations) {
    donationsPerDonor.set(
      donation.donor_id,
      (donationsPerDonor.get(donation.donor_id) ?? 0) + 1,
    );
  }

  const now = referenceDate.getTime();
  const eventStatusCounts = countEventStatuses(events);
  const participationStatusCounts = countParticipationStatuses(participations);

  return {
    accounts: {
      totalAccounts: users.length,
      byRole: countRoles(users),
    },
    programmes: {
      totalEventRecords: events.length,
      publishedEventRecords: eventStatusCounts.published,
      upcomingPublishedEvents: events.filter(
        (event) =>
          event.status === "published" &&
          new Date(event.starts_at).getTime() >= now,
      ).length,
      eventsByType,
      publishedEventsByType,
      uncategorizedEvents,
    },
    participation: {
      totalRecords: participations.length,
      byStatus: participationStatusCounts,
      volunteerParticipationRecords: participations.filter(
        (participation) =>
          userRoleById.get(participation.user_id) === "volunteer",
      ).length,
      volunteerAttendances: participations.filter(
        (participation) =>
          participation.status === "attended" &&
          userRoleById.get(participation.user_id) === "volunteer",
      ).length,
      attendancesByEventType,
      uncategorizedAttendances,
    },
    donations: {
      totalRecords: donations.length,
      accountsWithDonationRecords: donationsPerDonor.size,
      accountsWithMultipleDonationRecords: [...donationsPerDonor.values()].filter(
        (count) => count > 1,
      ).length,
      activeRecurringRecords: donations.filter(
        (donation) => donation.kind === "recurring" && donation.status === "active",
      ).length,
      eventEarmarkedRecords: donations.filter(
        (donation) => donation.event_id !== null,
      ).length,
      byStatus: countDonationStatuses(donations),
      completedTotalsByCurrency: completedCurrencyTotals(donations),
    },
  };
}

// Keep these constants referenced by the compiler when the generated enum
// types change; a schema change will then fail type-checking here instead of
// silently producing incomplete dashboard counts.
void USER_ROLES;
void EVENT_STATUSES;
void PARTICIPATION_STATUSES;
void DONATION_STATUSES;
void EVENT_TYPES;
