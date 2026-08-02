import "server-only";

import { redirect } from "next/navigation";
import {
  createAdminClient,
  getAdminAuthState,
} from "@/lib/supabase/admin";
import type {
  DonationRow,
  EventGuestSignupRow,
  EventParticipationRow,
  EventRow,
  ParticipationStatus,
  UserRow,
  VolunteerApplicationRow,
} from "@/lib/supabase/types";
import {
  buildDonationTrend,
  buildEventOperations,
  buildRecentDonations,
  type AdminOperationalDashboard,
  type DashboardPeriod,
} from "@/lib/admin/dashboard";

const PARTICIPATION_STATUSES = [
  "accepted",
  "attended",
  "no_show",
  "cancelled",
] as const satisfies readonly ParticipationStatus[];
export const PEOPLE_DIRECTORY_ROLES = [
  "member",
  "contributor",
] as const;

const directoryRoleToUserRole: Record<
  PeopleDirectoryRole,
  UserRow["role"]
> = {
  member: "member",
  contributor: "contributor",
};

export type PeopleDirectoryRole = (typeof PEOPLE_DIRECTORY_ROLES)[number];
export type ParticipationStatusCounts = Record<ParticipationStatus, number>;

export interface CurrencyTotal {
  currency: string;
  donationCount: number;
  amountCents: number;
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

function emptyParticipationStatusCounts(): ParticipationStatusCounts {
  return { accepted: 0, pending: 0, rejected: 0, attended: 0, no_show: 0, cancelled: 0 };
}

function countParticipationStatuses(
  rows: ReadonlyArray<Pick<EventParticipationRow, "status">>,
): ParticipationStatusCounts {
  const counts = emptyParticipationStatusCounts();
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

export async function getAdminOperationalDashboard({
  period = "30d",
  currency = null,
  referenceDate = new Date(),
}: {
  period?: DashboardPeriod;
  currency?: string | null;
  referenceDate?: Date;
} = {}): Promise<AdminOperationalDashboard> {
  assertValidDate(referenceDate);
  const admin = await staffAdminClient();
  const [users, events, participations, guestSignups, donations] =
    await Promise.all([
      loadAllRows<Pick<UserRow, "id" | "name" | "role">>(
        "Unable to load dashboard people data.",
        (from, to) =>
          admin
            .from("users")
            .select("id, name, role")
            .order("id")
            .range(from, to),
      ),
      loadAllRows<Pick<EventRow, "id" | "title" | "starts_at" | "status">>(
        "Unable to load dashboard event data.",
        (from, to) =>
          admin
            .from("events")
            .select("id, title, starts_at, status")
            .order("id")
            .range(from, to),
      ),
      loadAllRows<
        Pick<
          EventParticipationRow,
          "event_id" | "user_id" | "status" | "hours_logged"
        >
      >("Unable to load dashboard participation data.", (from, to) =>
        admin
          .from("event_participations")
          .select("event_id, user_id, status, hours_logged")
          .order("id")
          .range(from, to),
      ),
      loadAllRows<Pick<EventGuestSignupRow, "event_id" | "status">>(
        "Unable to load dashboard guest sign-ups.",
        (from, to) =>
          admin
            .from("event_guest_signups")
            .select("event_id, status")
            .order("id")
            .range(from, to),
      ),
      loadAllRows<
        Pick<
          DonationRow,
          | "id"
          | "donor_id"
          | "amount_cents"
          | "currency"
          | "status"
          | "created_at"
        >
      >("Unable to load dashboard donation data.", (from, to) =>
        admin
          .from("donations")
          .select("id, donor_id, amount_cents, currency, status, created_at")
          .eq("status", "completed")
          .order("id")
          .range(from, to),
      ),
    ]);

  return {
    events: buildEventOperations({
      events,
      participations,
      guestSignups,
      users,
      referenceDate,
    }),
    donations: buildDonationTrend({
      donations,
      period,
      requestedCurrency: currency,
      referenceDate,
    }),
    recentDonations: buildRecentDonations({ donations, users }),
  };
}

export async function getPeopleDirectory(
  role: PeopleDirectoryRole,
): Promise<AdminPeopleDirectory> {
  if (!isPeopleDirectoryRole(role)) {
    throw new Error("A valid people-directory role is required.");
  }

  const admin = await staffAdminClient();
  const userRole = directoryRoleToUserRole[role];
  const people = await loadAllRows<AdminPersonProfile>(
    `Unable to load the ${role} directory.`,
    (from, to) =>
      admin
        .from("users")
        .select(
          "id, email, name, phone_number, address, role, profile_image, created_at, updated_at",
        )
        .eq("role", userRole)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(from, to),
  );
  const userIds = people.map((person) => person.id);
  let participations: ParticipationAggregateRow[] = [];
  let donations: DonationAggregateRow[] = [];

  if (userIds.length > 0) {
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

  // Contributors aggregate both volunteer activity and donation history.
  if (userIds.length > 0 && role === "contributor") {
    donations = await loadRowsForUserIds<DonationAggregateRow>(
      userIds,
      "Unable to load donation totals for contributor accounts.",
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

export interface AdminVolunteerApplication {
  id: number;
  userId: string;
  name: string;
  email: string | null;
  status: VolunteerApplicationRow["status"];
  submittedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  rejectionReasonVisible: boolean;
  ageGroup: string | null;
  gender: string | null;
  referralSource: string | null;
  bio: string | null;
}

export async function getVolunteerApplications(): Promise<
  AdminVolunteerApplication[]
> {
  const admin = await staffAdminClient();
  const rows = await loadAllRows<
    Pick<
      VolunteerApplicationRow,
      | "id"
      | "user_id"
      | "status"
      | "submitted_at"
      | "reviewed_at"
      | "rejection_reason"
      | "rejection_reason_visible"
      | "age_group"
      | "gender"
      | "referral_source"
      | "bio"
    >
  >("Unable to load volunteer applications.", (from, to) =>
    admin
      .from("volunteer_applications")
      .select(
        "id, user_id, status, submitted_at, reviewed_at, rejection_reason, rejection_reason_visible, age_group, gender, referral_source, bio",
      )
      .order("submitted_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, to),
  );

  const userIds = [...new Set(rows.map((row) => row.user_id))];
  const usersById = new Map<
    string,
    Pick<UserRow, "id" | "name" | "email">
  >();
  for (
    let index = 0;
    index < userIds.length;
    index += ADMIN_ID_CHUNK_SIZE
  ) {
    const chunk = userIds.slice(index, index + ADMIN_ID_CHUNK_SIZE);
    const { data, error } = await admin
      .from("users")
      .select("id, name, email")
      .in("id", chunk)
      .range(0, ADMIN_QUERY_PAGE_SIZE - 1);
    if (error) throw actionableError("Unable to load application profiles.", error.message);
    for (const user of data ?? []) usersById.set(user.id, user);
  }

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    name: usersById.get(row.user_id)?.name ?? "Profile unavailable",
    email: usersById.get(row.user_id)?.email ?? null,
    status: row.status,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    rejectionReason: row.rejection_reason,
    rejectionReasonVisible: row.rejection_reason_visible,
    ageGroup: row.age_group,
    gender: row.gender,
    referralSource: row.referral_source,
    bio: row.bio,
  }));
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
      registeredCount: statusCounts.accepted,
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
    registeredCount: statusCounts.accepted,
    participationsByStatus: statusCounts,
    participants: participationRows.map((participation) => ({
      participation,
      profile: profilesById.get(participation.user_id) ?? null,
    })),
  };
}

// Keep this list checked against the generated enum so schema changes fail
// type-checking instead of silently producing incomplete participation counts.
void PARTICIPATION_STATUSES;
