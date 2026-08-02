import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getVolunteerApplication } from "@/lib/server/volunteer-application";
import type {
  DonationRow,
  EventRow,
  ParticipationStatus,
  VolunteerApplicationRow,
} from "@/lib/supabase/types";

/** A published event, shaped for the contributor portal UI. */
export interface PortalEventCard {
  id: number;
  title: string;
  type: EventRow["type"];
  subtype: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
}

/** The caller's own participation row on an event. */
export interface PortalParticipation {
  eventId: number;
  status: ParticipationStatus;
}

/** The caller's own donation row. */
export interface PortalDonation {
  id: number;
  amountCents: number;
  kind: DonationRow["kind"];
  frequency: DonationRow["frequency"];
  status: DonationRow["status"];
  createdAt: string;
}

export interface ContributorPortalData {
  /** The caller's latest volunteer application, or null when they never applied. */
  application: Pick<
    VolunteerApplicationRow,
    | "status"
    | "submitted_at"
    | "rejection_reason"
    | "rejection_reason_visible"
    | "age_group"
    | "gender"
    | "referral_source"
    | "bio"
  > | null;
  /** All published events, ordered by start time. */
  events: PortalEventCard[];
  /** The caller's event participations (upcoming + attended). */
  participations: PortalParticipation[];
  /** The caller's donations, newest first. */
  donations: PortalDonation[];
  /** Sum of completed + active gift amounts, in cents. */
  totalDonationCents: number;
  /** Total number of donation rows. */
  donationCount: number;
  /** Number of live recurring plans. */
  activeRecurringCount: number;
  /** Normalised monthly value of active recurring plans, in cents. */
  monthlyRecurringCents: number;
  /** Total volunteered hours across attended sessions. */
  totalHours: number;
  /** Number of attended sessions. */
  attendedSessions: number;
  /** Number of distinct programme types attended. */
  attendedProgrammes: number;
}

function completedOrActive(row: PortalDonation): boolean {
  return row.status === "completed" || row.status === "active";
}

/**
 * Loads everything the contributor portal renders from the database, scoped
 * to the signed-in user by RLS. Call from a server component (or server
 * action) that has already verified the session.
 */
export async function getContributorPortalData(
  userId: string,
): Promise<ContributorPortalData> {
  const supabase = await createClient();

  const [application, events, participations, donations] = await Promise.all([
    getVolunteerApplication(userId, supabase),
    supabase
      .from("events")
      .select("id, title, type, subtype, starts_at, ends_at, location")
      .eq("status", "published")
      .order("starts_at", { ascending: true }),
    supabase
      .from("event_participations")
      .select("event_id, status, hours_logged")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("donations")
      .select("id, amount_cents, kind, frequency, status, created_at")
      .eq("donor_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const eventRows = events.data ?? [];
  const participationRows = participations.data ?? [];
  const donationRows = donations.data ?? [];

  const eventsById = new Map(eventRows.map((event) => [event.id, event]));

  const donationCards: PortalDonation[] = donationRows.map((donation) => ({
    id: donation.id,
    amountCents: donation.amount_cents,
    kind: donation.kind,
    frequency: donation.frequency,
    status: donation.status,
    createdAt: donation.created_at,
  }));

  const totalDonationCents = donationCards
    .filter(completedOrActive)
    .reduce((sum, donation) => sum + donation.amountCents, 0);

  const activeRecurring = donationCards.filter(
    (donation) => donation.kind === "recurring" && donation.status === "active",
  );
  const monthlyRecurringCents = activeRecurring.reduce((sum, donation) => {
    const per =
      donation.frequency === "monthly"
        ? 1
        : donation.frequency === "quarterly"
          ? 1 / 3
          : donation.frequency === "yearly"
            ? 1 / 12
            : 0;
    return sum + Math.round(donation.amountCents * per);
  }, 0);

  const attendance = participationRows.filter(
    (participation) => participation.status === "attended",
  );

  let totalHours = 0;
  const attendedProgrammes = new Set<EventRow["type"]>();
  for (const participation of participationRows) {
    const event = eventsById.get(participation.event_id);
    if (participation.status === "attended") {
      attendedProgrammes.add(event?.type ?? null);
    }

    // prefer the hours a staff member logged on the participation; fall back to
    // the event duration for attended sessions that have no logged hours
    if (participation.hours_logged != null) {
      totalHours += participation.hours_logged;
      continue;
    }
    if (participation.status !== "attended" || !event || !event.ends_at) {
      continue;
    }
    const hours =
      (new Date(event.ends_at).getTime() - new Date(event.starts_at).getTime()) /
      3_600_000;
    if (Number.isFinite(hours) && hours > 0) totalHours += hours;
  }

  return {
    application: application
      ? {
          status: application.status,
          submitted_at: application.submitted_at,
          rejection_reason: application.rejection_reason,
          rejection_reason_visible: application.rejection_reason_visible,
          age_group: application.age_group,
          gender: application.gender,
          referral_source: application.referral_source,
          bio: application.bio,
        }
      : null,
    events: eventRows.map((event) => ({
      id: event.id,
      title: event.title,
      type: event.type,
      subtype: event.subtype,
      startsAt: event.starts_at,
      endsAt: event.ends_at,
      location: event.location,
    })),
    participations: participationRows.map((participation) => ({
      eventId: participation.event_id,
      status: participation.status,
    })),
    donations: donationCards,
    totalDonationCents,
    donationCount: donationCards.length,
    activeRecurringCount: activeRecurring.length,
    monthlyRecurringCents,
    totalHours: Math.round(totalHours * 100) / 100,
    attendedSessions: attendance.length,
    attendedProgrammes: attendedProgrammes.size,
  };
}
