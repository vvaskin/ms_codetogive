import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/roles";

interface EnsureAccountInput {
  email: string;
  name: string;
  role: UserRole;
  /**
   * Phone number in E.164 format (e.g. "+85212345678"). REQUIRED for the SMS
   * OTP flow — a guest's set-password message is sent via SMS.
   */
  phone: string;
  /** App origin (e.g. https://example.com), used only for the email fallback. */
  origin: string;
}

interface EnsureAccountResult {
  userId: string;
  created: boolean;
  /**
   * How we notified the guest about their new account:
   * - "sms"      — SMS OTP dispatched (not yet implemented; see TODO)
   * - "email"    — emailed set-password link (current default)
   * - "none"     — the account already existed (no notification sent)
   */
  notifiedVia: "sms" | "email" | "none";
  /** Human-readable non-fatal warning (e.g. SMS attempt failed). */
  warning?: string;
  /** Dev-only aid: the action link for the email path. */
  actionLink?: string;
}

/**
 * Finds a Supabase auth user by email, or creates one for a guest checkout.
 *
 * SMS OTP is the primary channel for the newly-created guest to reach the
 * portal. If the Supabase project doesn't have an SMS provider configured
 * (Auth → Providers → Phone in the dashboard), we fall back to emailing a
 * set-password link so the guest is still reachable.
 *
 * TODO(sms-provider): once Twilio / MessageBird / Vonage / etc. is
 * configured in Supabase Auth → Providers → Phone, the fallback branch
 * will stop firing.
 *
 * Service-role client — bypasses RLS. Never import from the browser.
 */
export async function ensureAccount({
  email,
  name,
  role,
  phone,
  origin,
}: EnsureAccountInput): Promise<EnsureAccountResult> {
  const admin = createAdminClient();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone);

  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return { userId: existing, created: false, notifiedVia: "none" };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    phone: normalizedPhone,
    email_confirm: true,
    phone_confirm: true,
    user_metadata: { name: name.trim(), role, phone: normalizedPhone },
  });

  if (error || !data.user) {
    const raced = await findUserByEmail(normalizedEmail);
    if (raced) return { userId: raced, created: false, notifiedVia: "none" };
    throw new Error(error?.message ?? "Could not create the guest account.");
  }

  const userId = data.user.id;

  // Mirror the phone onto the profile row so app queries can read it.
  await admin
    .from("users")
    .update({ phone_number: normalizedPhone })
    .eq("id", userId);

  // The Supabase JS admin SDK does NOT expose a "send SMS OTP" verb;
  // `admin.generateLink()` only supports email link types. When your project
  // has an SMS provider configured (Auth → Providers → Phone), the client can
  // call `supabase.auth.signInWithOtp({ phone })` to have the guest log in
  // with a 6-digit code — see the follow-up TODO below.
  //
  // Until then, we email the guest a set-password (recovery) link so they
  // still have a way into their account.
  //
  // TODO(sms): once Supabase Auth → Providers → Phone is configured,
  // (a) drop this email fallback here, and (b) after this action returns,
  // have the client call `signInWithOtp({ phone })` to trigger the SMS.
  const emailResult = await admin.auth.admin.generateLink({
    type: "recovery",
    email: normalizedEmail,
    options: { redirectTo: `${origin}/auth/callback?next=/portal` },
  });

  return {
    userId,
    created: true,
    notifiedVia: "email",
    warning: undefined,
    actionLink: emailResult.data?.properties?.action_link,
  };
}

/**
 * Best-effort E.164 normaliser: strips whitespace, dashes and parentheses.
 * Assumes Hong Kong (`+852`) when the input has no country code. Not a
 * full-blown validator — Supabase's phone provider will still reject bad
 * numbers.
 */
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  return `+852${cleaned}`;
}

async function findUserByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  for (let page = 1; page <= 5; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data.users.length) break;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}
