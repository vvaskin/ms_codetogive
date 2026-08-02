// Roles a user can *pick* at signup — surfaced in the auth form. Staff is
// assigned manually via Supabase Studio, never through the form.
export const USER_ROLES = ["member", "contributor"] as const;
export type SignupRole = (typeof USER_ROLES)[number];

// Single source of truth for the observable role set — derived from the
// generated Supabase enum so it can never drift from the database.
export type { UserRole } from "@/lib/supabase/types";
// the re-export above serves consumers; this local import is what types the
// runtime ALL_ROLES list below, so both stay pinned to the generated enum
import type { UserRole } from "@/lib/supabase/types";

const ALL_ROLES: readonly UserRole[] = ["member", "contributor", "staff"];

export function isUserRole(value: unknown): value is UserRole {
  // widening to a plain string list lets .includes accept arbitrary input; the
  // literal tuple type would reject any value that has not passed the guard yet
  return typeof value === "string" && (ALL_ROLES as readonly string[]).includes(value);
}

export function isSignupRole(value: unknown): value is SignupRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}
