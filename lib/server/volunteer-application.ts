import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  VolunteerApplicationRow,
} from "@/lib/supabase/types";

/**
 * Reads the caller's own volunteer_applications row. RLS restricts this to
 * their own row when `client` is a session-scoped client.
 *
 * Returns `null` when the user has no application (i.e. hasn't started the
 * "apply to volunteer" flow yet). A row with `status = null` is treated as
 * "no application" too — consistent with the column's nullable default.
 */
export async function getVolunteerApplication(
  userId: string,
  client: SupabaseClient<Database>,
): Promise<VolunteerApplicationRow | null> {
  const { data } = await client
    .from("volunteer_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

export function isApprovedVolunteer(
  app: VolunteerApplicationRow | null | undefined,
): boolean {
  return app?.status === "approved";
}

/**
 * True when the applicant has an in-flight submission that should block a
 * second application (per the DB's partial unique index).
 */
export function hasActiveApplication(
  app: VolunteerApplicationRow | null | undefined,
): boolean {
  if (!app || !app.status) return false;
  return app.status !== "rejected" && app.status !== "withdrawn";
}
