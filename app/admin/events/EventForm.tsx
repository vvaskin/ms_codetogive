"use client";

import { useState } from "react";
import styles from "../AdminPortal.module.css";

const eventTypeLabels = {
  sport: "Sport",
  nutrition: "Nutrition",
  family_support: "Family support",
} as const;

function minuteAfter(value: string) {
  if (!value) return undefined;

  // Treat the local components as an arithmetic value only. The server action
  // applies the Asia/Hong_Kong offset when it turns the submitted value into an
  // instant.
  const timestamp = Date.parse(`${value}:00Z`);
  if (Number.isNaN(timestamp)) return undefined;
  return new Date(timestamp + 60_000).toISOString().slice(0, 16);
}

export function EventForm({
  action,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  function updateStart(nextStart: string) {
    setStartsAt(nextStart);
    if (endsAt && endsAt <= nextStart) setEndsAt("");
  }

  return (
    <form action={action} className={styles.eventForm}>
      <label>
        English title
        <input name="title" maxLength={120} required />
      </label>
      <label>
        Chinese title
        <input name="titleZh" maxLength={120} lang="zh-Hant" />
      </label>
      <label>
        Starts (Hong Kong time)
        <input
          name="startsAt"
          type="datetime-local"
          value={startsAt}
          onChange={(event) => updateStart(event.target.value)}
          required
        />
      </label>
      <label>
        Ends (optional)
        <input
          name="endsAt"
          type="datetime-local"
          value={endsAt}
          min={minuteAfter(startsAt)}
          onChange={(event) => setEndsAt(event.target.value)}
          disabled={!startsAt}
        />
      </label>
      <label>
        English location
        <input name="location" maxLength={200} required />
      </label>
      <label>
        Chinese location
        <input name="locationZh" maxLength={200} lang="zh-Hant" />
      </label>
      <label>
        Event type
        <select name="type" defaultValue="sport">
          {Object.entries(eventTypeLabels).map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
      </label>
      <label>
        Event subtype (optional)
        <input name="subtype" maxLength={120} />
      </label>
      <label>
        Status
        <select name="status" defaultValue="published">
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>
      <div className={styles.formActions}>
        <button className={styles.primaryButton} type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}
