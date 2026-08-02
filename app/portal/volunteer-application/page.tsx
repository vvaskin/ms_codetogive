import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VolunteerApplicationForm } from "@/components/portal/VolunteerApplicationForm";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/profile";
import type { VolunteerApplicationRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Volunteer Application",
  description: "Complete your Love 21 volunteer application.",
};

const STATUS_NOTES: Record<string, string> = {
  submitted: "Your application is under review.",
  under_review: "Your application is being reviewed by our team.",
  approved: "Your application has been approved.",
  rejected: "Your application was not approved.",
  withdrawn: "Your application was withdrawn.",
};

export default async function VolunteerApplicationPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/volunteer-application");
  if (profile.role !== "contributor") redirect("/portal");

  const supabase = await createClient();
  const { data: application } = await supabase
    .from("volunteer_applications")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle<VolunteerApplicationRow>();

  const status = application?.status ?? null;
  const showForm = !status || status === "registered" || status === "rejected";

  return (
    <div className="portal-subpage">
      <header className="portal-subpage-head">
        <p className="eyebrow">VOLUNTEERING</p>
        <h1>Volunteer Application</h1>
        <p>
          {showForm
            ? "Complete your application so we can match you with volunteering opportunities."
            : (status && STATUS_NOTES[status]) ||
              "Your application is being reviewed."}
        </p>
      </header>

      {status === "approved" && (
        <section
          className="profile-saved"
          style={{ marginBottom: "18px" }}
        >
          <p>
            Welcome to the Love 21 volunteering team! You can now sign up for
            events from the{" "}
            <Link href="/portal/events">My Volunteering</Link> page.
          </p>
        </section>
      )}

      {showForm ? (
        <VolunteerApplicationForm
          application={
            application ?? {
              id: 0,
              user_id: profile.id,
              status: "registered",
              age_group: null,
              gender: null,
              bio: null,
              referral_source: null,
              volunteer_policy_doc: null,
              scrc_check_doc: null,
              submitted_at: null,
              reviewed_at: null,
              reviewed_by: null,
              rejection_reason: null,
              rejection_reason_visible: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          }
        />
      ) : null}
    </div>
  );
}
