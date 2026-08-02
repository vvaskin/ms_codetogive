import type { Metadata } from "next";
import { VolunteerEventsFeed } from "@/components/VolunteerEventsFeed";
import type { Locale } from "@/content/site-data";
import {
  getVolunteerApplication,
  isApprovedVolunteer,
} from "@/lib/server/volunteer-application";
import { getSessionProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Volunteer at an event",
  description:
    "Browse upcoming Love 21 activities and sign up to volunteer — no account needed.",
};

function pickLocale(raw: string | undefined): Locale {
  return raw === "zh" || raw === "cn" ? raw : "en";
}

export default async function VolunteerEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const supabase = await createClient();

  const nowIso = new Date().toISOString();

  const [{ data: events }, profile] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, title, title_zh, title_cn, starts_at, ends_at, type, subtype, location, location_zh, location_cn, location_link, status",
      )
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    getSessionProfile(),
  ]);

  let registeredEventIds: number[] = [];
  let approvedVolunteer = false;
  if (profile) {
    const [{ data: participations }, application] = await Promise.all([
      supabase
        .from("event_participations")
        .select("event_id")
        .eq("user_id", profile.id),
      getVolunteerApplication(profile.id, supabase),
    ]);
    registeredEventIds = (participations ?? []).map((row) => row.event_id);
    approvedVolunteer = isApprovedVolunteer(application);
  }

  const { lang } = await searchParams;
  const locale = pickLocale(lang);

  return (
    <VolunteerEventsFeed
      events={events ?? []}
      sessionRole={profile && profile.role !== "staff" ? profile.role : null}
      isApprovedVolunteer={approvedVolunteer}
      registeredEventIds={registeredEventIds}
      locale={locale}
      volunteerApproved={volunteerApproved}
    />
  );
}
