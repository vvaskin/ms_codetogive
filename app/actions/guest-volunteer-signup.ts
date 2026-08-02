"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { findUserByEmail, normalizeEmail, normalizePhone } from "@/lib/server/account-lookup";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { uploadVolunteerDocument } from "@/lib/server/upload-volunteer-document";
import { VOLUNTEER_INTEREST_VALUES } from "@/lib/volunteer-interests";

const ALLOWED_AGE_GROUPS = new Set(["14-15", "16-17", "18+"]);
const ALLOWED_GENDERS = new Set(["Female", "Male", "Prefer not to say"]);
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export interface SubmitGuestVolunteerSignupInput {
  eventId: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  interest: string;
  ageGroup: string;
  gender: string;
  referralSource: string;
  bio?: string | null;
  chineseName?: string | null;
  scrcFile?: File | null;
  parentalConsentFile?: File | null;
  locale: "en" | "zh" | "cn";
  returnPath: string;
}

export type SubmitGuestVolunteerSignupResult =
  | { ok: true; outcome: "existing_account"; redirectTo: string }
  | { ok: true; outcome: "created" }
  | { ok: false; error: string };

/**
 * Creates a `contributor` account for a logged-out visitor applying to
 * volunteer for a specific event, and immediately records their volunteer
 * application (submitted) and event request (pending staff review).
 *
 * Runs entirely server-side with the service-role client — there's no user
 * session at this point, so the caller must sign in with the email/password
 * it just collected (via the browser Supabase client) to establish one.
 */
export async function submitGuestVolunteerSignup(
  input: SubmitGuestVolunteerSignupInput,
): Promise<SubmitGuestVolunteerSignupResult> {
  const ip = await callerIp();
  if (!checkRateLimit(`guest-vol-signup:${ip}`, RATE_LIMIT)) {
    return {
      ok: false,
      error: "Too many attempts. Please try again in a few minutes.",
    };
  }

  const name = input.name?.trim();
  const email = input.email?.trim();
  const phone = input.phone?.trim();
  const password = input.password ?? "";

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (!phone) return { ok: false, error: "Please enter your phone number." };
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const ageGroup = input.ageGroup?.trim();
  const gender = input.gender?.trim();
  const referral = input.referralSource?.trim();
  const interest = input.interest?.trim();

  if (!ageGroup || !ALLOWED_AGE_GROUPS.has(ageGroup)) {
    return { ok: false, error: "Please choose your age group." };
  }
  if (!gender || !ALLOWED_GENDERS.has(gender)) {
    return { ok: false, error: "Please choose your gender." };
  }
  if (!referral) {
    return { ok: false, error: "Please tell us how you heard about us." };
  }
  if (!interest || !VOLUNTEER_INTEREST_VALUES.includes(interest as never)) {
    return { ok: false, error: "Please choose which role you'd like." };
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

  if (!Number.isInteger(input.eventId) || input.eventId < 1) {
    return { ok: false, error: "Invalid event." };
  }

  const admin = createAdminClient();
  const { data: event, error: eventError } = await admin
    .from("events")
    .select("id, status")
    .eq("id", input.eventId)
    .maybeSingle();
  if (eventError || !event || event.status !== "published") {
    return { ok: false, error: "That event is no longer available." };
  }

  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  const existingUserId = await findUserByEmail(normalizedEmail);
  if (existingUserId) {
    return {
      ok: true,
      outcome: "existing_account",
      redirectTo: buildLoginRedirect(input.locale, input.returnPath),
    };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
    email_confirm: true,
    phone_confirm: true,
    user_metadata: { name, role: "contributor", phone: normalizedPhone },
  });

  if (createError || !created.user) {
    const raced = await findUserByEmail(normalizedEmail);
    if (raced) {
      // Someone else's request won the create race for this email — treat
      // this submission as hitting an existing account.
      return {
        ok: true,
        outcome: "existing_account",
        redirectTo: buildLoginRedirect(input.locale, input.returnPath),
      };
    }
    return {
      ok: false,
      error: createError?.message ?? "Could not create your account.",
    };
  }
  const userId = created.user.id;

  await admin.from("users").update({ phone_number: normalizedPhone }).eq("id", userId);

  let scrcPath: string | null = null;
  let parentalConsentPath: string | null = null;
  try {
    if (isAdult && input.scrcFile) {
      scrcPath = await uploadVolunteerDocument(userId, "scrc", input.scrcFile);
    }
    if (isMinor && input.parentalConsentFile) {
      parentalConsentPath = await uploadVolunteerDocument(
        userId,
        "parental-consent",
        input.parentalConsentFile,
      );
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  const bioWithChineseName = input.chineseName?.trim()
    ? [`Chinese name: ${input.chineseName.trim()}`, input.bio?.trim() || undefined]
        .filter(Boolean)
        .join("\n")
    : input.bio?.trim() || null;

  const { error: applicationError } = await admin.from("volunteer_applications").insert({
    user_id: userId,
    status: "submitted",
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
  });
  if (applicationError) {
    return { ok: false, error: applicationError.message };
  }

  const { error: participationError } = await admin.from("event_participations").insert({
    user_id: userId,
    event_id: input.eventId,
    interest,
    status: "pending",
  });
  if (participationError) {
    return { ok: false, error: participationError.message };
  }

  return { ok: true, outcome: "created" };
}

async function callerIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

function buildLoginRedirect(
  locale: "en" | "zh" | "cn",
  returnPath: string,
): string {
  const loginPath =
    locale === "zh"
      ? "/zh/login-hk"
      : locale === "cn"
        ? "/cn/login-hk"
        : "/login";
  const safeReturn =
    returnPath.startsWith("/") && !returnPath.startsWith("//")
      ? returnPath
      : "/";
  const params = new URLSearchParams({
    next: safeReturn,
    notice: "account_exists",
  });
  return `${loginPath}?${params.toString()}`;
}
