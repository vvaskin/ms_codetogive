"use client";

import { FormEvent, useState } from "react";
import { registerForEvent } from "@/app/actions/registrations";
import { formatWeekdayDayMonth } from "@/lib/format-date";
import styles from "./VolunteerEventsFeed.module.css";

type FeedEvent = {
  id: number;
  title: string;
  date: string;
  type: "sport" | "nutrition" | "family_support";
  subtype: string | null;
  location: string | null;
  location_link: string | null;
};

const typeLabels: Record<FeedEvent["type"], string> = {
  sport: "Sport",
  nutrition: "Nutrition",
  family_support: "Family",
};

const typeColors: Record<FeedEvent["type"], string> = {
  sport: "var(--color-blue, #2a78d6)",
  nutrition: "var(--color-teal, #1baf7a)",
  family_support: "var(--color-pink, #eb6834)",
};

type CardStatus =
  | { state: "idle" }
  | { state: "open" }
  | { state: "submitting" }
  | {
      state: "done";
      createdAccount: boolean;
      notifiedVia?: "sms" | "email" | "none";
      warning?: string;
    }
  | { state: "error"; message: string };

export function VolunteerEventsFeed({
  events,
  isGuest,
}: {
  events: FeedEvent[];
  isGuest: boolean;
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
            <EventCard key={event.id} event={event} isGuest={isGuest} />
          ))}
        </div>
      )}
    </section>
  );
}

function EventCard({
  event,
  isGuest,
}: {
  event: FeedEvent;
  isGuest: boolean;
}) {
  const [status, setStatus] = useState<CardStatus>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus({ state: "submitting" });

    const result = await registerForEvent({
      eventId: event.id,
      email: isGuest ? String(form.get("email") ?? "").trim() : undefined,
      name: isGuest ? String(form.get("name") ?? "").trim() : undefined,
      phone: isGuest ? String(form.get("phone") ?? "").trim() : undefined,
    });

    if (!result.ok) {
      setStatus({ state: "error", message: result.error ?? "Please try again." });
      return;
    }
    setStatus({
      state: "done",
      createdAccount: Boolean(result.createdAccount),
      notifiedVia: result.notifiedVia,
      warning: result.warning,
    });
  }

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <time className={styles.date}>
          {formatWeekdayDayMonth(event.date)}
        </time>
        <span
          className={styles.tag}
          style={{ backgroundColor: typeColors[event.type] }}
        >
          {event.subtype
            ? capitalize(event.subtype)
            : typeLabels[event.type]}
        </span>
      </div>
      <h3>{event.title}</h3>
      {event.location && (
        <p className={styles.location}>
          {event.location_link ? (
            <a href={event.location_link} target="_blank" rel="noreferrer">
              {event.location}
            </a>
          ) : (
            event.location
          )}
        </p>
      )}

      {status.state === "done" ? (
        <div className={styles.success} role="status">
          <strong>You&apos;re signed up to volunteer! 🎉</strong>
          {status.createdAccount && (
            <span>
              {status.warning
                ? status.warning
                : status.notifiedVia === "email"
                  ? "We created an account for you and emailed a link to set your password."
                  : "We created an account for you and texted a link to set your password."}
            </span>
          )}
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
              <label>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+852 XXXX XXXX"
                  required
                />
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
