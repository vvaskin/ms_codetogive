import type { Metadata } from "next";
import { VolunteerEventsFeed } from "@/components/VolunteerEventsFeed";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Volunteer at an event",
  description:
    "Browse upcoming Love 21 activities and sign up to volunteer — no account needed.",
};

export default async function VolunteerEventsPage() {
  const supabase = await createClient();

  const [{ data: events }, { data: userData }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, date, type, subtype, location, location_link")
      .order("date", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  // Admin-only prototype events may omit the legacy calendar category/date.
  // Keep this existing public feed limited to its original event shape.
  const feedEvents = (events ?? []).flatMap((event) =>
    event.date && event.type
      ? [{ ...event, date: event.date, type: event.type }]
      : [],
  );

  return (
    <VolunteerEventsFeed
      events={feedEvents}
      isGuest={!userData.user}
    />
  );
}
