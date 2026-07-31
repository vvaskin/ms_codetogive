"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className="portal-sign-out"
      type="button"
      onClick={signOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? "Logging out…" : "Log out"}
    </button>
  );
}
