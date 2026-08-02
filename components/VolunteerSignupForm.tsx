"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { submitVolunteerApplication } from "@/app/actions/volunteer-applications";
import styles from "./VolunteerSignupForm.module.css";

type AgeGroup = "14-15" | "16-17" | "18+";
type Gender = "Female" | "Male" | "Prefer not to say";
type ReferralSource =
  | "Existing Love 21 volunteer"
  | "Love 21 social media"
  | "Love 21 email newsletter"
  | "Company referral"
  | "Other";

const REFERRAL_OPTIONS: ReferralSource[] = [
  "Existing Love 21 volunteer",
  "Love 21 social media",
  "Love 21 email newsletter",
  "Company referral",
  "Other",
];

function PolicyModal({
  onAgree,
  onClose,
  canReviewPolicy,
}: {
  onAgree: () => void;
  onClose: () => void;
  canReviewPolicy: boolean;
}) {
  const [canCheck, setCanCheck] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = bodyRef.current;
    if (element && element.scrollHeight <= element.clientHeight) {
      setCanCheck(true);
    }
  }, []);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={styles.modalRoot} role="presentation" onClick={onClose}>
      <button
        type="button"
        aria-label="Close volunteer policy"
        className={styles.modalBackdrop}
        onClick={onClose}
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="policy-title">Volunteer Policy Agreement</h2>
            <p>Scroll to the bottom to agree.</p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close volunteer policy"
          >
            ×
          </button>
        </div>

        <div
          ref={bodyRef}
          className={styles.modalBody}
          onScroll={() => {
            const element = bodyRef.current;
            if (
              element &&
              element.scrollTop + element.clientHeight >= element.scrollHeight - 8
            ) {
              setCanCheck(true);
            }
          }}
        >
          {[
            [
              "1. Purpose and Mission",
              "Love 21 Foundation is dedicated to enriching the lives of individuals with Down syndrome through structured, inclusive programs.",
            ],
            [
              "2. Conduct and Professionalism",
              "Volunteers must maintain appropriate relationships and cannot publish participant photos without guardian consent.",
            ],
            [
              "3. Confidentiality",
              "Sensitive information about participants and families must remain confidential.",
            ],
            [
              "4. Attendance and Commitment",
              "If you cannot attend a confirmed session, notify the team at least 48 hours in advance.",
            ],
            [
              "5. Health and Safety",
              "Volunteers must follow safety protocols and should not attend while ill.",
            ],
            [
              "6. Age-Specific Requirements",
              "Ages 14–17 require guardian consent. Ages 18+ require a valid SCRC before independent sessions.",
            ],
            [
              "7. Data Privacy",
              "Registration data is used for volunteer coordination and compliance.",
            ],
          ].map(([title, body]) => (
            <p key={title}>
              <strong>{title}</strong>
              {body}
            </p>
          ))}
        </div>

        <div className={styles.modalFooter}>
          {!canCheck ? (
            <p className={styles.scrollHint}>Keep scrolling to continue.</p>
          ) : null}

          {canCheck && !canReviewPolicy ? (
            <p className={styles.scrollHint}>
              Please complete all required fields in the form before submitting.
            </p>
          ) : null}

          <button
            type="button"
            className={styles.modalAgree}
            disabled={!canCheck || !canReviewPolicy}
            onClick={onAgree}
          >
            I Agree - Submit Application
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Volunteer application form for an already-authenticated contributor.
 * Guest applications are a follow-up task and not supported here yet.
 */
export function VolunteerSignupForm() {
  const router = useRouter();
  const [chineseName, setChineseName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [bio, setBio] = useState("");
  const [referral, setReferral] = useState<ReferralSource | "">("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canReviewPolicy = Boolean(ageGroup && gender && referral);

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
      setError(
        "Please complete all required fields (age group, gender, and referral).",
      );
      return;
    }
    setShowPolicy(true);
  }

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <label>
          <span className={styles.fieldLabel}>Chinese name (optional)</span>
          <input
            className={styles.control}
            type="text"
            value={chineseName}
            onChange={(event) => setChineseName(event.target.value)}
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
                onClick={() => setAgeGroup(option)}
              >
                {option === "18+" ? "18 or above" : `${option} yrs`}
              </button>
            ))}
          </div>
          {ageGroup && ageGroup !== "18+" ? (
            <p className={`${styles.notice} ${styles.noticeWarn}`}>
              A parent or guardian must attend your first visit.
            </p>
          ) : null}
          {ageGroup === "18+" ? (
            <p className={`${styles.notice} ${styles.noticeInfo}`}>
              SCRC upload is required after approval before joining sessions.
            </p>
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
                onClick={() => setGender(option)}
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
            onChange={(event) => setBio(event.target.value)}
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
                  onChange={() => setReferral(option)}
                  name="referral"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

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
