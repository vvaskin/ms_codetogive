"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureAccount } from "@/lib/server/ensure-account";
import type { DonationFrequency, DonationKind } from "@/lib/supabase/types";

export interface RecordDonationInput {
  amountCents: number;
  kind: DonationKind;
  frequency?: DonationFrequency | null;
  eventId?: number | null;
  /** Guest details — required only when the visitor is logged out. */
  email?: string;
  name?: string;
}

export interface RecordDonationResult {
  ok: boolean;
  error?: string;
  /** True when a guest account was created for this donation. */
  createdAccount?: boolean;
}

/**
 * Records a donation. A logged-in donor writes their own row (RLS-checked);
 * a guest auto-gets a donor account first, then the row is written with the
 * service-role client.
 */
export async function recordDonation(
  input: RecordDonationInput,
): Promise<RecordDonationResult> {
  const amountCents = Math.round(input.amountCents);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return { ok: false, error: "Please enter a valid amount." };
  }
  if (input.kind === "recurring" && !input.frequency) {
    return { ok: false, error: "Please choose a frequency." };
  }

  const row = {
    kind: input.kind,
    amount_cents: amountCents,
    frequency: input.kind === "recurring" ? input.frequency! : null,
    status: input.kind === "recurring" ? ("active" as const) : ("completed" as const),
    event_id: input.eventId ?? null,
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged-in donor: insert under their own session (RLS enforces donor_id).
  if (user) {
    const { error } = await supabase
      .from("donations")
      .insert({ donor_id: user.id, ...row });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  // Guest: need contact details to create/find their account.
  const email = input.email?.trim();
  const name = input.name?.trim();
  if (!email || !name) {
    return { ok: false, error: "Please enter your name and email." };
  }

  try {
    const origin = await appOrigin();
    const account = await ensureAccount({
      email,
      name,
      role: "donor",
      origin,
    });

    const admin = createAdminClient();
    const { error } = await admin
      .from("donations")
      .insert({ donor_id: account.userId, ...row });
    if (error) return { ok: false, error: error.message };

    if (account.setPasswordLink) {
      // Dev aid — the email also goes out via Supabase.
      console.log(`[guest donation] set-password link for ${email}: ${account.setPasswordLink}`);
    }

    return { ok: true, createdAccount: account.created };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

async function appOrigin(): Promise<string> {
  const h = await headers();
  return (
    h.get("origin") ??
    (h.get("host") ? `https://${h.get("host")}` : "http://localhost:3000")
  );
}
