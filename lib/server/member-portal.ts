import "server-only";

import type {
  EventParticipationRow,
  EventRow,
  EventType,
  ParticipationStatus,
} from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";

const eventColumns = [
  "id",
  "title",
  "description",
  "location",
  "location_link",
  "starts_at",
  "ends_at",
  "status",
  "type",
  "subtype",
  "image",
].join(", ");

// sv-SE renders zero-padded yyyy-mm-dd — stable, sortable keys for grouping the calendar by day
const dateKeyFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Hong_Kong",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// labels and times are formatted in HK wall time because members think in local days, not utc instants
const dateLabelFormatter = new Intl.DateTimeFormat("en-HK", {
  timeZone: "Asia/Hong_Kong",
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-HK", {
  timeZone: "Asia/Hong_Kong",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export interface MemberPortalEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  locationLink: string | null;
  startsAt: string;
  endsAt: string | null;
  status: EventRow["status"];
  type: EventType | null;
  subtype: string | null;
  image: string | null;
  dateKey: string;
  dateLabel: string;
  timeLabel: string;
}

export interface MemberPortalParticipation {
  eventId: number;
  status: ParticipationStatus;
  hoursLogged: number | null;
  registeredAt: string;
  event: MemberPortalEvent | null;
}

export interface MemberPortalData {
  asOf: string;
  publishedEvents: MemberPortalEvent[];
  participations: MemberPortalParticipation[];
}

type SelectedEvent = Pick<
  EventRow,
  | "id"
  | "title"
  | "description"
  | "location"
  | "location_link"
  | "starts_at"
  | "ends_at"
  | "status"
  | "type"
  | "subtype"
  | "image"
>;

type SelectedParticipation = Pick<
  EventParticipationRow,
  "event_id" | "status" | "hours_logged" | "created_at"
>;

function formatEvent(row: SelectedEvent): MemberPortalEvent {
  const start = new Date(row.starts_at);
  const end = row.ends_at ? new Date(row.ends_at) : null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    locationLink: row.location_link,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    type: row.type,
    subtype: row.subtype,
    image: row.image,
    dateKey: dateKeyFormatter.format(start),
    dateLabel: dateLabelFormatter.format(start),
    timeLabel: end
      ? `${timeFormatter.format(start)} – ${timeFormatter.format(end)}`
      : timeFormatter.format(start),
  };
}

/** Loads only database-backed event data visible to the signed-in member. */
export async function getMemberPortalData(
  userId: string,
): Promise<MemberPortalData> {
  const supabase = await createClient();
  const [participationResult, publishedResult] = await Promise.all([
    supabase
      .from("event_participations")
      .select("event_id, status, hours_logged, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("events")
      .select(eventColumns)
      .eq("status", "published")
      .order("starts_at", { ascending: true }),
  ]);

  if (participationResult.error) {
    throw new Error(
      `Unable to load member participations: ${participationResult.error.message}`,
    );
  }
  if (publishedResult.error) {
    throw new Error(
      `Unable to load published events: ${publishedResult.error.message}`,
    );
  }

  const participationRows = (participationResult.data ?? []) as SelectedParticipation[];
  const publishedRows = (publishedResult.data ?? []) as unknown as SelectedEvent[];
  const signedEventIds = [...new Set(participationRows.map((row) => row.event_id))];

  // signed-up events need their own lookup — they include past or unpublished events the directory query excludes
  let signedRows: SelectedEvent[] = [];
  if (signedEventIds.length > 0) {
    const signedResult = await supabase
      .from("events")
      .select(eventColumns)
      .in("id", signedEventIds);

    if (signedResult.error) {
      throw new Error(
        `Unable to load signed-up events: ${signedResult.error.message}`,
      );
    }
    signedRows = (signedResult.data ?? []) as unknown as SelectedEvent[];
  }

  const signedEventMap = new Map(
    signedRows.map((row) => [row.id, formatEvent(row)]),
  );

  return {
    asOf: new Date().toISOString(),
    publishedEvents: publishedRows.map(formatEvent),
    participations: participationRows.map((row) => ({
      eventId: row.event_id,
      status: row.status,
      hoursLogged: row.hours_logged,
      registeredAt: row.created_at,
      event: signedEventMap.get(row.event_id) ?? null,
    })),
  };
}
