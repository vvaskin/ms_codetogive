// Roles a user can *pick* at signup — surfaced in the auth form.
export const USER_ROLES = ["member", "donor", "volunteer"] as const;
export type SignupRole = (typeof USER_ROLES)[number];

// Roles the app can *observe* on a profile. Wider than SignupRole because
// staff is assigned manually via Supabase Studio, not through the form.
// Mirrors the `user_role` enum in the database.
export type UserRole = SignupRole | "staff";

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES.includes(value as SignupRole) || value === "staff")
  );
}

export function isSignupRole(value: unknown): value is SignupRole {
  return typeof value === "string" && USER_ROLES.includes(value as SignupRole);
}
