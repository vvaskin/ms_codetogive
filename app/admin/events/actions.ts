"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminClient,
  getAdminAuthState,
} from "@/lib/supabase/admin";
import type {
  Database,
  EventStatus,
  EventType,
} from "@/lib/supabase/types";

const EVENT_STATUSES = ["published", "cancelled"] as const;
const EVENT_TYPES = ["sport", "nutrition", "family_support"] as const;

type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function limitedText(
  formData: FormData,
  key: string,
  maximum: number,
  required = false,
) {
  const value = textValue(formData, key);
  if (required && !value) throw new Error(`${key} is required.`);
  if (value.length > maximum) throw new Error(`${key} is too long.`);
  return value || null;
}

function parseEventId(formData: FormData) {
  const rawId = textValue(formData, "id");
  if (!/^\d+$/.test(rawId)) throw new Error("Invalid event id.");

  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Invalid event id.");
  }

  return id;
}

function hongKongDateTime(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(date)
    .replace(" ", "T");
}

function parseDateTime(value: string, required: true): Date;
function parseDateTime(value: string, required: false): Date | null;
function parseDateTime(value: string, required: boolean) {
  if (!value && !required) return null;

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error("Invalid event date.");
  }

  const date = new Date(`${value}:00+08:00`);
  if (Number.isNaN(date.getTime()) || hongKongDateTime(date) !== value) {
    throw new Error("Invalid event date.");
  }

  return date;
}

function parseEventType(value: string): EventType {
  if (!EVENT_TYPES.includes(value as EventType)) {
    throw new Error("Invalid event type.");
  }
  return value as EventType;
}

function parseStatus(value: string): EventStatus {
  if (!EVENT_STATUSES.includes(value as EventStatus)) {
    throw new Error("Invalid event status.");
  }
  return value as EventStatus;
}

async function requireStaff() {
  const authState = await getAdminAuthState();
  if (!authState.user || !authState.isStaff) redirect("/admin/login");
  return createAdminClient();
}

function revalidateEventPages() {
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/zh/events-hk");
  revalidatePath("/cn/events");
}

function eventValues(formData: FormData): EventInsert {
  const startsAt = parseDateTime(textValue(formData, "startsAt"), true);
  const endsAt = parseDateTime(textValue(formData, "endsAt"), false);

  if (endsAt && endsAt <= startsAt) {
    throw new Error("The end time must be later than the start time.");
  }

  return {
    title: limitedText(formData, "title", 120, true)!,
    title_zh: limitedText(formData, "titleZh", 120),
    location: limitedText(formData, "location", 200, true),
    location_zh: limitedText(formData, "locationZh", 200),
    date: textValue(formData, "startsAt").slice(0, 10),
    type: parseEventType(textValue(formData, "type")),
    subtype: limitedText(formData, "subtype", 120),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt?.toISOString() ?? null,
    status: parseStatus(textValue(formData, "status")),
  };
}

function mutationError(operation: string, message: string) {
  return new Error(`Unable to ${operation} event: ${message}`);
}

export async function createEvent(formData: FormData) {
  const supabase = await requireStaff();
  const { error } = await supabase.from("events").insert(eventValues(formData));

  if (error) throw mutationError("create", error.message);

  revalidateEventPages();
  redirect("/admin/events");
}

export async function updateEventStatus(formData: FormData) {
  const supabase = await requireStaff();
  const status = parseStatus(textValue(formData, "status"));
  await setEventStatus(supabase, formData, status);
}

async function setEventStatus(
  supabase: ReturnType<typeof createAdminClient>,
  formData: FormData,
  status: EventStatus,
) {
  const id = parseEventId(formData);
  const { data, error } = await supabase
    .from("events")
    .update({ status })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) throw mutationError("update", error.message);
  if (!data) throw new Error("Event not found.");

  revalidateEventPages();
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  const supabase = await requireStaff();
  const id = parseEventId(formData);
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) throw mutationError("delete", error.message);
  if (!data) throw new Error("Event not found.");

  revalidateEventPages();
  redirect("/admin/events");
}

function parseParticipationId(value: string) {
  if (!/^\d+$/.test(value)) throw new Error("Invalid participation id.");

  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Invalid participation id.");
  }

  return id;
}

function parseHours(value: string) {
  const hours = Number(value);
  if (!Number.isFinite(hours) || hours < 0) {
    throw new Error("Hours must be zero or more.");
  }
  if (hours > 24) {
    throw new Error("Hours cannot exceed 24.");
  }
  return hours;
}

export async function updateParticipationHours(formData: FormData) {
  const supabase = await requireStaff();

  const id = parseParticipationId(textValue(formData, "participationId"));
  const eventId = parseEventId(formData);
  const hours = parseHours(textValue(formData, "hours"));

  const { data, error } = await supabase
    .from("event_participations")
    .update({ hours_logged: hours, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("event_id", eventId)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(`Unable to log hours: ${error.message}`);
  if (!data) throw new Error("Participation record not found.");

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/admin/events");
  revalidatePath("/portal/volunteering");
  revalidatePath("/portal");
}
