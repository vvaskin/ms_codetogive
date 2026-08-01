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

  return (
    <VolunteerEventsFeed
      events={events ?? []}
      isGuest={!userData.user}
    />
  );
}
