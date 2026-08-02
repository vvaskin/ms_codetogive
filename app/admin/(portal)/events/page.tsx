import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/AdminUI";
import { EventForm } from "@/app/admin/events/EventForm";
import {
  createEvent,
  deleteEvent,
  updateEventStatus,
} from "@/app/admin/events/actions";
import { formatAdminDateTime } from "@/lib/admin/format";
import { getAdminEventList } from "@/lib/admin/queries";
import legacyStyles from "@/app/admin/AdminPortal.module.css";
import { EventComposer } from "./EventComposer";
import styles from "./Events.module.css";

export const metadata: Metadata = { title: "Events" };

const eventTypeLabels = {
  sport: "Sport",
  nutrition: "Nutrition",
  family_support: "Family support",
} as const;

export default async function EventsPage() {
  const events = await getAdminEventList();

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Events"
        description="Create, publish and review event records and their volunteer registrations. The public Activity Calendar remains separately managed."
        actions={<a className={styles.primaryAction} href="#add-event">Add event</a>}
      />

      <EventComposer className={legacyStyles.eventComposer} id="add-event">
        <summary>Close event form</summary>
        <EventForm action={createEvent} submitLabel="Create event" />
      </EventComposer>

      <AdminPanel
        eyebrow="Schedule directory"
        title="Event records"
        description={`${events.length} ${events.length === 1 ? "event" : "events"} in Supabase`}
      >
        {events.length === 0 ? (
          <AdminEmptyState
            title="No events yet"
            description="Use Add event to create the first event."
            icon="◷"
          />
        ) : (
          <div className={legacyStyles.eventList}>
            {events.map(({ event, participationCount, registeredCount }) => (
              <article className={legacyStyles.eventAdminCard} key={event.id}>
                <div className={legacyStyles.eventCardMain}>
                  <div>
                    <div className={legacyStyles.eventCardMeta}>
                      <AdminStatusBadge status={event.status} />
                      <span>
                        {event.type ? eventTypeLabels[event.type] : "General event"}
                      </span>
                      {event.subtype ? <span>· {event.subtype}</span> : null}
                    </div>
                    <h3>{event.title}</h3>
                    {event.title_zh ? <p lang="zh-Hant">{event.title_zh}</p> : null}
                  </div>
                  <div className={legacyStyles.eventFacts}>
                    <span>{formatAdminDateTime(event.starts_at)}</span>
                    <span>{event.location ?? "Location not set"}</span>
                    <strong>{participationCount} participation records</strong>
                    {/* participation keeps cancelled/no-show history, so the live registered count can be lower */}
                    {registeredCount !== participationCount ? (
                      <small>{registeredCount} currently registered</small>
                    ) : null}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <Link href={`/admin/events/${event.id}`}>View details</Link>
                  <form action={updateEventStatus}>
                    <input type="hidden" name="id" value={event.id} />
                    {event.status === "cancelled" ? (
                      <button
                        className={styles.publishAction}
                        name="status"
                        value="published"
                        type="submit"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        className={styles.cancelAction}
                        name="status"
                        value="cancelled"
                        type="submit"
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <ConfirmSubmitButton
                      className={legacyStyles.deleteButton}
                      message={`Delete “${event.title}”? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </>
  );
}
