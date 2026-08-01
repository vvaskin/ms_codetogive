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
  return createBrowserClient<Database>(url, anonKey);
}
