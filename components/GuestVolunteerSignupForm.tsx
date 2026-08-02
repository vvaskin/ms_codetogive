"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { submitGuestVolunteerSignup } from "@/app/actions/guest-volunteer-signup";
import type { Locale } from "@/content/site-data";
import { createClient } from "@/lib/supabase/client";
import {
  VOLUNTEER_INTERESTS,
  type VolunteerInterest,
} from "@/lib/volunteer-interests";
import { PolicyModal } from "./PolicyModal";
import {
  VolunteerApplicationFields,
  type AgeGroup,
  type Gender,
  type ReferralSource,
} from "./VolunteerApplicationFields";
import styles from "./EventSignupButton.module.css";
import formStyles from "./VolunteerSignupForm.module.css";

type Step = "form" | "confirmed";

function pick(locale: Locale, en: string, zh: string, cn: string) {
  return locale === "cn" ? cn : locale === "zh" ? zh : en;
}

/**
 * Two-step guest volunteer signup: form → confirmation.
 *
 * The visitor picks their own password inline; on submit the server creates
 * a `contributor` account and lands the volunteer application + pending
 * event participation. The browser then signs the guest in with the same
 * email/password so their new session picks up their portal state.
 */
export function GuestVolunteerSignupForm({
  eventId,
  locale,
  onCancel,
  onDone,
}: {
  eventId: number;
  locale: Locale;
  onCancel: () => void;
  onDone: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [interest, setInterest] = useState<VolunteerInterest | null>(null);
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

  const requiredDocumentPresent =
    ageGroup === "18+"
      ? scrcFile !== null
      : ageGroup === "14-15" || ageGroup === "16-17"
        ? parentalConsentFile !== null
        : false;
  const requiredFilled = Boolean(
    name.trim() &&
      email.trim() &&
      phone.trim() &&
      password.length >= 8 &&
      interest &&
      ageGroup &&
      gender &&
      referral &&
      requiredDocumentPresent,
  );

  function onSubmitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!requiredFilled) {
      setError(
        pick(
          locale,
          "Please complete all required fields (password must be 8+ characters).",
          "請填寫所有必填欄位（密碼須至少 8 個字元）。",
          "请填写所有必填字段（密码须至少 8 个字符）。",
        ),
      );
      return;
    }
    setShowPolicy(true);
  }

  async function submitAfterPolicy() {
    setShowPolicy(false);
    setSubmitting(true);
    setError(null);
    try {
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/";
      const res = await submitGuestVolunteerSignup({
        eventId,
        name,
        email,
        phone,
        password,
        interest: interest as string,
        ageGroup: ageGroup as string,
        gender: gender as string,
        referralSource: referral as string,
        bio,
        chineseName,
        scrcFile,
        parentalConsentFile,
        locale,
        returnPath: currentPath,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.outcome === "existing_account") {
        router.push(res.redirectTo);
        return;
      }

      // Log the newly-created user in so their session picks up the fresh
      // application/participation rows on next navigation.
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) {
        // Account exists and the writes landed, but auto-login failed — show
        // the confirmation anyway; they can log in manually from the portal.
        setError(null);
      }
      router.refresh();
      setStep("confirmed");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "confirmed") {
    return (
      <div className={styles.wrap}>
        <p className={styles.done}>
          ✓{" "}
          {pick(
            locale,
            "Application received",
            "已收到你的申請",
            "已收到你的申请",
          )}
        </p>
        <p className={styles.hint}>
          {pick(
            locale,
            "Your event request is pending staff review — we'll be in touch.",
            "你的活動申請正等待職員審核 — 我們會與你聯絡。",
            "你的活动申请正等待职员审核 — 我们会与你联络。",
          )}
        </p>
        <button className={styles.button} type="button" onClick={onDone}>
          {pick(locale, "Close", "關閉", "关闭")}
        </button>
      </div>
    );
  }

  return (
    <>
      <form className={styles.wrap} onSubmit={onSubmitForm}>
        <input
          className={styles.input}
          placeholder={pick(locale, "Full name", "全名", "全名")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />
        <input
          className={styles.input}
          type="email"
          placeholder={pick(locale, "Email", "電郵", "电邮")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
        <input
          className={styles.input}
          type="tel"
          placeholder={pick(locale, "Phone (+852…)", "電話 (+852…)", "电话 (+852…)")}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          autoComplete="tel"
        />
        <input
          className={styles.input}
          type="password"
          placeholder={pick(
            locale,
            "Password (8+ characters)",
            "密碼（至少 8 個字元）",
            "密码（至少 8 个字符）",
          )}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <p className={styles.label}>
          {pick(
            locale,
            "Which role would you like at this event?",
            "你想在這個活動擔任哪個角色？",
            "你想在这个活动担任哪个角色？",
          )}
        </p>
        <div className={styles.interests}>
          {VOLUNTEER_INTERESTS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.chip} ${interest === option.value ? styles.chipActive : ""}`}
              onClick={() => setInterest(option.value)}
              aria-pressed={interest === option.value}
            >
              <span aria-hidden="true">{option.icon}</span> {option.label}
            </button>
          ))}
        </div>

        <div
          className={formStyles.form}
          style={{
            padding: 0,
            border: 0,
            background: "transparent",
            boxShadow: "none",
          }}
        >
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
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.row}>
          <button
            className={styles.button}
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            {pick(locale, "Cancel", "取消", "取消")}
          </button>
          <button
            className={styles.primary}
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? pick(locale, "Saving…", "儲存中…", "储存中…")
              : pick(
                  locale,
                  "Review policy and apply",
                  "檢視政策並申請",
                  "查看政策并申请",
                )}
          </button>
        </div>
      </form>

      {showPolicy ? (
        <PolicyModal
          canReviewPolicy={requiredFilled}
          onAgree={submitAfterPolicy}
          onClose={() => setShowPolicy(false)}
          agreeLabel={pick(
            locale,
            "I Agree - Submit",
            "我同意 - 提交",
            "我同意 - 提交",
          )}
        />
      ) : null}
    </>
  );
}
