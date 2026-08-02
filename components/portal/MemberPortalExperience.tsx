"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMemo, useState } from "react";
import { EventSignupButton } from "@/components/EventSignupButton";
import type {
  MemberPortalData,
  MemberPortalEvent,
  MemberPortalParticipation,
} from "@/lib/server/member-portal";
import type {
  EventType,
  ParticipationStatus,
} from "@/lib/supabase/types";
import styles from "./MemberPortalExperience.module.css";

export type MemberPortalView =
  | "dashboard"
  | "my-events"
  | "events"
  | "milestones";

const typeLabels: Record<EventType, string> = {
  sport: "Sport",
  nutrition: "Nutrition",
  family_support: "Family support",
};

const statusLabels: Record<ParticipationStatus, string> = {
  pending: "Pending review",
  accepted: "Registered",
  attended: "Attended",
  no_show: "No-show",
  cancelled: "Cancelled",
  rejected: "Not approved",
};

const activeParticipationStatuses = new Set<ParticipationStatus>([
  "pending",
  "accepted",
  "attended",
  "no_show",
]);

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

function typeLabel(type: EventType | null) {
  return type ? typeLabels[type] : "Community";
}

function plural(value: number, singular: string, pluralValue = `${singular}s`) {
  return value === 1 ? singular : pluralValue;
}

function monthShift(month: string, offset: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const index = year * 12 + monthNumber - 1 + offset;
  const nextYear = Math.floor(index / 12);
  const nextMonth = (index % 12) + 1;
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
}

function monthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return `${[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthNumber - 1]} ${year}`;
}

function datePanelLabel(dateKey: string) {
  const [year, monthNumber, day] = dateKey.split("-").map(Number);
  return `${[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthNumber - 1]} ${day}, ${year}`;
}

function participationClass(status: ParticipationStatus) {
  if (status === "attended") return styles.statusAttended;
  if (status === "no_show") return styles.statusNoShow;
  if (status === "cancelled" || status === "rejected") {
    return styles.statusCancelled;
  }
  return styles.statusRegistered;
}

