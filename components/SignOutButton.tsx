"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({
  className = "portal-sign-out",
  label = "Log out",
  pendingLabel = "Logging out…",
}: {
  className?: string;
  label?: string;
  pendingLabel?: string;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className={className}
      type="button"
      onClick={signOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? pendingLabel : label}
    </button>
  );
}
