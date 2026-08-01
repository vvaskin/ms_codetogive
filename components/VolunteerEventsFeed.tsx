"use client";

import { FormEvent, useState } from "react";
import { registerForEvent } from "@/app/actions/registrations";
import type { Locale } from "@/content/site-data";
import { formatEventTime, formatWeekdayDayMonthAt } from "@/lib/format-date";
import { pickLocalized } from "@/lib/localized";
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

type CardStatus =
  | { state: "idle" }
  | { state: "open" }
  | { state: "submitting" }
  | { state: "done" }
  | { state: "error"; message: string };

export function VolunteerEventsFeed({
  events,
  isGuest,
  locale,
}: {
  events: FeedEvent[];
  isGuest: boolean;
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
              isGuest={isGuest}
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
  isGuest,
  locale,
}: {
  event: FeedEvent;
  isGuest: boolean;
  locale: Locale;
}) {
  const [status, setStatus] = useState<CardStatus>({ state: "idle" });
  const title = pickLocalized(event, "title", locale) ?? event.title;
  const location = pickLocalized(event, "location", locale) ?? event.location;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus({ state: "submitting" });

    const result = await registerForEvent({
      eventId: event.id,
      guestName: isGuest ? String(form.get("name") ?? "").trim() : null,
      guestEmail: isGuest ? String(form.get("email") ?? "").trim() : null,
    });

    if (!result.ok) {
      setStatus({ state: "error", message: result.error ?? "Please try again." });
      return;
    }
    setStatus({ state: "done" });
  }

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

      {status.state === "done" ? (
        <div className={styles.success} role="status">
          <strong>You&apos;re signed up to volunteer! 🎉</strong>
        </div>
      ) : status.state === "idle" ? (
        <button
          type="button"
          className={styles.primary}
          onClick={() => setStatus({ state: "open" })}
        >
          Register to volunteer
        </button>
      ) : (
        <form className={styles.form} onSubmit={onSubmit}>
          {isGuest && (
            <>
              <label>
                Your name
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </>
          )}
          {status.state === "error" && (
            <p className={styles.error} role="alert">
              {status.message}
            </p>
          )}
          <button
            type="submit"
            className={styles.primary}
            disabled={status.state === "submitting"}
          >
            {status.state === "submitting"
              ? "Signing up…"
              : "Confirm registration"}
          </button>
        </form>
      )}
    </article>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
