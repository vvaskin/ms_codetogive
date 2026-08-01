import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  AdminEmptyState,
  AdminMetricCard,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/AdminUI";
import { EventForm, type EventFormValues } from "@/app/admin/events/EventForm";
import {
  cancelEvent,
  deleteEvent,
  updateEvent,
  updateEventStatus,
} from "@/app/admin/events/actions";
import { formatAdminDate, formatAdminDateTime, inputDateTime } from "@/lib/admin/format";
import { getAdminEventDetail } from "@/lib/admin/queries";
import type { EventRow } from "@/lib/supabase/types";
import styles from "../Events.module.css";

type EventDetailProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: EventDetailProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Event ${id}` };
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { id: rawId } = await params;
  const eventId = Number(rawId);
  if (!Number.isSafeInteger(eventId) || eventId < 1) notFound();

  const detail = await getAdminEventDetail(eventId);
  if (!detail) notFound();
  const { event } = detail;

  return (
    <>
      <AdminPageHeader
        eyebrow="Event details"
        title={event.title}
        description={`${formatAdminDateTime(event.starts_at)} · ${event.location ?? "Location not set"}`}
        actions={<Link className={styles.secondaryAction} href="/admin/events">Back to events</Link>}
      />

      <section className={styles.detailMetrics} aria-label="Event registration summary">
        <AdminMetricCard
          label="All participation records"
          value={detail.participantCount}
          description="Includes registered, attended, cancelled and no-show records"
          tone="blue"
          icon="P"
        />
        <AdminMetricCard
          label="Currently registered"
          value={detail.registeredCount}
          description="Capacity is not tracked by the current schema"
          tone="teal"
          icon="✓"
        />
        <AdminMetricCard
          label="Attendance"
          value={detail.participationsByStatus.attended}
          description={`${detail.participationsByStatus.no_show} no-show records`}
          tone="purple"
          icon="A"
        />
      </section>

      <div className={styles.detailGrid}>
        <AdminPanel title="Event information" eyebrow="Schedule" tone="blush">
          <dl className={styles.eventDefinitionList}>
            <div><dt>Status</dt><dd><AdminStatusBadge status={event.status} /></dd></div>
            <div><dt>Starts</dt><dd>{formatAdminDateTime(event.starts_at)}</dd></div>
            <div><dt>Ends</dt><dd>{event.ends_at ? formatAdminDateTime(event.ends_at) : "Not set"}</dd></div>
            <div><dt>Location</dt><dd>{event.location ?? "Not set"}</dd></div>
            <div><dt>Category</dt><dd>{event.type?.replaceAll("_", " ") ?? "Uncategorized"}</dd></div>
            <div><dt>Subtype</dt><dd>{event.subtype ?? "Not set"}</dd></div>
          </dl>

          <div className={styles.detailActions}>
            {event.status !== "draft" ? (
              <form action={updateEventStatus}>
                <input type="hidden" name="id" value={event.id} />
                <button name="status" value="draft" type="submit">Move to draft and edit</button>
                {event.status === "cancelled" ? (
                  <button name="status" value="published" type="submit">Publish</button>
                ) : (
                  <button className={styles.dangerOutline} name="status" value="cancelled" type="submit">Cancel</button>
                )}
              </form>
            ) : null}
            <form action={deleteEvent}>
              <input type="hidden" name="id" value={event.id} />
              <ConfirmSubmitButton
                className={styles.dangerOutline}
                message={`Delete “${event.title}”? This cannot be undone.`}
              >
                Delete event
              </ConfirmSubmitButton>
            </form>
          </div>
        </AdminPanel>

        {event.status === "draft" ? (
          <AdminPanel title="Edit draft" eyebrow="Editor" tone="sky">
            <EventForm
              action={updateEvent}
              cancelAction={cancelEvent}
              deleteAction={deleteEvent}
              deleteMessage={`Delete “${event.title}”? This cannot be undone.`}
              publishOnSave
              submitLabel="Save changes and publish"
              initialValues={eventFormValues(event)}
            />
          </AdminPanel>
        ) : null}
      </div>

      <AdminPanel
        title="Registered volunteers and members"
        eyebrow="Participation"
        description="Registration and attendance status from Supabase."
      >
        {detail.participants.length === 0 ? (
          <AdminEmptyState
            title="No registrations yet"
            description="Participation records will appear here when someone registers for this event."
          />
        ) : (
          <div className={styles.participantTable} role="region" aria-label="Event participants" tabIndex={0}>
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Account type</th><th>Status</th><th>Registered</th></tr></thead>
              <tbody>
                {detail.participants.map(({ participation, profile }) => (
                  <tr key={participation.id}>
                    <td><strong>{profile?.name ?? "Profile unavailable"}</strong></td>
                    <td>{profile?.email ?? "Unavailable"}</td>
                    <td>{profile?.role ?? "Unknown"}</td>
                    <td><AdminStatusBadge status={participation.status} label={participation.status.replaceAll("_", " ")} /></td>
                    <td>{formatAdminDate(participation.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </>
  );
}

function eventFormValues(event: EventRow): EventFormValues {
  return {
    id: event.id,
    title: event.title,
    titleZh: event.title_zh ?? "",
    startsAt: inputDateTime(event.starts_at),
    endsAt: inputDateTime(event.ends_at),
    location: event.location ?? "",
    locationZh: event.location_zh ?? "",
    type: event.type ?? undefined,
    subtype: event.subtype ?? "",
    status: event.status,
  };
}