export function MemberPortalExperience({
  name,
  view,
  data,
}: {
  name: string;
  view: MemberPortalView;
  data: MemberPortalData;
}) {
  const activeParticipations = useMemo(
    () =>
      data.participations.filter((item) =>
        activeParticipationStatuses.has(item.status),
      ),
    [data.participations],
  );
  const registeredIds = useMemo(
    () => new Set(activeParticipations.map((item) => item.eventId)),
    [activeParticipations],
  );
  const upcomingMine = useMemo(
    () =>
      activeParticipations
        .filter(
          (item) =>
            item.event &&
            item.event.status === "published" &&
            item.event.startsAt >= data.asOf,
        )
        .sort((a, b) =>
          (a.event?.startsAt ?? "").localeCompare(b.event?.startsAt ?? ""),
        ),
    [activeParticipations, data.asOf],
  );

  if (view === "my-events") {
    return <MyEventsCalendar participations={activeParticipations} asOf={data.asOf} />;
  }
  if (view === "events") {
    return (
      <EventsDirectory
        events={data.publishedEvents}
        registeredIds={registeredIds}
        asOf={data.asOf}
      />
    );
  }
  if (view === "milestones") {
    return <Milestones participations={activeParticipations} asOf={data.asOf} />;
  }

  const attendedCount = data.participations.filter(
    (item) => item.status === "attended",
  ).length;
  const programmeCount = new Set(
    activeParticipations.map((item) => item.event?.type).filter(Boolean),
  ).size;

  return (
    <div className={styles.page}>
      <section className={styles.welcomeCard}>
        <div className={styles.welcomeCopy}>
          <span className={styles.eyebrowPill}>Member community</span>
          <h1>Welcome back, {firstName(name)}.</h1>
        </div>
        <div className={styles.welcomeMetric}>
          <strong>{attendedCount}</strong>
          <span>{plural(attendedCount, "event")} attended</span>
        </div>
      </section>

      <section className={styles.summaryGrid} aria-label="Your event summary">
        <SummaryCard value={activeParticipations.length} label="event sign-ups" tone="pink" />
        <SummaryCard value={attendedCount} label="events attended" tone="teal" />
        <SummaryCard value={upcomingMine.length} label="upcoming events" tone="blue" />
        <SummaryCard value={programmeCount} label="programmes joined" tone="yellow" />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Your schedule</p>
            <h2>Coming up next.</h2>
          </div>
          <Link href="/portal/my-events">Open My Events →</Link>
        </div>
        {upcomingMine.length > 0 ? (
          <div className={styles.eventRow}>
            {upcomingMine.slice(0, 3).map((item) => (
              <CompactEventCard key={item.eventId} participation={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming events yet"
            body="Browse the published events calendar and choose your next activity."
            href="/portal/events"
            action="Explore events"
          />
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "pink" | "teal" | "blue" | "yellow";
}) {
  return (
    <article className={`${styles.summaryCard} ${styles[tone]}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function PageHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <header className={styles.pageHeading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

function MyEventsCalendar({
  participations,
  asOf,
}: {
  participations: MemberPortalParticipation[];
  asOf: string;
}) {
  const scheduled = useMemo(
    () => participations.filter((item) => item.event !== null),
    [participations],
  );
  const nextDate =
    scheduled
      .filter((item) => (item.event?.startsAt ?? "") >= asOf)
      .sort((a, b) =>
        (a.event?.startsAt ?? "").localeCompare(b.event?.startsAt ?? ""),
      )[0]?.event?.dateKey ??
    scheduled[0]?.event?.dateKey ??
    asOf.slice(0, 10);
  const [visibleMonth, setVisibleMonth] = useState(nextDate.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(nextDate);
  const eventsByDate = useMemo(
    () =>
      scheduled.reduce<Record<string, MemberPortalParticipation[]>>(
        (groups, item) => {
          const date = item.event?.dateKey;
          if (date) (groups[date] ??= []).push(item);
          return groups;
        },
        {},
      ),
    [scheduled],
  );
  const [year, monthNumber] = visibleMonth.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
  const selectedEvents = eventsByDate[selectedDate] ?? [];

  function moveMonth(offset: number) {
    const next = monthShift(visibleMonth, offset);
    setVisibleMonth(next);
    setSelectedDate(`${next}-01`);
  }

  return (
    <div className={styles.page}>
      <PageHeading
        eyebrow="My schedule"
        title="My Events."
        body="Choose a date to see the events connected to your account."
      />
      <div className={styles.calendarLayout}>
        <section className={styles.calendarCard} aria-label="Member events calendar">
          <div className={styles.calendarHeader}>
            <h2>{monthLabel(visibleMonth)}</h2>
            <div>
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month">←</button>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Next month">→</button>
            </div>
          </div>
          <div className={styles.weekdays} aria-hidden="true">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className={styles.dayGrid}>
            {Array.from({ length: firstWeekday }, (_, index) => <span key={`blank-${index}`} />)}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const dateKey = `${visibleMonth}-${String(day).padStart(2, "0")}`;
              const dayEvents = eventsByDate[dateKey] ?? [];
              const selected = selectedDate === dateKey;
              return (
                <button
                  type="button"
                  key={dateKey}
                  className={selected ? styles.daySelected : undefined}
                  aria-pressed={selected}
                  aria-label={`${datePanelLabel(dateKey)}, ${dayEvents.length} signed-up ${plural(dayEvents.length, "event")}`}
                  onClick={() => setSelectedDate(dateKey)}
                >
                  <span>{day}</span>
                  {dayEvents.length > 0 ? (
                    <i aria-hidden="true">{dayEvents.length}</i>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <aside className={styles.dayPanel} aria-live="polite">
          <p className={styles.eyebrow}>Chosen day</p>
          <h2>{datePanelLabel(selectedDate)}</h2>
          {selectedEvents.length > 0 ? (
            <div className={styles.dayEventList}>
              {selectedEvents.map((item) => (
                <CompactEventCard key={item.eventId} participation={item} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyDay}>You have no signed-up events on this day.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function EventsDirectory({
  events,
  registeredIds,
  asOf,
}: {
  events: MemberPortalEvent[];
  registeredIds: Set<number>;
  asOf: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<EventType | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const upcoming = useMemo(
    () => events.filter((event) => event.startsAt >= asOf),
    [events, asOf],
  );
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return upcoming.filter((event) => {
      const matchesSearch =
        !needle ||
        event.title.toLowerCase().includes(needle) ||
        typeLabel(event.type).toLowerCase().includes(needle) ||
        (event.location ?? "").toLowerCase().includes(needle);
      return (
        matchesSearch &&
        (!selectedType || event.type === selectedType) &&
        (!dateFrom || event.dateKey >= dateFrom)
      );
    });
  }, [upcoming, search, selectedType, dateFrom]);

  return (
    <div className={styles.page}>
      <PageHeading
        eyebrow="Get involved"
        title="Upcoming Events."
        body="Find a published activity that fits your schedule and register your place."
      />
      <div className={styles.filters}>
        <label className={styles.searchField}>
          <span className={styles.visuallyHidden}>Search events</span>
          <input
            type="search"
            value={search}
            placeholder="Search by event name, programme or location"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          <span className={styles.visuallyHidden}>Earliest event date</span>
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
        </label>
        <label>
          <span className={styles.visuallyHidden}>Programme</span>
          <select value={selectedType} onChange={(event) => setSelectedType(event.target.value as EventType | "")}>
            <option value="">All programmes</option>
            <option value="sport">Sport</option>
            <option value="nutrition">Nutrition</option>
            <option value="family_support">Family support</option>
          </select>
        </label>
        {search || dateFrom || selectedType ? (
          <button type="button" onClick={() => { setSearch(""); setDateFrom(""); setSelectedType(""); }}>Clear</button>
        ) : null}
      </div>
      <p className={styles.resultCount}>{filtered.length} {plural(filtered.length, "event")} available</p>
      {filtered.length > 0 ? (
        <div className={styles.eventGrid}>
          {filtered.map((event) => (
            <DirectoryEventCard
              key={event.id}
              event={event}
              signedUp={registeredIds.has(event.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No events match your filters" body="Try a different programme, date or search term." />
      )}
    </div>
  );
}

function DirectoryEventCard({ event, signedUp }: { event: MemberPortalEvent; signedUp: boolean }) {
  return (
    <article className={styles.directoryCard}>
      <div className={styles.eventMedia}>
        {event.image ? <img src={event.image} alt="" /> : <span aria-hidden="true">21</span>}
        <span className={styles.typePill} data-type={event.type ?? "community"}>{typeLabel(event.type)}</span>
        {signedUp ? <span className={styles.signedPill}>✓ Registered</span> : null}
      </div>
      <div className={styles.directoryBody}>
        <h2>{event.title}</h2>
        <div className={styles.eventMeta}>
          <span>◷ {event.dateLabel} · {event.timeLabel}</span>
          {event.location ? (
            event.locationLink ? <a href={event.locationLink} target="_blank" rel="noreferrer">⌖ {event.location}</a> : <span>⌖ {event.location}</span>
          ) : null}
        </div>
        {event.description ? <p>{event.description}</p> : null}
        <div className={styles.signupArea}>
          <EventSignupButton eventId={event.id} locale="en" sessionRole="member" signedUp={signedUp} />
        </div>
      </div>
    </article>
  );
}

function Milestones({
  participations,
  asOf,
}: {
  participations: MemberPortalParticipation[];
  asOf: string;
}) {
  const attended = participations.filter((item) => item.status === "attended");
  const noShows = participations.filter((item) => item.status === "no_show");
  const recordedAttendance = attended.length + noShows.length;
  const attendanceRate = recordedAttendance
    ? Math.round((attended.length / recordedAttendance) * 100)
    : 0;
  const programmeCounts = (["sport", "nutrition", "family_support"] as EventType[]).map((type) => ({
    type,
    count: participations.filter((item) => item.event?.type === type).length,
  }));
  const maxProgrammeCount = Math.max(1, ...programmeCounts.map((item) => item.count));
  const currentMonth = asOf.slice(0, 7);
  const activityMonths = Array.from({ length: 6 }, (_, index) => monthShift(currentMonth, index - 5));
  const monthlyCounts = activityMonths.map((month) => ({
    month,
    count: participations.filter((item) => item.event?.dateKey.startsWith(month)).length,
  }));
  const maxMonthlyCount = Math.max(1, ...monthlyCounts.map((item) => item.count));
  const milestones = [
    { target: 1, title: "First event" },
    { target: 5, title: "Community regular" },
    { target: 10, title: "Ten events together" },
    { target: 20, title: "Participation champion" },
  ];

  return (
    <div className={styles.page}>
      <PageHeading
        eyebrow="Your participation"
        title="Milestones."
        body="A database-backed view of the activities connected to your member account."
      />
      <section className={styles.milestoneSummary}>
        <div>
          <span>Events attended</span>
          <strong>{attended.length}</strong>
        </div>
        <div>
          <span>Recorded attendance rate</span>
          <strong>{attendanceRate}%</strong>
          <i style={{ "--progress": `${attendanceRate}%` } as React.CSSProperties} />
        </div>
        <div>
          <span>Total event sign-ups</span>
          <strong>{participations.length}</strong>
        </div>
      </section>

      <div className={styles.insightGrid}>
        <section className={styles.insightCard}>
          <p className={styles.eyebrow}>Programme mix</p>
          <h2>Your participation by programme.</h2>
          <div className={styles.barList}>
            {programmeCounts.map((item) => (
              <div key={item.type}>
                <span>{typeLabel(item.type)} <b>{item.count}</b></span>
                <i><b style={{ width: `${(item.count / maxProgrammeCount) * 100}%` }} /></i>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.insightCard}>
          <p className={styles.eyebrow}>Recent activity</p>
          <h2>Sign-ups over six months.</h2>
          <div className={styles.columnChart}>
            {monthlyCounts.map((item) => (
              <div key={item.month}>
                <span>{item.count}</span>
                <i style={{ height: `${Math.max(4, (item.count / maxMonthlyCount) * 100)}%` }} />
                <b>{item.month.slice(5)}</b>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Participation journey</p>
            <h2>Moments worth celebrating.</h2>
          </div>
        </div>
        <div className={styles.badgeGrid}>
          {milestones.map((milestone) => {
            const earned = attended.length >= milestone.target;
            return (
              <article key={milestone.target} className={earned ? styles.badgeEarned : styles.badgeLocked}>
                <span aria-hidden="true">{earned ? "★" : "○"}</span>
                <strong>{milestone.title}</strong>
                <p>{earned ? "Earned" : `${attended.length} of ${milestone.target} attended`}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CompactEventCard({ participation }: { participation: MemberPortalParticipation }) {
  const event = participation.event;
  if (!event) return null;
  return (
    <article className={styles.compactCard}>
      <div className={styles.compactTopline}>
        <span className={styles.typePill} data-type={event.type ?? "community"}>{typeLabel(event.type)}</span>
        <span className={`${styles.statusPill} ${participationClass(participation.status)}`}>{statusLabels[participation.status]}</span>
      </div>
      <h3>{event.title}</h3>
      <p>◷ {event.dateLabel} · {event.timeLabel}</p>
      {event.location ? <p>⌖ {event.location}</p> : null}
    </article>
  );
}

function EmptyState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className={styles.emptyState}>
      <span aria-hidden="true">♡</span>
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
        {href && action ? <Link href={href}>{action} →</Link> : null}
      </div>
    </div>
  );
}
