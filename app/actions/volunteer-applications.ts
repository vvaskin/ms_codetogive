"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadVolunteerDocument } from "@/lib/server/upload-volunteer-document";
import {
  getVolunteerApplication,
  hasActiveApplication,
} from "@/lib/server/volunteer-application";

export interface SubmitVolunteerApplicationInput {
  ageGroup: string;
  gender: string;
  referralSource: string;
  bio?: string | null;
  chineseName?: string | null;
  scrcFile?: File | null;
  parentalConsentFile?: File | null;
}

export interface SubmitVolunteerApplicationResult {
  ok: boolean;
  error?: string;
}

const ALLOWED_AGE_GROUPS = new Set(["14-15", "16-17", "18+"]);
const ALLOWED_GENDERS = new Set(["Female", "Male", "Prefer not to say"]);

export async function submitVolunteerApplication(
  input: SubmitVolunteerApplicationInput,
): Promise<SubmitVolunteerApplicationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "You must be logged in to apply." };

  const ageGroup = input.ageGroup?.trim();
  const gender = input.gender?.trim();
  const referral = input.referralSource?.trim();

  if (!ageGroup || !ALLOWED_AGE_GROUPS.has(ageGroup)) {
    return { ok: false, error: "Please choose your age group." };
  }
  if (!gender || !ALLOWED_GENDERS.has(gender)) {
    return { ok: false, error: "Please choose your gender." };
  }
  if (!referral) {
    return { ok: false, error: "Please tell us how you heard about us." };
  }

  const isMinor = ageGroup === "14-15" || ageGroup === "16-17";
  const isAdult = ageGroup === "18+";
  if (isAdult && !input.scrcFile) {
    return { ok: false, error: "Please upload your SCRC certificate." };
  }
  if (isMinor && !input.parentalConsentFile) {
    return {
      ok: false,
      error: "Please upload a signed parental / guardian consent form.",
    };
  }

  const existing = await getVolunteerApplication(user.id, supabase);
  if (hasActiveApplication(existing)) {
    return {
      ok: false,
      error:
        "You already have an application in progress. You'll be notified when it's reviewed.",
    };
  }

  const bio = input.bio?.trim() || null;
  const chineseName = input.chineseName?.trim();
  const bioWithChineseName = chineseName
    ? [`Chinese name: ${chineseName}`, bio].filter(Boolean).join("\n")
    : bio;

  let scrcPath: string | null = null;
  let parentalConsentPath: string | null = null;
  try {
    if (isAdult && input.scrcFile) {
      scrcPath = await uploadVolunteerDocument(user.id, "scrc", input.scrcFile);
    }
    if (isMinor && input.parentalConsentFile) {
      parentalConsentPath = await uploadVolunteerDocument(
        user.id,
        "parental-consent",
        input.parentalConsentFile,
      );
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  const payload = {
    user_id: user.id,
    status: "submitted" as const,
    submitted_at: new Date().toISOString(),
    age_group: ageGroup,
    gender,
    referral_source: referral,
    bio: bioWithChineseName,
    scrc_path: scrcPath,
    parental_consent_path: parentalConsentPath,
    reviewed_at: null,
    reviewed_by: null,
    rejection_reason: null,
    rejection_reason_visible: false,
  };

  // If a rejected/withdrawn row exists, update it in place so the partial
  // unique index doesn't complain about a second active row landing next to it.
  const query = existing
    ? supabase
        .from("volunteer_applications")
        .update(payload)
        .eq("id", existing.id)
    : supabase.from("volunteer_applications").insert(payload);

  const { error } = await query;
  if (error) return { ok: false, error: error.message };

  revalidatePath("/portal");
  revalidatePath("/portal/volunteering");
  return { ok: true };
}

export interface WithdrawVolunteerApplicationResult {
  ok: boolean;
  error?: string;
}

export async function withdrawVolunteerApplication(): Promise<WithdrawVolunteerApplicationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be logged in." };

  const existing = await getVolunteerApplication(user.id, supabase);
  if (!existing || !hasActiveApplication(existing)) {
    return { ok: false, error: "No active application to withdraw." };
  }

  const { error } = await supabase
    .from("volunteer_applications")
    .update({ status: "withdrawn" })
    .eq("id", existing.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/portal");
  revalidatePath("/portal/volunteering");
  return { ok: true };
}
