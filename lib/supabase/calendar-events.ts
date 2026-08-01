import type {
  ActivityCategory,
  ActivityEvent,
  LocalizedText,
} from "@/content/activities";
import type { EventRow } from "./types";
import { createClient } from "./server";

const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Hong_Kong",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("en-HK", {
  timeZone: "Asia/Hong_Kong",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function localized(english: string | null, chinese: string | null): LocalizedText {
  const fallback = english ?? "";
  const translated = chinese || fallback;

  return { en: fallback, zh: translated, cn: translated };
}

function activityCategory(type: EventRow["type"]): ActivityCategory {
  if (type === "sport") return "sports";
  if (type === "nutrition") return "nutrition";
  if (type === "family_support") return "family";
  return "event";
}

function eventTime(startsAt: string, endsAt: string | null) {
  const start = timeFormatter.format(new Date(startsAt));
  if (!endsAt) return start;
  return `${start}–${timeFormatter.format(new Date(endsAt))}`;
}

/** Public calendar records. RLS and this explicit filter both exclude drafts. */
export async function getPublishedCalendarEvents(): Promise<ActivityEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, title_zh, description, description_zh, location, location_zh, starts_at, ends_at, type",
    )
    .eq("status", "published")
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load the activity calendar: ${error.message}`);
  }

  return (data ?? []).map((event) => ({
    id: `event-${event.id}`,
    date: dateFormatter.format(new Date(event.starts_at)),
    time: eventTime(event.starts_at, event.ends_at),
    category: activityCategory(event.type),
    title: localized(event.title, event.title_zh),
    location: localized(event.location, event.location_zh),
    summary: localized(event.description, event.description_zh),
  }));
}
