import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VolunteerSignupForm } from "@/components/VolunteerSignupForm";
import { WithdrawApplicationButton } from "@/components/portal/WithdrawApplicationButton";
import { formatDayMonthYear } from "@/lib/format-date";
import { getVolunteerApplication } from "@/lib/server/volunteer-application";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "My volunteering",
  description: "Track your volunteer application and volunteering activity.",
};

export default async function MyVolunteeringPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login?next=/portal/volunteering");
  if (profile.role !== "contributor") redirect("/portal");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/portal/volunteering");

  const application = await getVolunteerApplication(user.id, supabase);
  const status = application?.status ?? null;

  return (
    <div className="portal-subpage">
      <header className="portal-subpage-head">
        <p className="eyebrow">VOLUNTEER WITH US</p>
        <h1>My volunteering</h1>
        <p>Track your volunteer application and volunteering activity.</p>
      </header>

      {status === null && (
        <section className="portal-card">
          <h2>Volunteer with Love 21</h2>
          <p>
            Help with classes, activities, and events. Submit an application
            below — a staff member will review it and let you know.
          </p>
          <VolunteerSignupForm />
        </section>
      )}

      {status === "submitted" && application && (
        <section className="portal-card">
          <h2>Application received</h2>
          <p>
            Submitted on{" "}
            {application.submitted_at
              ? formatDayMonthYear(application.submitted_at.slice(0, 10), "T00:00:00")
              : "—"}
            . A staff member will review your application shortly.
          </p>
          <WithdrawApplicationButton />
        </section>
      )}

      {status === "under_review" && (
        <section className="portal-card">
          <h2>Under review</h2>
          <p>Staff is reviewing your application. You&apos;ll hear back soon.</p>
          <WithdrawApplicationButton />
        </section>
      )}

      {status === "approved" && (
        <ApprovedVolunteerActivity />
      )}

      {status === "rejected" && application && (
        <section className="portal-card">
          <h2>Application not approved</h2>
          {application.rejection_reason_visible && application.rejection_reason ? (
            <p>
              <strong>Reason:</strong> {application.rejection_reason}
            </p>
          ) : (
            <p>Thanks for applying — you were not approved this time.</p>
          )}
          <p>You can submit a new application if you&apos;d like to try again.</p>
          <NewApplicationForm />
        </section>
      )}

      {status === "withdrawn" && (
        <section className="portal-card">
          <h2>Application withdrawn</h2>
          <p>Your application was withdrawn. You can submit a new one below.</p>
          <NewApplicationForm />
        </section>
      )}
    </div>
  );
}

function NewApplicationForm() {
  return (
    <details style={{ marginTop: "1.5rem" }}>
      <summary style={{ cursor: "pointer" }}>Apply again</summary>
      <div style={{ marginTop: "1rem" }}>
        <VolunteerSignupForm />
      </div>
    </details>
  );
}

async function ApprovedVolunteerActivity() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: participations } = await supabase
    .from("event_participations")
    .select("id, event_id, interest, status, created_at, events(title, starts_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="portal-card">
      <h2>You&apos;re an approved volunteer 🎉</h2>
      <p>
        Browse volunteer events to sign up and pick your interest — Coach,
        Class Assistant, or Event Helper.
      </p>
      <p>
        <Link href="/volunteer-events" className="cta">
          Browse volunteer events ➜
        </Link>
      </p>

      <h3 style={{ marginTop: "2rem" }}>My volunteer sign-ups</h3>
      {(!participations || participations.length === 0) ? (
        <p className="impact-empty">No sign-ups yet.</p>
      ) : (
        <ul>
          {participations.map((p) => {
            const eventTitle = Array.isArray(p.events)
              ? p.events[0]?.title
              : p.events?.title;
            const startsAt = Array.isArray(p.events)
              ? p.events[0]?.starts_at
              : p.events?.starts_at;
            return (
              <li key={p.id}>
                <strong>{eventTitle ?? "Event"}</strong>
                {startsAt ? ` — ${formatDayMonthYear(startsAt.slice(0, 10), "T00:00:00")}` : ""}
                {p.interest ? ` · ${p.interest}` : ""}
                {" · "}
                <em>{p.status}</em>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
