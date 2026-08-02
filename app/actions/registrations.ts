"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isContributorRole } from "@/lib/roles";
import { VOLUNTEER_INTEREST_VALUES } from "@/lib/volunteer-interests";

export interface RegisterForEventInput {
  eventId: number;
  /** Contributors only — the role they want for this event. */
  interest?: string | null;
  /** Guests only — required when the visitor is logged out. */
  guestName?: string | null;
  guestEmail?: string | null;
}

export interface RegisterForEventResult {
  ok: boolean;
  error?: string;
  /** Which sign-up path was taken. */
  mode?: "contributor" | "member" | "guest";
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Signs a visitor up for an event.
 *
 * - Authenticated contributors pick an interest; their row stores user_id + interest.
 * - Authenticated members sign up under their own account (no interest).
 * - Logged-out guests provide a name + email; their row stores guest_name +
 *   guest_email with user_id NULL (no account is created).
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

  if (user) {
    const [{ data: profile }, { data: application }] = await Promise.all([
      supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("volunteer_applications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    const isContributor = isContributorRole(profile?.role);

    // Contributors must have an approved application before they can sign up
    // for events — mirroring the UI gate on the event buttons.
    if (isContributor && application?.status !== "approved") {
      return {
        ok: false,
        error:
          "Apply to be a volunteer in your portal before signing up for events.",
      };
    }

    const interest = isContributor ? normalizeInterest(input.interest) : null;

    const { error } = await supabase
      .from("event_participations")
      .upsert(
        {
          user_id: user.id,
          event_id: input.eventId,
          interest,
          status: "registered",
        },
        { onConflict: "user_id,event_id" },
      );

    if (error) return { ok: false, error: error.message };

    revalidatePath("/portal/events");
    return { ok: true, mode: isContributor ? "contributor" : "member" };
  }

  // Guest: store name + email directly (no account is created).
  const name = input.guestName?.trim();
  const email = input.guestEmail?.trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!email) return { ok: false, error: "Please enter your email." };
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("event_guest_signups")
    .upsert(
      {
        event_id: input.eventId,
        guest_name: name,
        guest_email: email,
        interest: null,
        status: "registered",
      },
      { onConflict: "guest_email,event_id" },
    );

  if (error) return { ok: false, error: error.message };

  revalidatePath("/portal/events");
  return { ok: true, mode: "guest" };
}

function normalizeInterest(interest: string | null | undefined): string | null {
  if (!interest) return null;
  const value = VOLUNTEER_INTEREST_VALUES.find(
    (option) => option === interest,
  );
  return value ?? null;
}