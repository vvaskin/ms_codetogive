export function isStaffRole(role: unknown): role is "staff" {
  return role === "staff";
}
