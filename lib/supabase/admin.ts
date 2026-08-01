import { createClient as createSupabaseClient, type User } from "@supabase/supabase-js";
import { isStaffRole } from "@/lib/admin";
import { supabaseEnv } from "./env";
import { createClient as createServerClient } from "./server";
import type { Database } from "./types";

export type AdminAuthState = {
  user: User | null;
  isStaff: boolean;
};

/**
 * Authenticates the current cookie-backed user, then checks the caller's own
 * RLS-protected profile. The database profile role is the staff source of
 * truth; signup must never be allowed to assign that role.
 */
export async function getAdminAuthState(): Promise<AdminAuthState> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { user: null, isStaff: false };

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("Unable to verify staff access.");
  }

  // The checked-in database types may temporarily lag an additive `staff`
  // enum migration, so narrow the runtime value instead of asserting it as a
  // public signup role.
  const profileRole = (profile as { role?: unknown } | null)?.role;

  return {
    user,
    isStaff: isStaffRole(profileRole),
  };
}

/**
 * Service-role client for staff-only server components and server actions.
 * Never import this module from a Client Component.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("The Supabase admin client is server-only.");
  }

  const { url } = supabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Supabase admin access is not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
