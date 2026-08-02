"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { withdrawVolunteerApplication } from "@/app/actions/volunteer-applications";

export function WithdrawApplicationButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (busy) return;
    if (!window.confirm("Withdraw your volunteer application?")) return;
    setBusy(true);
    setError(null);
    const result = await withdrawVolunteerApplication();
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Could not withdraw.");
      return;
    }
    router.refresh();
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <button type="button" onClick={onClick} disabled={busy}>
        {busy ? "Withdrawing…" : "Withdraw application"}
      </button>
      {error ? (
        <p role="alert" style={{ color: "var(--color-pink, #c00)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
