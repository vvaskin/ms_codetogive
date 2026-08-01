import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardHead } from "@/components/portal/DashboardHead";
import {
  PortalEventsTabs,
  type MyEvent,
} from "@/components/portal/PortalEventsTabs";
import type { Locale } from "@/content/site-data";
import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/supabase/table-types";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming events and the ones you've signed up for.",
};

const EVENT_COLUMNS =
  "id, title, title_zh, title_cn, description, description_zh, description_cn, image, starts_at, ends_at, date, type, subtype, location, location_zh, location_cn, location_link, status, created_at, updated_at";

function pickLocale(raw: string | undefined): Locale {
  return raw === "zh" || raw === "cn" ? raw : "en";
}

export default async function PortalEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/portal/events");

  // Portal chrome is currently en-only; the ?lang= override lets us render
  // localized event content without waiting on locale-scoped portal routes.
  const { lang } = await searchParams;
  const locale = pickLocale(lang);

  const nowIso = new Date().toISOString();

  const [upcomingResult, mineResult] = await Promise.all([
    supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    // Participations are RLS-scoped to auth.uid(). Deliberately unfiltered
    // by status so a user still sees an event they registered for even if
    // an admin later cancelled it — the card renders a "Cancelled" chip.
    supabase
      .from("event_participations")
      .select(`status, event:events(${EVENT_COLUMNS})`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const upcoming: EventRow[] = upcomingResult.data ?? [];

  const mine: MyEvent[] =
    (mineResult.data ?? [])
      .map((row) => {
        const event = row.event as unknown as EventRow | null;
        if (!event) return null;
        return { event, participationStatus: row.status };
      })
      .filter((v): v is MyEvent => v !== null);

  return (
    <>
      <DashboardHead
        title="Events"
        subtitle="Browse what's coming up and see the events you've signed up for."
      />
      <PortalEventsTabs upcoming={upcoming} mine={mine} locale={locale} />
    </>
  );
}
