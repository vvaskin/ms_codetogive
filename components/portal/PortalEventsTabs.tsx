"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/content/site-data";
import { formatEventTime, formatWeekdayDayMonthAt } from "@/lib/format-date";
import { pickLocalized } from "@/lib/localized";
import type {
  EventRow,
  EventType,
  ParticipationStatus,
} from "@/lib/supabase/types";
import styles from "./PortalEventsTabs.module.css";

export interface MyEvent {
  event: EventRow;
  participationStatus: ParticipationStatus;
}

const typeLabels: Record<EventType, string> = {
  sport: "Sport",
  nutrition: "Nutrition",
  family_support: "Family",
};

const typeColors: Record<EventType, string> = {
  sport: "var(--color-blue)",
  nutrition: "var(--color-teal)",
  family_support: "var(--color-pink)",
};

const participationLabels: Record<ParticipationStatus, string> = {
  registered: "Registered",
  attended: "Attended",
  no_show: "No-show",
  cancelled: "Cancelled",
};

const participationClass: Record<ParticipationStatus, string> = {
  registered: styles.statusRegistered,
  attended: styles.statusAttended,
  no_show: styles.statusNoShow,
  cancelled: styles.statusCancelled,
};

type Tab = "upcoming" | "mine";

export function PortalEventsTabs({
  upcoming,
  mine,
  locale,
}: {
  upcoming: EventRow[];
  mine: MyEvent[];
  locale: Locale;
}) {
  const [tab, setTab] = useState<Tab>("upcoming");

  const registeredIds = useMemo(
    () => new Set(mine.map((m) => m.event.id)),
    [mine],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Events tabs">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "upcoming"}
          className={`${styles.tab} ${tab === "upcoming" ? styles.tabActive : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming
          <span className={styles.count}>{upcoming.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "mine"}
          className={`${styles.tab} ${tab === "mine" ? styles.tabActive : ""}`}
          onClick={() => setTab("mine")}
        >
          My events
          <span className={styles.count}>{mine.length}</span>
        </button>
      </div>

      {tab === "upcoming" ? (
        upcoming.length === 0 ? (
          <EmptyState
            title="No events published yet"
            body="Come back soon — new sport, nutrition and family activities go up every week."
          />
        ) : (
          <div className={styles.grid}>
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                locale={locale}
                registered={registeredIds.has(event.id)}
              />
            ))}
          </div>
        )
      ) : mine.length === 0 ? (
        <EmptyState
          title="You haven't registered for any events yet"
          body="Browse the Upcoming tab to find something to join."
        />
      ) : (
        <div className={styles.grid}>
          {mine.map(({ event, participationStatus }) => (
            <EventCard
              key={event.id}
              event={event}
              locale={locale}
              participationStatus={participationStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  locale,
  registered,
  participationStatus,
}: {
  event: EventRow;
  locale: Locale;
  registered?: boolean;
  participationStatus?: ParticipationStatus;
}) {
  const isCancelled = event.status === "cancelled";
  const title = pickLocalized(event, "title", locale) ?? event.title;
  const location = pickLocalized(event, "location", locale) ?? event.location;

  return (
    <article
      className={`${styles.card} ${isCancelled ? styles.cardCancelled : ""}`}
    >
      <div className={styles.cardHead}>
        <div className={styles.dateBlock}>
          <time className={styles.date}>
            {formatWeekdayDayMonthAt(event.starts_at)}
          </time>
          <span className={styles.time}>
            {formatEventTime(event.starts_at, event.ends_at)}
          </span>
        </div>
        {event.type && (
          <span
            className={styles.typeTag}
            style={{ backgroundColor: typeColors[event.type] }}
          >
            {event.subtype ? capitalize(event.subtype) : typeLabels[event.type]}
          </span>
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
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
      <div className={styles.footer}>
        {isCancelled ? (
          <span
            className={`${styles.statusPill} ${styles.statusCancelled}`}
          >
            Event cancelled
          </span>
        ) : participationStatus ? (
          <span
            className={`${styles.statusPill} ${participationClass[participationStatus] ?? ""}`}
          >
            {participationLabels[participationStatus]}
          </span>
        ) : registered ? (
          <span className={styles.registered}>Registered ✓</span>
        ) : null}
      </div>
    </article>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className={styles.empty}>
      <strong>{title}</strong>
      {body}
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
