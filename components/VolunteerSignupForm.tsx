"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { authClient } from "@/lib/auth-client";
import {
  VOLUNTEER_SIGNUP_DRAFT_KEY,
  type VolunteerSignupDraft,
} from "../lib/volunteer-signup-draft";
import styles from "./VolunteerSignupForm.module.css";

type AgeGroup = "14-15" | "16-17" | "18+";
type Gender = "Female" | "Male" | "Prefer not to say";
type RoleInterest = "Coach" | "Class Assistant" | "Event Helper";
type ReferralSource =
  | "Existing Love 21 volunteer"
  | "Love 21 social media"
  | "Love 21 email newsletter"
  | "Company referral"
  | "Other";

const ROLE_INTEREST_OPTIONS: {
  value: RoleInterest;
  label: string;
  desc: string;
  icon: string;
  minAge?: string;
}[] = [
  {
    value: "Coach",
    label: "Coach",
    desc: "Lead and plan sessions",
    icon: "🏆",
    minAge: "Age 16+",
  },
  {
    value: "Class Assistant",
    label: "Class Assistant",
    desc: "Support coaches in class",
    icon: "🤝",
  },
  {
    value: "Event Helper",
    label: "Event Helper",
    desc: "Help at one-off events",
    icon: "🎯",
  },
];

const REFERRAL_OPTIONS: ReferralSource[] = [
  "Existing Love 21 volunteer",
  "Love 21 social media",
  "Love 21 email newsletter",
  "Company referral",
  "Other",
];

function readableError(message: string | undefined) {
  if (!message) return "Something went wrong. Please try again.";

  const normalized = message.toLowerCase();

  if (
    normalized.includes("already exists") ||
    normalized.includes("already registered")
  ) {
    return "An account with this email already exists.";
  }

  return message;
}

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
              Please complete all required fields in the form before registering.
            </p>
          ) : null}

          <button
            type="button"
            className={styles.modalAgree}
            disabled={!canCheck || !canReviewPolicy}
            onClick={onAgree}
          >
            I Agree - Complete Registration
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function VolunteerSignupForm() {
  const router = useRouter();
  const [chineseName, setChineseName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [roleInterests, setRoleInterests] = useState<RoleInterest[]>([]);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [referral, setReferral] = useState<ReferralSource | "">("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [draft, setDraft] = useState<VolunteerSignupDraft | "missing" | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const raw = window.sessionStorage.getItem(VOLUNTEER_SIGNUP_DRAFT_KEY);

      if (!raw) {
        setDraft("missing");
        return;
      }

      try {
        const parsed = JSON.parse(raw) as VolunteerSignupDraft;

        if (!parsed.name || !parsed.email || !parsed.password) {
          setDraft("missing");
          return;
        }

        setDraft(parsed);
      } catch {
        setDraft("missing");
      }
    });
  }, []);

  useEffect(() => {
    if (draft === "missing") {
      router.replace("/signup");
    }
  }, [draft, router]);

  const canReviewPolicy = Boolean(
    ageGroup && gender && phone.trim() && referral && roleInterests.length > 0,
  );

  function toggleRoleInterest(interest: RoleInterest) {
    setRoleInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  async function finalizeSignup() {
    if (!draft || draft === "missing") return;

    setShowPolicy(false);
    setError(null);
    setIsSubmitting(true);

    const trimmedChineseName = chineseName.trim();
    const displayName = trimmedChineseName
      ? `${draft.name} / ${trimmedChineseName}`
      : draft.name;
    const profileNotes = [
      trimmedChineseName ? `Chinese name: ${trimmedChineseName}` : "",
      roleInterests.length > 0
        ? `Role interests: ${roleInterests.join(", ")}`
        : "",
      ageGroup ? `Age group: ${ageGroup}` : "",
      gender ? `Gender: ${gender}` : "",
      referral ? `Referral: ${referral}` : "",
      bio.trim() ? `About: ${bio.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const result = await authClient.signUp.email({
        name: displayName,
        email: draft.email,
        password: draft.password,
        role: "volunteer",
        phone: phone.trim(),
        address: profileNotes || undefined,
      });

      if (result.error) {
        setError(readableError(result.error.message));
        return;
      }

      window.sessionStorage.removeItem(VOLUNTEER_SIGNUP_DRAFT_KEY);
      router.replace("/portal");
      router.refresh();
    } catch {
      setError("We could not reach the authentication service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setShowPolicy(true);
  }

  if (!draft || draft === "missing") {
    return <div className={styles.loading}>Loading your volunteer registration…</div>;
  }

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.heading}>
          <h1>Volunteer profile</h1>
          <p>Step 2 of 2. Complete your volunteer details before account creation.</p>
        </div>

        <dl className={styles.summary}>
          <div className={styles.summaryRow}>
            <dt>Name</dt>
            <dd>{draft.name}</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>Email</dt>
            <dd>{draft.email}</dd>
          </div>
        </dl>

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

        <label>
          <span className={styles.fieldLabel}>
            Contact number <span className={styles.required}>*</span>
          </span>
          <input
            className={styles.control}
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+852 9123 4567"
            required
          />
        </label>

        <div>
          <p className={styles.fieldLabel}>
            Role interest <span className={styles.required}>*</span>
          </p>
          <p className={`${styles.notice} ${styles.noticeInfo}`}>
            Coach role is available for volunteers aged 18+.
          </p>
          <div className={styles.roleGrid}>
            {ROLE_INTEREST_OPTIONS.map((option) => {
              const selected = roleInterests.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.roleCard} ${selected ? styles.roleCardActive : ""}`}
                  onClick={() => toggleRoleInterest(option.value)}
                  aria-pressed={selected}
                >
                  <span className={styles.roleIcon} aria-hidden="true">
                    {option.icon}
                  </span>
                  <span className={styles.roleTitle}>{option.label}</span>
                  <span className={styles.roleDesc}>{option.desc}</span>
                  {option.minAge ? <span className={styles.roleMinAge}>{option.minAge}</span> : null}
                </button>
              );
            })}
          </div>
          {ageGroup && ageGroup !== "18+" && roleInterests.includes("Coach") ? (
            <p className={`${styles.notice} ${styles.noticeWarn}`}>
              Coach requires age 18+. Please remove Coach or update age group.
            </p>
          ) : null}
        </div>

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
              SCRC upload is required after registration before joining sessions.
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
                {option === "Prefer not to say" ? "Prefer not to say" : option}
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
            {isSubmitting ? "Creating account..." : "Review policy and sign up"}
          </button>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.push("/signup")}
            disabled={isSubmitting}
          >
            Back
          </button>
        </div>

        <p className={styles.switchLine}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>

      {showPolicy ? (
        <PolicyModal
          canReviewPolicy={canReviewPolicy}
          onAgree={finalizeSignup}
          onClose={() => setShowPolicy(false)}
        />
      ) : null}
    </>
  );
}
