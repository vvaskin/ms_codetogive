"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";
import type { Database } from "./types";

/**
 * Supabase client for use inside client components.
 * Safe to call repeatedly — `createBrowserClient` reuses one instance.
 */
export function createClient() {
  const { url, anonKey } = supabaseEnv();
  // the anon key is safe to ship to the browser — rls scopes every query to the signed-in user
  return createBrowserClient<Database>(url, anonKey);
}
