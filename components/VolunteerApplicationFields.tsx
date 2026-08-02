"use client";

import { DocumentUploadField } from "./DocumentUploadField";
import styles from "./VolunteerSignupForm.module.css";

export type AgeGroup = "14-15" | "16-17" | "18+";
export type Gender = "Female" | "Male" | "Prefer not to say";
export type ReferralSource =
  | "Existing Love 21 volunteer"
  | "Love 21 social media"
  | "Love 21 email newsletter"
  | "Company referral"
  | "Other";

export const REFERRAL_OPTIONS: ReferralSource[] = [
  "Existing Love 21 volunteer",
  "Love 21 social media",
  "Love 21 email newsletter",
  "Company referral",
  "Other",
];

interface Props {
  chineseName: string;
  ageGroup: AgeGroup | "";
  gender: Gender | "";
  bio: string;
  referral: ReferralSource | "";
  scrcFile: File | null;
  parentalConsentFile: File | null;
  onChineseNameChange: (value: string) => void;
  onAgeGroupChange: (value: AgeGroup) => void;
  onGenderChange: (value: Gender) => void;
  onBioChange: (value: string) => void;
  onReferralChange: (value: ReferralSource) => void;
  onScrcFileChange: (file: File | null) => void;
  onParentalConsentFileChange: (file: File | null) => void;
}

/**
 * Shared field markup used by both the authenticated volunteer-application
 * form and the guest volunteer signup form. Controlled inputs only — the
 * parent owns state and submit logic.
 */
export function VolunteerApplicationFields({
  chineseName,
  ageGroup,
  gender,
  bio,
  referral,
  scrcFile,
  parentalConsentFile,
  onChineseNameChange,
  onAgeGroupChange,
  onGenderChange,
  onBioChange,
  onReferralChange,
  onScrcFileChange,
  onParentalConsentFileChange,
}: Props) {
  const isMinor = ageGroup === "14-15" || ageGroup === "16-17";
  const isAdult = ageGroup === "18+";

  return (
    <>
      <label>
        <span className={styles.fieldLabel}>Chinese name (optional)</span>
        <input
          className={styles.control}
          type="text"
          value={chineseName}
          onChange={(event) => onChineseNameChange(event.target.value)}
          placeholder="陳大文"
        />
      </label>

      <div>
        <p className={styles.fieldLabel}>
          Age group <span className={styles.required}>*</span>
        </p>
        <div className={styles.chips}>
          {(["14-15", "16-17", "18+"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.chip} ${ageGroup === option ? styles.chipActive : ""}`}
              onClick={() => onAgeGroupChange(option)}
            >
              {option === "18+" ? "18 or above" : `${option} yrs`}
            </button>
          ))}
        </div>
        {isMinor ? (
          <DocumentUploadField
            label="Parental / guardian consent form"
            hint="Signed by a parent or guardian. PDF, JPG, or PNG, up to 10MB."
            file={parentalConsentFile}
            onFileChange={onParentalConsentFileChange}
            required
          />
        ) : null}
        {isAdult ? (
          <DocumentUploadField
            label="SCRC certificate"
            hint="Sexual Conviction Record Check. PDF, JPG, or PNG, up to 10MB."
            file={scrcFile}
            onFileChange={onScrcFileChange}
            required
          />
        ) : null}
      </div>

      <div>
        <p className={styles.fieldLabel}>
          Gender <span className={styles.required}>*</span>
        </p>
        <div className={styles.genderRow}>
          {(["Female", "Male", "Prefer not to say"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.chip} ${gender === option ? styles.chipActive : ""}`}
              onClick={() => onGenderChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <label>
        <span className={styles.fieldLabel}>About you</span>
        <textarea
          className={styles.textarea}
          value={bio}
          onChange={(event) => onBioChange(event.target.value)}
          placeholder="Tell us about your skills or why you want to volunteer..."
        />
      </label>

      <div>
        <p className={styles.fieldLabel}>
          How did you hear about us? <span className={styles.required}>*</span>
        </p>
        <div className={styles.radioList}>
          {REFERRAL_OPTIONS.map((option) => (
            <label key={option} className={styles.radioItem}>
              <input
                type="radio"
                checked={referral === option}
                onChange={() => onReferralChange(option)}
                name="referral"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
