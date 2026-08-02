"use client";

import styles from "./VolunteerSignupForm.module.css";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_BYTES = 10 * 1024 * 1024;

interface Props {
  label: string;
  hint?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string | null;
  onErrorChange?: (error: string | null) => void;
  required?: boolean;
}

/**
 * Controlled file-input for volunteer application supporting documents
 * (SCRC / parental consent). Captures the File in parent state — upload
 * happens server-side during application submission.
 */
export function DocumentUploadField({
  label,
  hint,
  file,
  onFileChange,
  error,
  onErrorChange,
  required,
}: Props) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    if (!next) {
      onFileChange(null);
      onErrorChange?.(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(next.type)) {
      onErrorChange?.("Please upload a PDF, JPG, or PNG file.");
      event.target.value = "";
      return;
    }
    if (next.size > MAX_BYTES) {
      onErrorChange?.("File is too large. Maximum size is 10MB.");
      event.target.value = "";
      return;
    }
    onErrorChange?.(null);
    onFileChange(next);
  }

  return (
    <div className={styles.fileField}>
      <label>
        <span className={styles.fieldLabel}>
          {label} {required ? <span className={styles.required}>*</span> : null}
        </span>
        <input
          className={styles.fileInput}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={onChange}
        />
      </label>
      {hint ? <p className={styles.fileHint}>{hint}</p> : null}
      {file ? <p className={styles.fileName}>{file.name}</p> : null}
      {error ? <p className={styles.fileError}>{error}</p> : null}
    </div>
  );
}
