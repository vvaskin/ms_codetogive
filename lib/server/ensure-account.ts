import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/roles";

interface EnsureAccountInput {
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  /** App origin (e.g. https://example.com) for the set-password redirect. */
  origin: string;
}

interface EnsureAccountResult {
  userId: string;
  created: boolean;
  /** Set-password link, when a new account was created (dev/logging aid). */
  setPasswordLink?: string;
}

/**
 * Finds a Supabase auth user by email, or creates one for a guest checkout.
 * A newly created account has no password — we email a "set password"
 * (recovery) link so the guest can access their portal later.
 *
 * Runs with the service-role client, so it bypasses RLS. Never call from the
 * browser — only from server actions / route handlers.
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

  // Look for an existing account first (idempotent for repeat guests).
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return { userId: existing, created: false };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    // Guests are trusted at checkout; skip the confirmation email.
    email_confirm: true,
    user_metadata: { name: name.trim(), role, ...(phone ? { phone } : {}) },
  });

  if (error || !data.user) {
    // Handle the race where the user was created between our lookup and insert.
    const raced = await findUserByEmail(normalizedEmail);
    if (raced) return { userId: raced, created: false };
    throw new Error(error?.message ?? "Could not create the guest account.");
  }

  const userId = data.user.id;

  // Store the phone on the profile too (metadata isn't queried by the app).
  if (phone) {
    await admin.from("users").update({ phone_number: phone }).eq("id", userId);
  }

  // Email a link the guest can use to set a password and reach their portal.
  const { data: linkData } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: normalizedEmail,
    options: { redirectTo: `${origin}/auth/callback?next=/portal` },
  });

  return {
    userId,
    created: true,
    setPasswordLink: linkData?.properties?.action_link,
  };
}

async function findUserByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  // listUsers is paged; scan a few pages for the email. Fine at this scale.
  for (let page = 1; page <= 5; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data.users.length) break;
    const match = data.users.find(
      (u) => u.email?.toLowerCase() === email,
    );
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}
