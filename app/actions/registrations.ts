"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getVolunteerApplication,
  isApprovedVolunteer,
} from "@/lib/server/volunteer-application";
import { VOLUNTEER_INTEREST_VALUES } from "@/lib/volunteer-interests";

export interface RegisterForEventInput {
  eventId: number;
  /** Volunteers only — the role they want for this event. */
  interest?: string | null;
}

export interface RegisterForEventResult {
  ok: boolean;
  error?: string;
  /** Which sign-up path was taken. */
  mode?: "volunteer" | "member";
}

/**
 * Signs an authenticated visitor up for an event.
 *
 * - Members store `member` as their participation interest.
 * - Approved contributors may pick a volunteer interest.
 * - Other authenticated contributors sign up without an interest.
 *
 * Logged-out guests take a different path (see
 * `app/actions/guest-volunteer-signup.ts`) — they must submit a volunteer
 * application first, which creates a `contributor` account and lands a
 * `pending` participation row for staff review.
 */
export async function registerForEvent(
  input: RegisterForEventInput,
): Promise<RegisterForEventResult> {
  if (!Number.isInteger(input.eventId) || input.eventId < 1) {
    return { ok: false, error: "Invalid event." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "Please sign in or apply as a volunteer to join this event.",
    };
  }

  const [application, profileResult] = await Promise.all([
    getVolunteerApplication(user.id, supabase),
    supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (profileResult.error || !profileResult.data) {
    return { ok: false, error: "Unable to verify your account role." };
  }

  const approvedVolunteer = isApprovedVolunteer(application);
  const isMember = profileResult.data.role === "member";
  const interest = isMember
    ? "member"
    : approvedVolunteer
      ? normalizeInterest(input.interest)
      : null;

  const { error } = await supabase
    .from("event_participations")
    .upsert(
      {
        user_id: user.id,
        event_id: input.eventId,
        interest,
        status: "accepted",
      },
      { onConflict: "user_id,event_id" },
    );

  if (error) return { ok: false, error: error.message };

  revalidatePath("/portal/events");
  revalidatePath("/portal/my-events");
  revalidatePath("/portal/milestones");
  revalidatePath("/portal");
  return {
    ok: true,
    mode: approvedVolunteer && !isMember ? "volunteer" : "member",
  };
}

function normalizeInterest(interest: string | null | undefined): string | null {
  if (!interest) return null;
  const value = VOLUNTEER_INTEREST_VALUES.find(
    (option) => option === interest,
  );
  return value ?? null;
}
