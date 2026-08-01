"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureAccount } from "@/lib/server/ensure-account";

export interface RegisterForEventInput {
  eventId: number;
  /** Guest details — required only when the visitor is logged out. */
  email?: string;
  name?: string;
  phone?: string;
}

export interface RegisterForEventResult {
  ok: boolean;
  error?: string;
  createdAccount?: boolean;
  notifiedVia?: "sms" | "email" | "none";
  warning?: string;
}

/**
 * Registers the visitor to volunteer for an event. Logged-in users register
 * themselves (RLS-checked); guests auto-get a volunteer account first, then
 * the participation row is written with the service-role client.
 */
export async function registerForEvent(
  input: RegisterForEventInput,
): Promise<RegisterForEventResult> {
  if (!Number.isInteger(input.eventId)) {
    return { ok: false, error: "Invalid event." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged-in: register under their own session.
  if (user) {
    const { error } = await supabase
      .from("event_participations")
      .upsert(
        { user_id: user.id, event_id: input.eventId, status: "registered" },
        { onConflict: "user_id,event_id", ignoreDuplicates: true },
      );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  // Guest: create/find a volunteer account, then register them. Phone is now
  // required — set-password message goes out via SMS.
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
      role: "volunteer",
      origin,
    });

    const admin = createAdminClient();
    const { error } = await admin
      .from("event_participations")
      .upsert(
        {
          user_id: account.userId,
          event_id: input.eventId,
          status: "registered",
        },
        { onConflict: "user_id,event_id", ignoreDuplicates: true },
      );
    if (error) return { ok: false, error: error.message };

    if (account.actionLink) {
      console.log(
        `[guest volunteer] ${account.notifiedVia} link for ${email}: ${account.actionLink}`,
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
