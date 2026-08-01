"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import {
  VOLUNTEER_SIGNUP_DRAFT_KEY,
  VOLUNTEER_SIGNUP_IN_PROGRESS_COOKIE,
  type VolunteerSignupDraft,
} from "@/lib/volunteer-signup-draft";
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

  // If the policy text is short enough to fit without scrolling, there's
  // nothing to scroll to — enable agreement immediately so the button never
  // dead-ends. When the text does overflow, the onScroll handler below gates
  // agreement on reaching the bottom.
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

let cachedDraftRaw: string | null | undefined;
let cachedDraft: VolunteerSignupDraft | null = null;

function getDraftSnapshot(): VolunteerSignupDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(VOLUNTEER_SIGNUP_DRAFT_KEY);
  if (raw === cachedDraftRaw) return cachedDraft;
  cachedDraftRaw = raw;
  cachedDraft = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<VolunteerSignupDraft>;
      if (parsed.name && parsed.email && parsed.password) {
        cachedDraft = {
          name: parsed.name,
          email: parsed.email,
          password: parsed.password,
          phone: parsed.phone ?? "",
        };
      }
    } catch {
      // ignore malformed drafts
    }
  }
  return cachedDraft;
}

function subscribeToDraft() {
  return () => {};
}

export function VolunteerSignupForm() {
  const router = useRouter();
  const draft = useSyncExternalStore(
    subscribeToDraft,
    getDraftSnapshot,
    getDraftSnapshot,
  );
  const [chineseName, setChineseName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [bio, setBio] = useState("");
  const [referral, setReferral] = useState<ReferralSource | "">("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draft) {
      router.replace("/signup");
    }
  }, [draft, router]);

  const canReviewPolicy = Boolean(draft && ageGroup && gender && referral);

  async function finalizeSignup() {
    if (!draft) return;
    setShowPolicy(false);
    setError(null);
    setIsSubmitting(true);

    const trimmedChineseName = chineseName.trim();
    const displayName = trimmedChineseName
      ? `${draft.name} / ${trimmedChineseName}`
      : draft.name;
    const profileNotes = [
      trimmedChineseName ? `Chinese name: ${trimmedChineseName}` : "",
      ageGroup ? `Age group: ${ageGroup}` : "",
      gender ? `Gender: ${gender}` : "",
      referral ? `Referral: ${referral}` : "",
      bio.trim() ? `About: ${bio.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const supabase = createClient();
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: draft.email,
          password: draft.password,
          options: {
            data: {
              name: displayName,
              role: "volunteer",
              ...(draft.phone ? { phone: draft.phone } : {}),
              address: profileNotes || undefined,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/portal`,
          },
        });

      if (signUpError) {
        setError(readableError(signUpError.message));
        return;
      }

      // The handle_new_user trigger seeds name/email/role but not the phone,
      // so persist it into the profile row (RLS: users update their own row).
      if (draft.phone && signUpData.user) {
        await supabase
          .from("users")
          .update({ phone_number: draft.phone })
          .eq("id", signUpData.user.id);
      }

      window.sessionStorage.removeItem(VOLUNTEER_SIGNUP_DRAFT_KEY);
      document.cookie = `${VOLUNTEER_SIGNUP_IN_PROGRESS_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
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
    setError(null);
    if (!canReviewPolicy) {
      setError("Please fill in all required fields (name, email, password of at least 8 characters, and all highlighted volunteer details).");
      return;
    }
    setShowPolicy(true);
  }

  if (!draft) {
    return null;
  }

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.summary}>
          <dl>
            <div className={styles.summaryRow}>
              <dt>Full name</dt>
              <dd>{draft.name}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Email address</dt>
              <dd>{draft.email}</dd>
            </div>
          </dl>
        </div>
        <p className={`${styles.notice} ${styles.noticeInfo}`}>
          Your name and email are carried over from the previous step.{" "}
          <Link href="/signup">Start over</Link>
        </p>

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
