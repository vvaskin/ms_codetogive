import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

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

  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
