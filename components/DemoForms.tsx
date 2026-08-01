"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { ContactCopy } from "../content/contact";
import styles from "./DemoForms.module.css";

function useDemoSubmit() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return { submitted, onSubmit };
}

export function NewsletterForm({ zh = false }: { zh?: boolean }) {
  const { submitted, onSubmit } = useDemoSubmit();

  return (
    <section className={styles.newsletterSection}>
      <div className={styles.sectionRule} />
      <h2>{zh ? "訂閱 Love 21 電子通訊" : "Subscribe to our eNews"}</h2>
      {submitted ? (
        <div className={styles.formSuccess} role="status">
          {zh
            ? "謝謝！這是開發版本，資料並未傳送。"
            : "Thank you! This is a development copy, so no information was transmitted."}
        </div>
      ) : (
        <form className={styles.newsletterForm} onSubmit={onSubmit}>
          <label>
            {zh ? "姓氏" : "Last Name"}
            <input name="lastName" autoComplete="family-name" />
          </label>
          <label>
            {zh ? "名字" : "First Name"}
            <input name="firstName" autoComplete="given-name" />
          </label>
          <label>
            {zh ? "電郵地址*" : "Email Address*"}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button type="submit">{zh ? "訂閱" : "Subscribe"}</button>
        </form>
      )}
    </section>
  );
}

export function ContactForm({ copy }: { copy: ContactCopy["form"] }) {
  const { submitted, onSubmit } = useDemoSubmit();

  if (submitted) {
    return (
      <div className={`${styles.formSuccess} ${styles.contactSuccess} ${styles.large}`} role="status">
        <strong>{copy.successTitle}</strong>
        <p>{copy.successDescription}</p>
      </div>
    );
  }

  return (
    <form className={styles.contactForm} onSubmit={onSubmit}>
      <h2 id="contact-form-title">{copy.title}</h2>
      <div className={styles.contactGrid}>
        <label>
          {copy.nameLabel}
          <input name="name" autoComplete="name" placeholder={copy.namePlaceholder} required />
        </label>
        <label>
          {copy.emailLabel}
          <input name="email" type="email" autoComplete="email" placeholder={copy.emailPlaceholder} required />
        </label>
      </div>
      <label>
        {copy.topicLabel}
        <select name="topic" defaultValue="">
          <option value="" disabled>{copy.topicPlaceholder}</option>
          {copy.topics.map((topic) => <option key={topic}>{topic}</option>)}
        </select>
      </label>
      <label>
        {copy.messageLabel}
        <textarea name="message" rows={6} placeholder={copy.messagePlaceholder} required />
      </label>
      <button className={styles.contactSubmit} type="submit">{copy.submit}</button>
      <p className={`${styles.privacyNote} ${styles.contactPrivacyNote}`}>{copy.privacyNote}</p>
    </form>
  );
}

export function VolunteerForm({ zh = false }: { zh?: boolean }) {
  const { submitted, onSubmit } = useDemoSubmit();

  if (submitted) {
    return (
      <div className={`${styles.formSuccess} ${styles.large}`} role="status">
        <strong>{zh ? "感謝你的參與！" : "Thank you for volunteering!"}</strong>
        <p>
          {zh
            ? "此開發版本沒有傳送資料。"
            : "This development copy has not transmitted your information."}
        </p>
      </div>
    );
  }

  return (
    <form className={styles.stackedForm} onSubmit={onSubmit}>
      <h2>{zh ? "Love 21義工報名表格" : "Sign-up as Love 21 Volunteer"}</h2>
      <p>
        {zh
          ? "我們現正尋找充滿熱誠的義工，一同參與及支援不同的項目和活動！"
          : "We’re looking for passionate and enthusiastic volunteers to join us across classes, events and community activities."}
      </p>
      <div className={styles.formGrid}>
        <label>
          中文全名 *
          <input name="chineseName" required />
        </label>
        <label>
          English Full Name *
          <input name="englishName" required />
        </label>
        <label>
          Age Group 年齡組別 *
          <select name="age" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            <option>14-15 years old 歲</option>
            <option>16-17 years old 歲</option>
            <option>18 or above 或以上</option>
          </select>
        </label>
        <label>
          Gender 性別 *
          <select name="gender" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            <option>Female 女</option>
            <option>Male 男</option>
            <option>Prefer not to say 不透露</option>
          </select>
        </label>
        <label>
          Email 聯絡電郵 *
          <input name="email" type="email" required />
        </label>
        <label>
          Contact number 聯絡電話 *
          <input name="phone" type="tel" required />
        </label>
      </div>
      <fieldset>
        <legend>
          Which role would you like to apply for? 請問你對哪一個義工角色感興趣？
        </legend>
        <label className={styles.checkLine}>
          <input type="checkbox" name="role" value="assistant" />
          Assistant in an existing class 現有課堂助教
        </label>
        <label className={styles.checkLine}>
          <input type="checkbox" name="role" value="leader" />
          Host or lead a new class 帶領新課堂
        </label>
        <label className={styles.checkLine}>
          <input type="checkbox" name="role" value="event" />
          Event helper 大型活動義工
        </label>
      </fieldset>
      <label>
        Tell us a little more about yourself 告訴我們你的喜好和專長吧！
        <textarea name="about" rows={5} />
      </label>
      <p className={styles.privacyNote}>
        Development copy: this form validates locally and does not transmit personal data.
      </p>
      <button className={`${styles.outlineButton} ${styles.dark}`} type="submit">
        SUBMIT ➜
      </button>
    </form>
  );
}

export function AccountForm({
  title,
  zh = false,
}: {
  title: string;
  zh?: boolean;
}) {
  const { submitted, onSubmit } = useDemoSubmit();
  const reset = title.toLowerCase().includes("reset");

  if (submitted) {
    return (
      <div className={`${styles.formSuccess} ${styles.large}`} role="status">
        {zh
          ? "此開發版本不會連接真實帳戶。"
          : "Account actions are disabled in this safe development copy."}
      </div>
    );
  }

  return (
    <form className={styles.accountForm} onSubmit={onSubmit}>
      <label>
        {zh ? "用戶名稱或電郵" : "Username or E-mail"}
        <input name="username" type={reset ? "email" : "text"} required />
      </label>
      {!reset && (
        <label>
          {zh ? "密碼" : "Password"}
          <input name="password" type="password" required />
        </label>
      )}
      {!reset && (
        <label className={styles.checkLine}>
          <input name="remember" type="checkbox" />
          {zh ? "保持登入" : "Keep me signed in"}
        </label>
      )}
      <button type="submit">{reset ? "RESET PASSWORD" : zh ? "登入" : "Login"}</button>
      {!reset && (
        <div className={styles.accountLinks}>
          <Link href="/join-us/">Register</Link>
          <Link href="/password-reset/">Forgot your password?</Link>
        </div>
      )}
      <p className={styles.privacyNote}>
        {zh
          ? "開發版本：登入功能已停用。"
          : "Development copy: authentication is intentionally disabled."}
      </p>
    </form>
  );
}
