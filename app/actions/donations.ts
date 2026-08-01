"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureAccount } from "@/lib/server/ensure-account";
import type { DonationFrequency, DonationKind } from "@/lib/supabase/table-types";

export interface RecordDonationInput {
  amountCents: number;
  kind: DonationKind;
  frequency?: DonationFrequency | null;
  eventId?: number | null;
  /** Guest details — required only when the visitor is logged out. */
  email?: string;
  name?: string;
  phone?: string;
}

export interface RecordDonationResult {
  ok: boolean;
  error?: string;
  /** True when a guest account was created for this donation. */
  createdAccount?: boolean;
  /** Which channel the set-password message went out on ("sms" / "email"). */
  notifiedVia?: "sms" | "email" | "none";
  /** Non-fatal warning (e.g. SMS provider not configured, fell back to email). */
  warning?: string;
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

  // Guest: need contact details to create/find their account. Phone is now
  // required because SMS is the primary set-password channel.
  const email = input.email?.trim();
  const name = input.name?.trim();
  const phone = input.phone?.trim();
  if (!email || !name || !phone) {
    return {
      ok: false,
      error: "Please enter your name, email, and phone number.",
    };
  }

  try {
    const origin = await appOrigin();
    const account = await ensureAccount({
      email,
      name,
      phone,
      role: "donor",
      origin,
    });

    const admin = createAdminClient();
    const { error } = await admin
      .from("donations")
      .insert({ donor_id: account.userId, ...row });
    if (error) return { ok: false, error: error.message };

    if (account.actionLink) {
      console.log(
        `[guest donation] ${account.notifiedVia} link for ${email}: ${account.actionLink}`,
      );
    }

    return {
      ok: true,
      createdAccount: account.created,
      notifiedVia: account.notifiedVia,
      warning: account.warning,
    };
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
