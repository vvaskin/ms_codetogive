"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "./client";
import type { UserRole } from "./types";

/**
 * Current auth user for client components, kept in sync with sign in/out.
 * `loading` is true until the first check resolves.
 */
export function useUser() {
  // SiteChrome renders on public pages too, so a missing/incomplete Supabase
  // config must not crash them — treat it as "signed out".
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;

    const supabase = createClient();
    let active = true;
    let requestVersion = 0;

    function applyUser(nextUser: User | null) {
      if (!active) return;
      const version = ++requestVersion;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      setRole(null);
      setLoading(true);

      void supabase
        .from("users")
        .select("role")
        .eq("id", nextUser.id)
        .maybeSingle()
        .then(
          ({ data }) => {
            if (!active || version !== requestVersion) return;
            setRole(data?.role ?? null);
            setLoading(false);
          },
          () => {
            if (!active || version !== requestVersion) return;
            setRole(null);
            setLoading(false);
          },
        );
    }

    void supabase.auth.getUser().then(({ data }) => {
      applyUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Run the profile query after the auth callback returns. Supabase warns
      // against awaiting another client call inside this callback.
      window.setTimeout(() => applyUser(session?.user ?? null), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  return { user, role, loading };
}
