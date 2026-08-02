"use client";

import type { Locale } from "@/content/site-data";
import { formatEventTime, formatWeekdayDayMonthAt } from "@/lib/format-date";
import { pickLocalized } from "@/lib/localized";
import type { UserRole } from "@/lib/roles";
import { EventSignupButton } from "./EventSignupButton";
import styles from "./VolunteerEventsFeed.module.css";

type FeedEvent = {
  id: number;
  title: string;
  title_zh: string | null;
  title_cn: string | null;
  starts_at: string;
  ends_at: string | null;
  type: "sport" | "nutrition" | "family_support" | null;
  subtype: string | null;
  location: string | null;
  location_zh: string | null;
  location_cn: string | null;
  location_link: string | null;
  status: "published" | "cancelled";
};

const typeLabels: Record<NonNullable<FeedEvent["type"]>, string> = {
  sport: "Sport",
  nutrition: "Nutrition",
  family_support: "Family",
};

const typeColors: Record<NonNullable<FeedEvent["type"]>, string> = {
  sport: "var(--color-blue, #2a78d6)",
  nutrition: "var(--color-teal, #1baf7a)",
  family_support: "var(--color-pink, #eb6834)",
};

export function VolunteerEventsFeed({
  events,
  sessionRole,
  isApprovedVolunteer = false,
  registeredEventIds,
  locale,
}: {
  events: FeedEvent[];
  sessionRole: UserRole | null;
  isApprovedVolunteer?: boolean;
  registeredEventIds: number[];
  locale: Locale;
}) {
  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Volunteer with Love 21</p>
        <h1>Lend your time at an upcoming activity</h1>
        <p>
          Browse what&apos;s coming up and sign up to volunteer. No account
          needed — we&apos;ll set one up for you so you can track what you&apos;ve
          joined.
        </p>
      </header>

      {events.length === 0 ? (
        <p className={styles.empty}>
          No upcoming events are published yet. Please check back soon.
        </p>
      ) : (
        <div className={styles.grid}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              sessionRole={sessionRole}
              isApprovedVolunteer={isApprovedVolunteer}
              registered={registeredEventIds.includes(event.id)}
              locale={locale}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function EventCard({
  event,
  sessionRole,
  isApprovedVolunteer,
  registered,
  locale,
}: {
  event: FeedEvent;
  sessionRole: UserRole | null;
  isApprovedVolunteer: boolean;
  registered: boolean;
  locale: Locale;
}) {
  const title = pickLocalized(event, "title", locale) ?? event.title;
  const location = pickLocalized(event, "location", locale) ?? event.location;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <time className={styles.date}>
          {formatWeekdayDayMonthAt(event.starts_at)}
          <span className={styles.time}>
            {" · "}
            {formatEventTime(event.starts_at, event.ends_at)}
          </span>
        </time>
        {event.type && (
          <span
            className={styles.tag}
            style={{ backgroundColor: typeColors[event.type] }}
          >
            {event.subtype
              ? capitalize(event.subtype)
              : typeLabels[event.type]}
          </span>
        )}
      </div>
      <h3>{title}</h3>
      {location && (
        <p className={styles.location}>
          {event.location_link ? (
            <a href={event.location_link} target="_blank" rel="noreferrer">
              {location}
            </a>
          ) : (
            location
          )}
        </p>
      )}

      <div className={styles.signupWrap}>
        <EventSignupButton
          eventId={event.id}
          locale={locale}
          sessionRole={sessionRole}
          isApprovedVolunteer={isApprovedVolunteer}
          signedUp={registered}
        />
      </div>
    </article>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
