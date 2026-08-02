/**
 * Reads the public Supabase env vars, failing with an actionable message when
 * they are missing (the most common setup mistake).
 */
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // NEXT_PUBLIC_ vars are inlined into the client bundle, so both must stay non-secret by design
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example), " +
        "then restart the dev server.",
    );
  }

  return { url, anonKey };
}
