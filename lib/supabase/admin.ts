import "server-only";

import {
  createClient as createSupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { isStaffRole } from "@/lib/admin";
import { createClient as createServerClient } from "./server";
import type { Database } from "./types";

export type AdminAuthState = {
  user: User | null;
  isStaff: boolean;
};

/**
 * Verifies the cookie-backed user and reads their own RLS-protected profile.
 * The database role is authoritative; user-controlled auth metadata is never
 * trusted for staff access.
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

  if (profileError) throw new Error("Unable to verify staff access.");

  return {
    user,
    isStaff: isStaffRole(profile?.role),
  };
}

/**
 * Admin Supabase client using the service-role key. It BYPASSES Row Level
 * Security, so it must only ever run on the server (the `server-only` import
 * throws if this module is pulled into a client bundle). Use it for trusted
 * actions like creating guest accounts.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Admin Supabase client needs NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in the environment.",
    );
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: {
      // a service client holds no user session, so the browser-oriented session machinery stays off
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
