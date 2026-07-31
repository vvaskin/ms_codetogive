"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  hrefFor,
  t,
  type DonationFrequency,
  type DonationProgramme,
  type HomepageContent,
} from "../../content/homepage";
import type { Locale } from "../../content/site-data";
import styles from "../HomeExperience.module.css";

type AmountMode = number | "custom";

export function HomeDonatePreview({
  locale,
  content,
}: {
  locale: Locale;
  content: HomepageContent["donatePreview"];
}) {
  const headingId = useId();
  const customId = useId();
  const errorId = useId();
  const [frequency, setFrequency] = useState<DonationFrequency>("one-time");
  const [amountMode, setAmountMode] = useState<AmountMode>(250);
  const [customAmount, setCustomAmount] = useState("");
  const [programme, setProgramme] =
    useState<DonationProgramme>("most-needed");
  const [customTouched, setCustomTouched] = useState(false);

  const parsedCustom = Number.parseInt(customAmount, 10);
  const customValid =
    customAmount.trim() !== "" &&
    Number.isFinite(parsedCustom) &&
    parsedCustom >= 1 &&
    String(parsedCustom) === customAmount.trim();

  const selectedAmount =
    amountMode === "custom" ? (customValid ? parsedCustom : null) : amountMode;

  const showCustomError =
    amountMode === "custom" && customTouched && !customValid;

  const impactMessage = useMemo(() => {
    const match = content.impactMessages.find(
      (item) =>
        item.frequency === frequency && item.programme === programme,
    );
    const base = match
      ? t(match.message, locale)
      : t(content.defaultImpact, locale);

    if (selectedAmount == null) {
      return base;
    }

    const amountLabel =
      locale === "zh"
        ? `港幣 ${selectedAmount.toLocaleString("en-HK")} 元`
        : `HK$${selectedAmount.toLocaleString("en-HK")}`;
    const frequencyLabel =
      frequency === "monthly"
        ? locale === "zh"
          ? "每月"
          : "monthly"
        : locale === "zh"
          ? "一次性"
          : "one-time";

    return locale === "zh"
      ? `${frequencyLabel}${amountLabel}：${base}`
      : `Your ${frequencyLabel} gift of ${amountLabel}: ${base}`;
  }, [
    content.defaultImpact,
    content.impactMessages,
    frequency,
    locale,
    programme,
    selectedAmount,
  ]);

  return (
    <section
      id={content.id}
      className={styles.homeDonate}
      aria-labelledby={headingId}
    >
      <div className={styles.homeSectionInner}>
        <p className={styles.homeEyebrow}>{t(content.eyebrow, locale)}</p>
        <h2 id={headingId} className={styles.homeSectionTitle}>
          {t(content.title, locale)}
        </h2>
        <p className={styles.homeSectionLead}>
          {t(content.description, locale)}
        </p>

        <div className={styles.homeDonatePanel}>
          <fieldset className={styles.homeFieldset}>
            <legend>{t(content.frequencyLabel, locale)}</legend>
            <div className={styles.homeChoiceRow}>
              <label className={styles.homeChoice}>
                <input
                  type="radio"
                  name="donation-frequency"
                  checked={frequency === "one-time"}
                  onChange={() => setFrequency("one-time")}
                />
                <span>{t(content.oneTimeLabel, locale)}</span>
              </label>
              <label className={styles.homeChoice}>
                <input
                  type="radio"
                  name="donation-frequency"
                  checked={frequency === "monthly"}
                  onChange={() => setFrequency("monthly")}
                />
                <span>{t(content.monthlyLabel, locale)}</span>
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.homeFieldset}>
            <legend>{t(content.amountLabel, locale)}</legend>
            <div className={styles.homeChoiceRow}>
              {content.amounts.map((amount) => (
                <label key={amount.value} className={styles.homeChoice}>
                  <input
                    type="radio"
                    name="donation-amount"
                    checked={amountMode === amount.value}
                    onChange={() => setAmountMode(amount.value)}
                  />
                  <span>{t(amount.label, locale)}</span>
                </label>
              ))}
              <label className={styles.homeChoice}>
                <input
                  type="radio"
                  name="donation-amount"
                  checked={amountMode === "custom"}
                  onChange={() => setAmountMode("custom")}
                />
                <span>{t(content.customAmountLabel, locale)}</span>
              </label>
            </div>
            {amountMode === "custom" && (
              <div className={styles.homeCustomAmount}>
                <label htmlFor={customId}>
                  {t(content.customAmountLabel, locale)}
                </label>
                <input
                  id={customId}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={t(content.customAmountPlaceholder, locale)}
                  value={customAmount}
                  aria-invalid={showCustomError}
                  aria-describedby={showCustomError ? errorId : undefined}
                  onChange={(event) => {
                    setCustomAmount(event.target.value);
                    setCustomTouched(true);
                  }}
                  onBlur={() => setCustomTouched(true)}
                />
                {showCustomError && (
                  <p id={errorId} className={styles.homeFieldError} role="alert">
                    {t(content.customAmountError, locale)}
                  </p>
                )}
              </div>
            )}
          </fieldset>

          <label className={styles.homeSelectLabel}>
            {t(content.programmeLabel, locale)}
            <select
              value={programme}
              onChange={(event) =>
                setProgramme(event.target.value as DonationProgramme)
              }
            >
              {content.programmeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label, locale)}
                </option>
              ))}
            </select>
          </label>

          <p className={styles.homeImpactMessage} aria-live="polite">
            {impactMessage}
          </p>

          <Link
            className={styles.homeButtonPrimary}
            href={hrefFor(content.cta, locale)}
          >
            {t(content.cta.label, locale)}
          </Link>
          <p className={styles.homeDonateNote}>{t(content.note, locale)}</p>
        </div>
      </div>
    </section>
  );
}
