// the staff check lives in exactly one place so the "staff" literal cannot
// drift across admin guards
export function isStaffRole(role: unknown): role is "staff" {
  return role === "staff";
}
