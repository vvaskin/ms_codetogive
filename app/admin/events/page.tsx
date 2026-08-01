import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { SignOutButton } from "@/components/SignOutButton";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { isStaffRole } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { event } from "@/lib/db/schema";
import {
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

const audienceLabels = {
  members: "Members",
  volunteers: "Volunteers",
  everyone: "Everyone",
} as const;

function inputDateTime(date: Date | null) {
  if (!date) return "";
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

function eventDate(date: Date) {
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isStaffRole(session.user.role)) redirect("/admin/login");

  const events = await db.select().from(event).orderBy(asc(event.startsAt));

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ADMINISTRATION</p>
          <h1>Events database</h1>
          <p>Manage prototype event records. The public schedule is not connected.</p>
        </div>
        <div className={styles.headerActions}>
          <span>Signed in as {session.user.email}</span>
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
          <p className={styles.empty}>No events yet. Use “Add an event” to create the first draft.</p>
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
                      <span>{audienceLabels[record.audience]}</span>
                    </div>
                    <h3>{record.title}</h3>
                    {record.titleZh && <p lang="zh-Hant">{record.titleZh}</p>}
                  </div>
                  <div className={styles.eventFacts}>
                    <span>{eventDate(record.startsAt)}</span>
                    <span>{record.location}</span>
                  </div>
                </div>

                {record.status !== "draft" && (
                  <div className={styles.eventActions}>
                    <form action={updateEventStatus}>
                      <input type="hidden" name="id" value={record.id} />
                      <button name="status" value="draft" type="submit">Move to draft</button>
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
                )}

                {record.status === "draft" && (
                  <div className={styles.eventEditorPanel}>
                    <div className={styles.editorHeading}>
                      <p className={styles.eyebrow}>DRAFT DETAILS</p>
                      <h4>Update this event</h4>
                    </div>
                    <EventForm
                      action={updateEvent}
                      cancelAction={updateEventStatus}
                      deleteAction={deleteEvent}
                      deleteMessage={`Delete “${record.title}”? This cannot be undone.`}
                      publishOnSave
                      submitLabel="Save changes and publish"
                      initialValues={eventFormValues(record)}
                    />
                  </div>
                )}

              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function eventFormValues(record: typeof event.$inferSelect): EventFormValues {
  return {
    id: record.id,
    title: record.title,
    titleZh: record.titleZh ?? "",
    startsAt: inputDateTime(record.startsAt),
    endsAt: inputDateTime(record.endsAt),
    location: record.location,
    locationZh: record.locationZh ?? "",
    audience: record.audience,
    status: record.status,
    description: record.description ?? "",
    descriptionZh: record.descriptionZh ?? "",
  };
}
