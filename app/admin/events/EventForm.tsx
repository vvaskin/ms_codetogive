"use client";

import { useState } from "react";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import styles from "../AdminPortal.module.css";

export type EventFormValues = {
  id?: number;
  title?: string;
  titleZh?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  locationZh?: string;
  type?: "sport" | "nutrition" | "family_support";
  subtype?: string;
  status?: "draft" | "published" | "cancelled";
};

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
  cancelAction,
  deleteAction,
  deleteMessage,
  publishOnSave = false,
  submitLabel,
  initialValues = {},
}: {
  action: (formData: FormData) => Promise<void>;
  cancelAction?: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  deleteMessage?: string;
  publishOnSave?: boolean;
  submitLabel: string;
  initialValues?: EventFormValues;
}) {
  const [startsAt, setStartsAt] = useState(initialValues.startsAt ?? "");
  const [endsAt, setEndsAt] = useState(initialValues.endsAt ?? "");

  function updateStart(nextStart: string) {
    setStartsAt(nextStart);
    if (endsAt && endsAt <= nextStart) setEndsAt("");
  }

  return (
    <form action={action} className={styles.eventForm}>
      {initialValues.id && (
        <input type="hidden" name="id" value={initialValues.id} />
      )}
      <label>
        English title
        <input
          name="title"
          defaultValue={initialValues.title}
          maxLength={120}
          required
        />
      </label>
      <label>
        Chinese title
        <input
          name="titleZh"
          defaultValue={initialValues.titleZh}
          maxLength={120}
          lang="zh-Hant"
        />
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
        <input
          name="location"
          defaultValue={initialValues.location}
          maxLength={200}
          required
        />
      </label>
      <label>
        Chinese location
        <input
          name="locationZh"
          defaultValue={initialValues.locationZh}
          maxLength={200}
          lang="zh-Hant"
        />
      </label>
      <label>
        Event type
        <select name="type" defaultValue={initialValues.type ?? "sport"}>
          {Object.entries(eventTypeLabels).map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
      </label>
      <label>
        Event subtype (optional)
        <input
          name="subtype"
          defaultValue={initialValues.subtype}
          maxLength={120}
        />
      </label>
      {!publishOnSave && (
        <label>
          Status
          <select name="status" defaultValue={initialValues.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      )}
      <div className={styles.formActions}>
        <button className={styles.primaryButton} type="submit">{submitLabel}</button>
        {cancelAction && (
          <button
            className={styles.cancelButton}
            type="submit"
            formAction={cancelAction}
            formNoValidate
          >
            Cancel
          </button>
        )}
        {deleteAction && deleteMessage && (
          <ConfirmSubmitButton
            className={styles.deleteButton}
            formAction={deleteAction}
            formNoValidate
            message={deleteMessage}
          >
            Delete
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
