"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { submitVolunteerApplication } from "@/app/actions/volunteer-applications";
import { PolicyModal } from "./PolicyModal";
import {
  VolunteerApplicationFields,
  type AgeGroup,
  type Gender,
  type ReferralSource,
} from "./VolunteerApplicationFields";
import styles from "./VolunteerSignupForm.module.css";

/**
 * Volunteer application form for an already-authenticated contributor.
 * Guest applications live in GuestVolunteerSignupForm.
 */
export function VolunteerSignupForm() {
  const router = useRouter();
  const [chineseName, setChineseName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [bio, setBio] = useState("");
  const [referral, setReferral] = useState<ReferralSource | "">("");
  const [scrcFile, setScrcFile] = useState<File | null>(null);
  const [parentalConsentFile, setParentalConsentFile] = useState<File | null>(
    null,
  );
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredDocumentPresent =
    ageGroup === "18+"
      ? scrcFile !== null
      : ageGroup === "14-15" || ageGroup === "16-17"
        ? parentalConsentFile !== null
        : false;
  const canReviewPolicy = Boolean(
    ageGroup && gender && referral && requiredDocumentPresent,
  );

  async function finalizeSubmission() {
    setShowPolicy(false);
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitVolunteerApplication({
        ageGroup,
        gender,
        referralSource: referral,
        bio,
        chineseName,
        scrcFile,
        parentalConsentFile,
      });

      if (!result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.replace("/portal/volunteering");
      router.refresh();
    } catch {
      setError("Could not submit your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    if (!canReviewPolicy) {
      const missingDoc =
        (ageGroup === "18+" && !scrcFile) ||
        ((ageGroup === "14-15" || ageGroup === "16-17") && !parentalConsentFile);
      setError(
        missingDoc
          ? ageGroup === "18+"
            ? "Please upload your SCRC certificate."
            : "Please upload a signed parental / guardian consent form."
          : "Please complete all required fields (age group, gender, and referral).",
      );
      return;
    }
    setShowPolicy(true);
  }

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <VolunteerApplicationFields
          chineseName={chineseName}
          ageGroup={ageGroup}
          gender={gender}
          bio={bio}
          referral={referral}
          scrcFile={scrcFile}
          parentalConsentFile={parentalConsentFile}
          onChineseNameChange={setChineseName}
          onAgeGroupChange={setAgeGroup}
          onGenderChange={setGender}
          onBioChange={setBio}
          onReferralChange={setReferral}
          onScrcFileChange={setScrcFile}
          onParentalConsentFileChange={setParentalConsentFile}
        />

        {error ? (
          <div className={styles.error} role="alert">
            {error}
          </div>
        ) : null}

        <div className={styles.actions}>
          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Review policy and submit"}
          </button>
        </div>
      </form>

      {showPolicy ? (
        <PolicyModal
          canReviewPolicy={canReviewPolicy}
          onAgree={finalizeSubmission}
          onClose={() => setShowPolicy(false)}
        />
      ) : null}
    </>
  );
}
