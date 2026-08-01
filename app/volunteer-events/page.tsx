import type { Metadata } from "next";
import { VolunteerEventsFeed } from "@/components/VolunteerEventsFeed";
import type { Locale } from "@/content/site-data";
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

  const [{ data: events }, { data: userData }] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, title, title_zh, title_cn, starts_at, ends_at, type, subtype, location, location_zh, location_cn, location_link, status",
      )
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const { lang } = await searchParams;
  const locale = pickLocale(lang);

  return (
    <VolunteerEventsFeed
      events={events ?? []}
      isGuest={!userData.user}
      locale={locale}
    />
  );
}
