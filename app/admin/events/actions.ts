"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { isStaffRole } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  EVENT_AUDIENCES,
  EVENT_STATUSES,
  event,
  type EventAudience,
  type EventStatus,
} from "@/lib/db/schema";

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

function parseDateTime(value: string, required: true): Date;
function parseDateTime(value: string, required: false): Date | null;
function parseDateTime(value: string, required: boolean) {
  if (!value && !required) return null;

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error("Invalid event date.");
  }

  const date = new Date(`${value}:00+08:00`);
  if (!value || Number.isNaN(date.getTime())) throw new Error("Invalid event date.");
  return date;
}

function parseAudience(value: string): EventAudience {
  if (!EVENT_AUDIENCES.includes(value as EventAudience)) {
    throw new Error("Invalid event audience.");
  }
  return value as EventAudience;
}

function parseStatus(value: string): EventStatus {
  if (!EVENT_STATUSES.includes(value as EventStatus)) {
    throw new Error("Invalid event status.");
  }
  return value as EventStatus;
}

async function requireStaff() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isStaffRole(session.user.role)) redirect("/admin/login");
}

function revalidateEventPages() {
  revalidatePath("/admin/events");
}

function eventValues(formData: FormData, statusOverride?: EventStatus) {
  const startsAt = parseDateTime(textValue(formData, "startsAt"), true);
  const endsAt = parseDateTime(textValue(formData, "endsAt"), false);

  if (endsAt && endsAt < startsAt) {
    throw new Error("The end time cannot be earlier than the start time.");
  }

  const title = limitedText(formData, "title", 120, true)!;
  const location = limitedText(formData, "location", 200, true)!;

  return {
    title,
    titleZh: limitedText(formData, "titleZh", 120),
    description: limitedText(formData, "description", 2000),
    descriptionZh: limitedText(formData, "descriptionZh", 2000),
    location,
    locationZh: limitedText(formData, "locationZh", 200),
    startsAt,
    endsAt,
    audience: parseAudience(textValue(formData, "audience")),
    status: statusOverride ?? parseStatus(textValue(formData, "status")),
  };
}

export async function createEvent(formData: FormData) {
  await requireStaff();
  await db.insert(event).values({ id: randomUUID(), ...eventValues(formData) });
  revalidateEventPages();
  redirect("/admin/events");
}

export async function updateEvent(formData: FormData) {
  await requireStaff();
  const id = textValue(formData, "id");
  await db
    .update(event)
    .set(eventValues(formData, "published"))
    .where(eq(event.id, id));
  revalidateEventPages();
  redirect("/admin/events");
}

export async function updateEventStatus(formData: FormData) {
  await requireStaff();
  const id = textValue(formData, "id");
  const status = parseStatus(textValue(formData, "status"));
  await db.update(event).set({ status }).where(eq(event.id, id));
  revalidateEventPages();
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  await requireStaff();
  await db.delete(event).where(eq(event.id, textValue(formData, "id")));
  revalidateEventPages();
  redirect("/admin/events");
}
