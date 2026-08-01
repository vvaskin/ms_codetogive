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

  const programmeLabel =
    content.programmeOptions.find((option) => option.value === programme)
      ?.label ?? content.programmeOptions[0].label;

  const impactMessage = useMemo(() => {
    const match = content.impactMessages.find(
      (item) =>
        item.frequency === frequency && item.programme === programme,
    );
    return match
      ? t(match.message, locale)
      : t(content.defaultImpact, locale);
  }, [
    content.defaultImpact,
    content.impactMessages,
    frequency,
    locale,
    programme,
  ]);

  const filledTiles = selectedAmount
    ? Math.min(9, Math.max(1, Math.round(selectedAmount / 250)))
    : 0;

  const amountDisplay =
    selectedAmount == null
      ? "—"
      : locale === "zh"
        ? `港幣 ${selectedAmount.toLocaleString("en-HK")} 元`
        : locale === "cn"
          ? `港币 ${selectedAmount.toLocaleString("en-HK")} 元`
          : `HK$${selectedAmount.toLocaleString("en-HK")}`;

  return (
    <section
      id={content.id}
      className={styles.homeDonate}
      aria-labelledby={headingId}
    >
      <div className={styles.homeSectionInner}>
        <div className={styles.homeSectionHeading}>
          <div>
            <p className={styles.homeEyebrow}>{t(content.eyebrow, locale)}</p>
            <h2 id={headingId} className={styles.homeSectionTitle}>
              {t(content.title, locale)}
            </h2>
          </div>
          {t(content.description, locale) ? (
            <p className={styles.homeSectionLead}>
              {t(content.description, locale)}
            </p>
          ) : null}
        </div>

        <div className={styles.homeDonateStudio}>
          <div className={styles.homeDonateControls}>
            <div
              className={styles.homeToggle}
              role="group"
              aria-label={t(content.frequencyLabel, locale)}
            >
              <button
                type="button"
                className={
                  frequency === "one-time" ? styles.homeToggleSelected : undefined
                }
                aria-pressed={frequency === "one-time"}
                onClick={() => setFrequency("one-time")}
              >
                {t(content.oneTimeLabel, locale)}
              </button>
              <button
                type="button"
                className={
                  frequency === "monthly" ? styles.homeToggleSelected : undefined
                }
                aria-pressed={frequency === "monthly"}
                onClick={() => setFrequency("monthly")}
              >
                {t(content.monthlyLabel, locale)}
              </button>
            </div>

            <fieldset className={styles.homeFieldset}>
              <legend>{t(content.amountLabel, locale)}</legend>
              <div className={styles.homeAmountRow}>
                {content.amounts.map((amount) => (
                  <button
                    key={amount.value}
                    type="button"
                    className={
                      amountMode === amount.value
                        ? styles.homeAmountSelected
                        : undefined
                    }
                    aria-pressed={amountMode === amount.value}
                    onClick={() => setAmountMode(amount.value)}
                  >
                    {t(amount.label, locale)}
                  </button>
                ))}
                <button
                  type="button"
                  className={
                    amountMode === "custom"
                      ? styles.homeAmountSelected
                      : undefined
                  }
                  aria-pressed={amountMode === "custom"}
                  onClick={() => setAmountMode("custom")}
                >
                  {t(content.customAmountLabel, locale)}
                </button>
              </div>
              {amountMode === "custom" && (
                <div className={styles.homeCustomAmount}>
                  <label htmlFor={customId}>
                    {t(content.customAmountLabel, locale)}
                  </label>
                  <div className={styles.homeCustomInput}>
                    <span aria-hidden="true">HK$</span>
                    <input
                      id={customId}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={t(content.customAmountPlaceholder, locale)}
                      value={customAmount}
                      aria-invalid={showCustomError}
                      aria-describedby={
                        showCustomError ? errorId : undefined
                      }
                      onChange={(event) => {
                        setCustomAmount(event.target.value);
                        setCustomTouched(true);
                      }}
                      onBlur={() => setCustomTouched(true)}
                    />
                  </div>
                  {showCustomError && (
                    <p
                      id={errorId}
                      className={styles.homeFieldError}
                      role="alert"
                    >
                      {t(content.customAmountError, locale)}
                    </p>
                  )}
                </div>
              )}
            </fieldset>

            <fieldset className={styles.homeFieldset}>
              <legend>{t(content.programmeLabel, locale)}</legend>
              <div className={styles.homeImpactOptions}>
                {content.programmeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      programme === option.value
                        ? styles.homeAmountSelected
                        : undefined
                    }
                    aria-pressed={programme === option.value}
                    onClick={() => setProgramme(option.value)}
                  >
                    {t(option.label, locale)}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className={styles.homeImpactPreview}>
            <p>
              {t(content.supportLabel, locale)}
              {" · "}
              {frequency === "monthly"
                ? t(content.monthlyLabel, locale)
                : t(content.oneTimeLabel, locale)}
            </p>
            <strong>{amountDisplay}</strong>
            <h3>{t(programmeLabel, locale)}</h3>
            <p className={styles.homeImpactMessage} aria-live="polite">
              {impactMessage}
            </p>
            <div className={styles.homeImpactTiles} aria-hidden="true">
              {Array.from({ length: 9 }, (_, tileIndex) => (
                <span
                  key={tileIndex}
                  className={
                    tileIndex < filledTiles ? styles.homeImpactTileFilled : undefined
                  }
                />
              ))}
            </div>
            <p className={styles.homeDonateNote}>{t(content.note, locale)}</p>
            <Link
              className={`${styles.homeButtonPrimary} ${styles.homeButtonFull}`}
              href={hrefFor(content.cta, locale)}
            >
              {t(content.cta.label, locale)}
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
