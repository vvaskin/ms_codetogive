"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminClient,
  getAdminAuthState,
} from "@/lib/supabase/admin";
import type { VolunteerApplicationStatus } from "@/lib/supabase/types";

const APPLICATION_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "withdrawn",
] as const satisfies readonly VolunteerApplicationStatus[];

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseApplicationId(value: string) {
  if (!/^\d+$/.test(value)) throw new Error("Invalid application id.");

  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Invalid application id.");
  }

  return id;
}

function parseStatus(value: string): VolunteerApplicationStatus {
  if (!APPLICATION_STATUSES.includes(value as VolunteerApplicationStatus)) {
    throw new Error("Invalid application status.");
  }
  return value as VolunteerApplicationStatus;
}

// the caller is re-verified with the cookie-backed client on every mutation;
// the returned client is service-role and bypasses RLS
async function requireStaff() {
  const authState = await getAdminAuthState();
  if (!authState.user || !authState.isStaff) redirect("/admin/login");
  return { user: authState.user, admin: createAdminClient() };
}

export async function updateVolunteerApplicationStatus(formData: FormData) {
  const { user, admin } = await requireStaff();

  const id = parseApplicationId(textValue(formData, "id"));
  const status = parseStatus(textValue(formData, "status"));
  const rejectionReason = textValue(formData, "rejectionReason");

  if (status === "rejected" && !rejectionReason) {
    throw new Error("Please provide a rejection reason.");
  }

  // any non-rejection wipes the stored reason so an old one can't resurface
  // for the applicant after a status change
  const { error } = await admin
    .from("volunteer_applications")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      rejection_reason: status === "rejected" ? rejectionReason : null,
      rejection_reason_visible:
        status === "rejected" ? rejectionReason.length > 0 : false,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Unable to update application: ${error.message}`);
  }

  revalidatePath("/admin/people/applications");
  // the applicant watches their status from the contributor portal
  revalidatePath("/portal/volunteering");
  revalidatePath("/portal");
}
