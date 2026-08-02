"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SubmitVolunteerApplicationInput {
  ageGroup?: string | null;
  gender?: string | null;
  bio?: string | null;
  referralSource?: string | null;
  /** Object paths in the `volunteer-applications` bucket, set by the client. */
  volunteerPolicyDoc?: string | null;
  scrcCheckDoc?: string | null;
}

export interface SubmitVolunteerApplicationResult {
  ok: boolean;
  error?: string;
}

/**
 * Submits the contributor's Volunteer Application. The write goes through the
 * SECURITY DEFINER `submit_volunteer_application` function, which verifies the
 * caller owns the row and moves the status to 'submitted' — users can never
 * set their own status to 'approved'.
 */
export async function submitVolunteerApplication(
  input: SubmitVolunteerApplicationInput,
): Promise<SubmitVolunteerApplicationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "You need to be signed in." };

  const { error } = await supabase.rpc("submit_volunteer_application", {
    p_user_id: user.id,
    p_age_group: input.ageGroup?.trim() || undefined,
    p_gender: input.gender?.trim() || undefined,
    p_bio: input.bio?.trim() || undefined,
    p_referral_source: input.referralSource?.trim() || undefined,
    p_volunteer_policy_doc: input.volunteerPolicyDoc || undefined,
    p_scrc_check_doc: input.scrcCheckDoc || undefined,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/portal/volunteer-application");
  revalidatePath("/portal");
  return { ok: true };
}
