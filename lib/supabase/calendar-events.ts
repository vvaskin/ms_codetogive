import type {
  ActivityCategory,
  ActivityEvent,
  LocalizedText,
} from "@/content/activities";
import type { UpcomingEvent } from "@/components/EventsCarousel";
import type { Locale } from "@/content/site-data";
import { formatEventTimeLocale, formatWeekdayDayMonthAt } from "@/lib/format-date";
import { createAdminClient } from "./admin";
import type { EventRow } from "./types";
import { createClient } from "./server";

// sv-SE renders zero-padded yyyy-mm-dd — a ready-made card date without manual padding
const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Hong_Kong",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// stored timestamps are instants; formatting in HK wall time stops late events rolling into the next utc day
const timeFormatter = new Intl.DateTimeFormat("en-HK", {
  timeZone: "Asia/Hong_Kong",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// untranslated zh falls back to english so a calendar card never renders blank
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
    dbId: event.id,
    date: dateFormatter.format(new Date(event.starts_at)),
    time: eventTime(event.starts_at, event.ends_at),
    category: activityCategory(event.type),
    title: localized(event.title, event.title_zh),
    location: localized(event.location, event.location_zh),
    summary: localized(event.description, event.description_zh),
  }));
}

const eventTone: Record<ActivityCategory, UpcomingEvent["tone"]> = {
  sports: "pink",
  nutrition: "mint",
  family: "sky",
  csr: "yellow",
  event: "yellow",
};

const eventImage: Record<ActivityCategory, string> = {
  sports: "/assets/images/home-sports.jpg",
  nutrition: "/assets/images/home-nutrition.jpg",
  family: "/assets/images/home-family.jpeg",
  csr: "/assets/images/home-csr.jpg",
  event: "/assets/images/home-csr.jpg",
};

const eventCategoryLabel: Record<ActivityCategory, { en: string; zh: string; cn: string }> = {
  sports: { en: "Sport", zh: "運動", cn: "运动" },
  nutrition: { en: "Nutrition", zh: "營養", cn: "营养" },
  family: { en: "Family", zh: "家庭", cn: "家庭" },
  csr: { en: "CSR", zh: "CSR", cn: "CSR" },
  event: { en: "Event", zh: "活動", cn: "活动" },
};

const eventRegisterLabel = {
  en: "Register",
  zh: "報名",
  cn: "报名",
};

function localizedTri(english: string | null, chinese: string | null): { en: string; zh: string; cn: string } {
  const fallback = english ?? "";
  const translated = chinese || fallback;
  return { en: fallback, zh: translated, cn: translated };
}

function eventHref(locale: Locale) {
  return locale === "en"
    ? "/events#activity-calendar"
    : locale === "zh"
      ? "/zh/events-hk/#activity-calendar"
      : "/cn/events#activity-calendar";
}

/**
 * Published, upcoming events for the homepage carousel. The homepage is
 * statically revalidated, so this uses the service-role client (like the
 * testimonial carousel) and filters to published, future events itself. Any
 * failure or empty result degrades to the provided static list so the
 * homepage never loses its events section.
 */
export async function readHomepageEvents(
  locale: Locale,
  fallback: UpcomingEvent[],
): Promise<UpcomingEvent[]> {
  try {
    const supabase = createAdminClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, title, title_zh, title_cn, location, location_zh, location_cn, starts_at, ends_at, type, subtype, image",
      )
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true })
      .limit(8);

    if (error) throw error;

    const events = (data ?? []).flatMap((event) => {
      const category = activityCategory(event.type);
      // prefer traditional chinese; fall back to simplified when only that translation exists
      const title = localizedTri(event.title, event.title_zh ?? event.title_cn);
      const location = localizedTri(event.location, event.location_zh ?? event.location_cn);

      return [
        {
          id: `event-${event.id}`,
          title,
          date: {
            en: formatWeekdayDayMonthAt(event.starts_at, "en"),
            zh: formatWeekdayDayMonthAt(event.starts_at, "zh"),
            cn: formatWeekdayDayMonthAt(event.starts_at, "cn"),
          },
          time: {
            en: formatEventTimeLocale(event.starts_at, event.ends_at, "en"),
            zh: formatEventTimeLocale(event.starts_at, event.ends_at, "zh"),
            cn: formatEventTimeLocale(event.starts_at, event.ends_at, "cn"),
          },
          location,
          image: eventImage[category],
          href: eventHref(locale),
          tone: eventTone[category],
          category: eventCategoryLabel[category],
          ctaLabel: eventRegisterLabel,
        } satisfies UpcomingEvent,
      ];
    });

    return events.length ? events : fallback;
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.message
        : ((error as { message?: string })?.message ?? String(error));
    console.error(
      `Unable to load the homepage events carousel, showing the built-in list instead: ${reason}`,
    );
    return fallback;
  }
}
