"use client";

import Link from "next/link";
import { useState } from "react";
import { registerForEvent } from "@/app/actions/registrations";
import { VOLUNTEER_INTERESTS, type VolunteerInterest } from "@/lib/volunteer-interests";
import type { Locale } from "@/content/site-data";
import { isContributorRole, type UserRole } from "@/lib/roles";import styles from "./EventSignupButton.module.css";

type Props = {
  eventId: number;
  locale: Locale;
  sessionRole: UserRole | null;
  /** True when the current user is a contributor with an approved volunteer application. */
  isApprovedVolunteer?: boolean;
  signedUp: boolean;
  /** True when the signed-in contributor's application is approved. */
  volunteerApproved?: boolean;
};

function pick(locale: Locale, en: string, zh: string, cn: string) {
  return locale === "cn" ? cn : locale === "zh" ? zh : en;
}

export function EventSignupButton({
  eventId,
  locale,
  sessionRole,
  isApprovedVolunteer = false,
  signedUp,
}: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(signedUp);
  const [error, setError] = useState<string | null>(null);
  const [interest, setInterest] = useState<VolunteerInterest | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  async function submit(
    interestValue: VolunteerInterest | null,
    name?: string,
    email?: string,
  ) {
    setSubmitting(true);
    setError(null);
    const res = await registerForEvent({
      eventId,
      interest: isApprovedVolunteer ? interestValue : null,
      guestName: sessionRole ? null : name ?? null,
      guestEmail: sessionRole ? null : email ?? null,
    });
    setSubmitting(false);
    if (res.ok) {
      setDone(true);
      setOpen(false);
    } else {
      setError(res.error ?? pick(locale, "Something went wrong.", "出了點問題。", "出了点问题。"));
    }
  }

  if (done) {
    return (
      <div className={styles.wrap}>
        <p className={styles.done}>
          ✓{" "}
          {pick(locale, "You’re signed up", "你已報名", "你已报名")}
        </p>
        {sessionRole ? (
          <Link className={styles.link} href="/portal/events">
            {pick(locale, "View in My Volunteering", "在「我的義工服務」查看", '在"我的义工服务"查看')}
          </Link>
        ) : null}
      </div>
    );
  }

  if (isApprovedVolunteer) {
    if (!open) {
      return (
        <button className={styles.primary} onClick={() => setOpen(true)} type="button">
          {pick(locale, "Sign up", "報名", "报名")}
        </button>
      );
    }
    const chosen = VOLUNTEER_INTERESTS.find((option) => option.value === interest);
    return (
      <div className={styles.wrap}>
        <p className={styles.label}>
          {pick(locale, "Choose your role", "選擇你的角色", "选择你的角色")}
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
        {chosen ? (
          <p className={styles.selected}>
            ✓{" "}
            {pick(locale, "Selected", "已選", "已选")}: {chosen.icon} {chosen.label}
          </p>
        ) : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.row}>
          <button
            className={styles.button}
            onClick={() => setOpen(false)}
            disabled={submitting}
            type="button"
          >
            {pick(locale, "Cancel", "取消", "取消")}
          </button>
          <button
            className={styles.primary}
            disabled={!interest || submitting}
            onClick={() => interest && submit(interest)}
            type="button"
          >
            {submitting
              ? pick(locale, "Saving…", "儲存中…", "储存中…")
              : pick(locale, "Confirm", "確認", "确认")}
          </button>
        </div>
      </div>
    );
  }

  if (sessionRole) {
    return (
      <div className={styles.wrap}>
        <button
          className={styles.primary}
          disabled={submitting}
          onClick={() => submit(null)}
          type="button"
        >
          {submitting
            ? pick(locale, "Saving…", "儲存中…", "储存中…")
            : pick(locale, "Sign up", "報名", "报名")}
        </button>
        {error ? <p className={styles.error}>{error}</p> : null}
      </div>
    );
  }

  if (!open) {
    return (
      <button className={styles.primary} onClick={() => setOpen(true)} type="button">
        {pick(locale, "Sign up", "報名", "报名")}
      </button>
    );
  }
  return (
    <form
      className={styles.wrap}
      onSubmit={(event) => {
        event.preventDefault();
        submit(null, guestName, guestEmail);
      }}
    >
      <input
        className={styles.input}
        placeholder={pick(locale, "Your name", "你的姓名", "你的姓名")}
        value={guestName}
        onChange={(event) => setGuestName(event.target.value)}
        required
      />
      <input
        className={styles.input}
        type="email"
        placeholder={pick(locale, "Email", "電郵", "电邮")}
        value={guestEmail}
        onChange={(event) => setGuestEmail(event.target.value)}
        required
      />
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => setOpen(false)}
          disabled={submitting}
          type="button"
        >
          {pick(locale, "Cancel", "取消", "取消")}
        </button>
        <button className={styles.primary} disabled={submitting} type="submit">
          {submitting
            ? pick(locale, "Saving…", "儲存中…", "储存中…")
            : pick(locale, "Sign up", "報名", "报名")}
        </button>
      </div>
    </form>
  );
}