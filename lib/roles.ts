// Roles the public signup form offers (donor + volunteer merged into
// contributor). The auth form maps over this list.
export const PUBLIC_SIGNUP_ROLES = ["member", "contributor"] as const;
export type PublicSignupRole = (typeof PUBLIC_SIGNUP_ROLES)[number];

// Alias kept for admin code that still references a signup role set.
export type SignupRole = PublicSignupRole;

// Roles the app can *observe* on a profile. Mirrors the `user_role` enum in
// the database (member | contributor | staff).
export type UserRole = "member" | "contributor" | "staff";

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (value === "member" || value === "contributor" || value === "staff")
  );
}

export function isSignupRole(value: unknown): value is SignupRole {
  return (
    typeof value === "string" &&
    PUBLIC_SIGNUP_ROLES.includes(value as PublicSignupRole)
  );
}

export function isContributorRole(role: UserRole | string | null | undefined): boolean {
  return role === "contributor";
}

// Maps arbitrary signup links (including legacy `?role=donor|volunteer`) to a
// valid signup role; everything that is not explicitly a member becomes a
// contributor.
export function normalizeSignupRole(
  value: string | undefined | null,
): PublicSignupRole {
  return value === "member" ? "member" : "contributor";
}
