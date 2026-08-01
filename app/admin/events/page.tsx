import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  createAdminClient,
  getAdminAuthState,
} from "@/lib/supabase/admin";
import type { EventRow } from "@/lib/supabase/types";
import {
  cancelEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  updateEventStatus,
} from "./actions";
import { EventForm, type EventFormValues } from "./EventForm";
import styles from "../AdminPortal.module.css";

export const metadata: Metadata = {
  title: "Events database",
  robots: { index: false, follow: false },
};

const eventTypeLabels = {
  sport: "Sport",
  nutrition: "Nutrition",
  family_support: "Family support",
} as const;

function inputDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
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

function eventDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-HK", {
    timeZone: "Asia/Hong_Kong",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function EventsDatabase() {
  const authState = await getAdminAuthState();
  if (!authState.user || !authState.isStaff) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load events: ${error.message}`);
  }

  const events = data ?? [];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ADMINISTRATION</p>
          <h1>Events database</h1>
          <p>Manage the events shown on the public activity calendar.</p>
        </div>
        <div className={styles.headerActions}>
          <span>Signed in as {authState.user.email ?? "Staff"}</span>
          <SignOutButton />
        </div>
      </header>

      <nav className={styles.workspaceNav} aria-label="Admin sections">
        <Link href="/admin" className={styles.workspaceLink}>People</Link>
        <Link href="/admin/events" className={styles.activeWorkspace}>Events</Link>
      </nav>

      <details className={styles.eventComposer}>
        <summary>Add an event</summary>
        <EventForm action={createEvent} submitLabel="Create event" />
      </details>

      <section className={styles.tablePanel}>
        <div className={styles.tableHeading}>
          <div>
            <p className={styles.eyebrow}>SCHEDULE DIRECTORY</p>
            <h2>Events</h2>
          </div>
          <span>{events.length} records</span>
        </div>

        {events.length === 0 ? (
          <p className={styles.empty}>No events yet. Use “Add an event” to create the first one.</p>
        ) : (
          <div className={styles.eventList}>
            {events.map((record) => (
              <article className={styles.eventAdminCard} key={record.id}>
                <div className={styles.eventCardMain}>
                  <div>
                    <div className={styles.eventCardMeta}>
                      <span className={`${styles.statusPill} ${styles[record.status]}`}>
                        {record.status}
                      </span>
                      <span>{record.type ? eventTypeLabels[record.type] : "General event"}</span>
                    </div>
                    <h3>{record.title}</h3>
                    {record.title_zh && <p lang="zh-Hant">{record.title_zh}</p>}
                  </div>
                  <div className={styles.eventFacts}>
                    <span>{eventDate(record.starts_at)}</span>
                    <span>{record.location ?? "Location not set"}</span>
                  </div>
                </div>

                <div className={styles.eventActions}>
                  <form action={updateEventStatus}>
                    <input type="hidden" name="id" value={record.id} />
                    {record.status === "cancelled" ? (
                      <button className={styles.publishButton} name="status" value="published" type="submit">Publish</button>
                    ) : (
                      <button className={styles.cancelButton} name="status" value="cancelled" type="submit">Cancel</button>
                    )}
                  </form>

                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={record.id} />
                    <ConfirmSubmitButton
                      className={styles.deleteButton}
                      message={`Delete “${record.title}”? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>

                <details className={styles.eventEditorPanel}>
                  <summary>
                    <p className={styles.eyebrow}>EVENT DETAILS</p>
                    <h4>Update this event</h4>
                  </summary>
                  <EventForm
                    action={updateEvent}
                    cancelAction={cancelEvent}
                    deleteAction={deleteEvent}
                    deleteMessage={`Delete “${record.title}”? This cannot be undone.`}
                    publishOnSave
                    submitLabel="Save changes and publish"
                    initialValues={eventFormValues(record)}
                  />
                </details>

              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function eventFormValues(record: EventRow): EventFormValues {
  return {
    id: record.id,
    title: record.title,
    titleZh: record.title_zh ?? "",
    startsAt: inputDateTime(record.starts_at),
    endsAt: inputDateTime(record.ends_at),
    location: record.location ?? "",
    locationZh: record.location_zh ?? "",
    type: record.type ?? undefined,
    subtype: record.subtype ?? "",
    status: record.status,
  };
}
