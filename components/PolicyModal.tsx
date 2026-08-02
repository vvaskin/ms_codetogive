"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./VolunteerSignupForm.module.css";

/**
 * Volunteer-policy modal with scroll-to-agree gate. Extracted from
 * VolunteerSignupForm so both the authenticated and guest volunteer flows
 * share the same modal.
 */
export function PolicyModal({
  onAgree,
  onClose,
  canReviewPolicy,
  agreeLabel = "I Agree - Submit Application",
}: {
  onAgree: () => void;
  onClose: () => void;
  canReviewPolicy: boolean;
  agreeLabel?: string;
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
              element.scrollTop + element.clientHeight >=
                element.scrollHeight - 8
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
            {agreeLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
