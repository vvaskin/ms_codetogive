import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Best-effort E.164 normaliser: strips whitespace, dashes and parentheses.
 * Assumes Hong Kong (`+852`) when the input has no country code. Not a
 * full-blown validator — Supabase's phone provider will still reject bad
 * numbers.
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  return `+852${cleaned}`;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Case-insensitive email lookup against the Supabase auth users. Pages through
 * `listUsers` (Supabase admin SDK has no direct "find by email" verb).
 */
export async function findUserByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const target = email.toLowerCase();
  for (let page = 1; page <= 5; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data.users.length) break;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}
