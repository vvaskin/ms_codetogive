"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { ContactCopy } from "../content/contact";
import type { Locale } from "../content/site-data";
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

function text(locale: Locale, en: string, zh: string, cn: string) {
  return locale === "zh" ? zh : locale === "cn" ? cn : en;
}

export function NewsletterForm({ locale = "en" }: { locale?: Locale }) {
  const { submitted, onSubmit } = useDemoSubmit();

  return (
    <section className={styles.newsletterSection}>
      <div className={styles.sectionRule} />
      <h2>{text(locale, "Subscribe to our eNews", "訂閱 Love 21 電子通訊", "订阅 Love 21 电子通讯")}</h2>
      {submitted ? (
        <div className={styles.formSuccess} role="status">
          {text(locale, "Thank you! This is a development copy, so no information was transmitted.", "謝謝！這是開發版本，資料並未傳送。", "谢谢！这是开发版本，资料并未传送。")}
        </div>
      ) : (
        <form className={styles.newsletterForm} onSubmit={onSubmit}>
          <label>
            {text(locale, "Last Name", "姓氏", "姓氏")}
            <input name="lastName" autoComplete="family-name" />
          </label>
          <label>
            {text(locale, "First Name", "名字", "名字")}
            <input name="firstName" autoComplete="given-name" />
          </label>
          <label>
            {text(locale, "Email Address*", "電郵地址*", "电邮地址*")}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button type="submit">{text(locale, "Subscribe", "訂閱", "订阅")}</button>
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

export function VolunteerForm({ locale = "en" }: { locale?: Locale }) {
  const { submitted, onSubmit } = useDemoSubmit();

  if (submitted) {
    return (
      <div className={`${styles.formSuccess} ${styles.large}`} role="status">
        <strong>{text(locale, "Thank you for volunteering!", "感謝你的參與！", "感谢你的参与！")}</strong>
        <p>
          {text(locale, "This development copy has not transmitted your information.", "此開發版本沒有傳送資料。", "此开发版本没有传送资料。")}
        </p>
      </div>
    );
  }

  return (
    <form className={styles.stackedForm} onSubmit={onSubmit}>
      <h2>{text(locale, "Sign-up as Love 21 Volunteer", "Love 21義工報名表格", "Love 21 义工报名表格")}</h2>
      <p>
        {text(
          locale,
          "We’re looking for passionate and enthusiastic volunteers to join us across classes, events and community activities.",
          "我們現正尋找充滿熱誠的義工，一同參與及支援不同的項目和活動！",
          "我们现在正在寻找充满热诚的义工，一同参与及支持不同的项目和活动！",
        )}
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
  locale = "en",
}: {
  title: string;
  locale?: Locale;
}) {
  const { submitted, onSubmit } = useDemoSubmit();
  const reset = title.toLowerCase().includes("reset");

  if (submitted) {
    return (
      <div className={`${styles.formSuccess} ${styles.large}`} role="status">
        {text(locale, "Account actions are disabled in this safe development copy.", "此開發版本不會連接真實帳戶。", "此开发版本不会连接真实账户。")}
      </div>
    );
  }

  return (
    <form className={styles.accountForm} onSubmit={onSubmit}>
      <label>
        {text(locale, "Username or E-mail", "用戶名稱或電郵", "用户名称或电邮")}
        <input name="username" type={reset ? "email" : "text"} required />
      </label>
      {!reset && (
        <label>
          {text(locale, "Password", "密碼", "密码")}
          <input name="password" type="password" required />
        </label>
      )}
      {!reset && (
        <label className={styles.checkLine}>
          <input name="remember" type="checkbox" />
          {text(locale, "Keep me signed in", "保持登入", "保持登录")}
        </label>
      )}
      <button type="submit">
        {reset ? "RESET PASSWORD" : text(locale, "Login", "登入", "登录")}
      </button>
      {!reset && (
        <div className={styles.accountLinks}>
          <Link href="/join-us/">Register</Link>
          <Link href="/password-reset/">Forgot your password?</Link>
        </div>
      )}
      <p className={styles.privacyNote}>
        {text(locale, "Development copy: authentication is intentionally disabled.", "開發版本：登入功能已停用。", "开发版本：登录功能已停用。")}
      </p>
    </form>
  );
}
