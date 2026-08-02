import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const MAX_BYTES = 10 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export type VolunteerDocumentKind = "scrc" | "parental-consent";

/**
 * Uploads an SCRC or parental-consent document into the private
 * `volunteer-documents` bucket under the user's own folder. Uses the
 * service-role client so this works whether or not the caller has an
 * authenticated session yet (needed for the guest signup flow).
 */
export async function uploadVolunteerDocument(
  userId: string,
  kind: VolunteerDocumentKind,
  file: File,
): Promise<string> {
  // re-check type and size here — browser-side validation is trivially bypassed
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(
      "Unsupported file type. Please upload a PDF, JPG, or PNG.",
    );
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File is too large. Maximum size is 10MB.");
  }

  const extension = EXTENSIONS[file.type] ?? "bin";
  // the timestamp keeps a re-upload from overwriting an earlier document of the same kind
  const path = `${userId}/${kind}-${Date.now()}.${extension}`;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("volunteer-documents")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    throw new Error(`Could not upload ${kind}: ${error.message}`);
  }

  // the bucket is private — store the path and issue signed urls for staff review later
  return path;
}
