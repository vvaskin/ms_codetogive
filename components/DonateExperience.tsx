"use client";

import Image from "next/image";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  donationContent,
  type DonationFrequency,
  type DonationLocale,
  type DonationModeId,
  type FundableEvent,
  type Localized,
  type PaymentMethodId,
  type WishlistItem,
} from "../content/donation";
import { SectionShell } from "./ui/SectionShell";
import styles from "./DonateExperience.module.css";

const moonclerkUrl = "https://app.moonclerk.com/pay/2805gcehxjca";
type CopyTarget = "hsbc" | "fps";

function formatHkd(value: number, locale: DonationLocale) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-HK" : "en-HK", {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0,
  }).format(value);
}

function localize(value: Localized, locale: DonationLocale) {
  return value[locale];
}

function EventPreview({
  event,
  locale,
  onClose,
}: {
  event: FundableEvent;
  locale: DonationLocale;
  onClose: () => void;
}) {
  const c = donationContent.events;
  const [amount, setAmount] = useState("400");
  const [confirmed, setConfirmed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const parsedAmount = Number(amount);
  const isValid = Number.isInteger(parsedAmount) && parsedAmount >= 1;

  useEffect(() => {
    dialogRef.current?.focus();
    const closeOnEscape = (keyboardEvent: globalThis.KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, [confirmed]);

  function confirm(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    if (!isValid) return;
    setConfirmed(true);
  }

  return (
    <div className={styles.dialogBackdrop} role="presentation" onMouseDown={(eventMouse) => {
      if (eventMouse.target === eventMouse.currentTarget) onClose();
    }}>
      <div
        aria-describedby={confirmed ? undefined : "event-preview-notice"}
        aria-labelledby="event-preview-title"
        aria-modal="true"
        className={styles.dialog}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        onKeyDown={(keyEvent) => {
          if (keyEvent.key !== "Tab") return;
          const focusable = Array.from(
            keyEvent.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), a[href]',
            ),
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (keyEvent.shiftKey && document.activeElement === first) {
            keyEvent.preventDefault();
            last.focus();
          } else if (!keyEvent.shiftKey && document.activeElement === last) {
            keyEvent.preventDefault();
            first.focus();
          }
        }}
      >
        <button className={styles.dialogClose} type="button" onClick={onClose} aria-label={localize(c.close, locale)}>×</button>
        {confirmed ? (
          <div className={styles.confirmation} role="status">
            <span aria-hidden="true">♡</span>
            <h2 id="event-preview-title">{localize(c.successTitle, locale)}</h2>
            <p>
              <strong>{formatHkd(parsedAmount, locale)}</strong> · {localize(event.title, locale)}
            </p>
            <p>{localize(c.successDescription, locale)}</p>
            <button type="button" onClick={() => setConfirmed(false)}>{localize(c.tryAgain, locale)}</button>
          </div>
        ) : (
          <form onSubmit={confirm}>
            <p className={styles.dialogEyebrow}>{localize(event.categoryLabel, locale)}</p>
            <h2 id="event-preview-title">{localize(c.previewTitle, locale)}</h2>
            <p className={styles.dialogEvent}>{localize(event.title, locale)}</p>
            <label>
              {localize(c.previewAmount, locale)}
              <span className={styles.amountInput}>
                <span>HK$</span>
                <input
                  min="1"
                  step="1"
                  inputMode="numeric"
                  type="number"
                  value={amount}
                  onChange={(changeEvent) => setAmount(changeEvent.target.value)}
                  required
                />
              </span>
            </label>
            <p className={styles.demoNotice} id="event-preview-notice">{localize(c.previewNotice, locale)}</p>
            <button className={styles.primaryAction} type="submit" disabled={!isValid}>
              {localize(c.previewAction, locale)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function MoneyPanel({ locale, active }: { locale: DonationLocale; active: boolean }) {
  const c = donationContent;
  const money = c.money;
  const [frequency, setFrequency] = useState<DonationFrequency>("monthly");
  const [presetAmount, setPresetAmount] = useState(400);
  const [customActive, setCustomActive] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [programme, setProgramme] = useState("greatest-need");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("payme");
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);

  const customNumber = Number(customAmount);
  const customValid = Number.isInteger(customNumber) && customNumber >= 1;
  const effectiveAmount = customActive ? (customValid ? customNumber : 0) : presetAmount;
  const selectedProgramme = money.programmes.find((item) => item.id === programme) ?? money.programmes[0];

  function selectPreset(amount: number) {
    setPresetAmount(amount);
    setCustomActive(false);
    setCustomAmount("");
  }

  async function copyPaymentDetail(target: CopyTarget, value: string) {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      setCopyFailed(false);
    } catch {
      setCopiedTarget(null);
      setCopyFailed(true);
    }
  }

  return (
    <section aria-labelledby="donation-tab-money" className={styles.moneySection} hidden={!active} id="donation-panel-money" role="tabpanel" tabIndex={active ? 0 : -1}>
      <div className={styles.moneyGrid}>
        <div className={styles.configurator}>
          <h2 className={styles.screenReaderOnly} id="money-panel-title">{localize(c.modes[0].title, locale)}</h2>
          <fieldset className={styles.frequencyFieldset}>
            <legend className={styles.screenReaderOnly}>{localize(money.frequencyLabel, locale)}</legend>
            <div className={styles.frequency}>
              {(["monthly", "one-time"] as DonationFrequency[]).map((item) => (
                <label className={frequency === item ? styles.frequencySelected : ""} key={item}>
                  <input
                    checked={frequency === item}
                    name="donation-frequency"
                    onChange={() => setFrequency(item)}
                    type="radio"
                    value={item}
                  />
                  <span>{localize(money.frequency[item], locale)}</span>
                  {item === "monthly" && <small>{localize(money.mostImpact, locale)}</small>}
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.formHeading}>
            <h3>{localize(money.amountLabel, locale)}</h3>
          </div>
          <div className={styles.amountGrid}>
            {money.amounts.map((amount) => (
              <button
                aria-pressed={!customActive && presetAmount === amount}
                className={!customActive && presetAmount === amount ? styles.amountSelected : ""}
                key={amount}
                onClick={() => selectPreset(amount)}
                type="button"
              >
                <strong>{formatHkd(amount, locale)}<small>{frequency === "monthly" ? "/mo" : ""}</small></strong>
                <span>{localize(money.amountDescriptions[amount], locale)}</span>
              </button>
            ))}
            <button
              aria-pressed={customActive}
              className={customActive ? styles.amountSelected : ""}
              onClick={() => setCustomActive(true)}
              type="button"
            >
              <strong>{localize(money.custom, locale)}</strong>
              <span>{localize(money.customHint, locale)}</span>
            </button>
          </div>
          {customActive && (
            <label className={styles.customAmount}>
              {localize(money.customLabel, locale)}
              <span className={styles.amountInput}>
                <span>HK$</span>
                <input
                  aria-invalid={customAmount.length > 0 && !customValid}
                  autoFocus
                  inputMode="numeric"
                  min="1"
                  onChange={(event) => setCustomAmount(event.target.value)}
                  placeholder={localize(money.customPlaceholder, locale)}
                  step="1"
                  type="number"
                  value={customAmount}
                />
              </span>
              {customAmount.length > 0 && !customValid && <span className={styles.fieldError}>{localize(money.invalidAmount, locale)}</span>}
            </label>
          )}

          <label className={styles.programmeSelect}>
            {localize(money.programmeLabel, locale)}
            <select value={programme} onChange={(event) => setProgramme(event.target.value)}>
              {money.programmes.map((item) => <option key={item.id} value={item.id}>{localize(item.label, locale)}</option>)}
            </select>
          </label>

          <div className={styles.paymentSection}>
            <h3>{localize(money.paymentTitle, locale)}</h3>
            <div className={styles.paymentOptions}>
              <button
                aria-pressed={paymentMethod === "payme"}
                className={paymentMethod === "payme" ? styles.paymentSelected : ""}
                onClick={() => setPaymentMethod("payme")}
                type="button"
              >
                <strong>{localize(money.paymeLabel, locale)}</strong>
                <span>{localize(money.paymeDescription, locale)}</span>
              </button>
              <button
                aria-pressed={paymentMethod === "moonclerk"}
                className={paymentMethod === "moonclerk" ? styles.paymentSelected : ""}
                onClick={() => setPaymentMethod("moonclerk")}
                type="button"
              >
                <strong>{localize(money.moonclerkLabel, locale)}</strong>
                <span>{localize(money.moonclerkDescription, locale)}</span>
              </button>
            </div>

            <div className={styles.paymentCompletion} aria-live="polite">
              {effectiveAmount < 1 ? (
                <p className={styles.fieldError} role="alert">{localize(money.invalidAmount, locale)}</p>
              ) : paymentMethod === "payme" ? (
                <div className={styles.paymeCompletion}>
                  <Image src="/assets/images/payme.png" width={148} height={148} unoptimized alt="Love 21 PayMe QR code" />
                  <div>
                    <strong>{localize(money.paymeInstruction, locale)}</strong>
                    <p>{formatHkd(effectiveAmount, locale)} · {localize(money.frequency[frequency], locale)} · {localize(selectedProgramme.label, locale)}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.moonclerkCompletion}>
                  <Image src="/assets/images/moonclerk.png" width={180} height={90} unoptimized alt="MoonClerk" />
                  <div>
                    <p>{localize(money.moonclerkNote, locale)}</p>
                    <a href={moonclerkUrl} target="_blank" rel="noreferrer">
                      {localize(money.moonclerkAction, locale)} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <aside className={styles.receiptCallout} aria-labelledby="receipt-title">
              <span aria-hidden="true">✉</span>
              <div>
                <strong id="receipt-title">{localize(money.receipt.title, locale)}</strong>
                <p>{localize(money.receipt.description, locale)}</p>
              </div>
              <a href={`mailto:${money.receipt.email}?subject=${encodeURIComponent(localize(money.receipt.subject, locale))}`}>
                {localize(money.receipt.action, locale)}
              </a>
            </aside>

            <details className={styles.alternativePayments}>
              <summary>
                <span>
                  <strong>{localize(money.alternativePayments.summary, locale)}</strong>
                  <small>{localize(money.alternativePayments.intro, locale)}</small>
                </span>
              </summary>
              <div className={styles.alternativePaymentBody}>
                <div className={styles.transferList}>
                  <div className={styles.transferRow}>
                    <div>
                      <span>{localize(money.alternativePayments.hsbcLabel, locale)}</span>
                      <code>{money.alternativePayments.hsbcAccount}</code>
                    </div>
                    <button
                      aria-label={`${localize(money.alternativePayments.copy, locale)} ${localize(money.alternativePayments.hsbcLabel, locale)}`}
                      onClick={() => copyPaymentDetail("hsbc", money.alternativePayments.hsbcAccount)}
                      type="button"
                    >
                      {localize(copiedTarget === "hsbc" ? money.alternativePayments.copied : money.alternativePayments.copy, locale)}
                    </button>
                  </div>
                  <div className={styles.transferRow}>
                    <div>
                      <span>{localize(money.alternativePayments.fpsLabel, locale)}</span>
                      <code>{money.alternativePayments.fpsId}</code>
                    </div>
                    <button
                      aria-label={`${localize(money.alternativePayments.copy, locale)} ${localize(money.alternativePayments.fpsLabel, locale)}`}
                      onClick={() => copyPaymentDetail("fps", money.alternativePayments.fpsId)}
                      type="button"
                    >
                      {localize(copiedTarget === "fps" ? money.alternativePayments.copied : money.alternativePayments.copy, locale)}
                    </button>
                  </div>
                </div>
                <div className={styles.chequeDetails}>
                  <strong>{localize(money.alternativePayments.chequeTitle, locale)}</strong>
                  <dl>
                    <div>
                      <dt>{localize(money.alternativePayments.payeeLabel, locale)}</dt>
                      <dd>{money.alternativePayments.payee}</dd>
                    </div>
                    <div>
                      <dt>{localize(money.alternativePayments.addressLabel, locale)}</dt>
                      <dd>{money.alternativePayments.address}</dd>
                    </div>
                  </dl>
                </div>
                {copyFailed && (
                  <p className={styles.copyError} role="status">
                    {localize(money.alternativePayments.copyUnavailable, locale)}
                  </p>
                )}
                <p className={styles.screenReaderOnly} aria-live="polite">
                  {copiedTarget
                    ? `${localize(copiedTarget === "hsbc" ? money.alternativePayments.hsbcLabel : money.alternativePayments.fpsLabel, locale)}: ${localize(money.alternativePayments.copied, locale)}`
                    : ""}
                </p>
              </div>
            </details>
          </div>
        </div>

        <aside className={styles.impactColumn} aria-live="polite">
          <section className={styles.impactSummary}>
            <p className={styles.accentLabel}>{localize(c.impact.eyebrow, locale)}</p>
            <p className={styles.impactAmount}>
              <strong>{formatHkd(effectiveAmount, locale)}</strong>
              {frequency === "monthly" && <span>/ {localize(money.frequency.monthly, locale).toLowerCase()}</span>}
            </p>
            <p>{frequency === "monthly" ? localize(c.impact.monthlyDescription, locale) : localize(c.impact.oneTimeDescription, locale)}</p>
          </section>

          <section className={styles.allocationCard}>
            <div className={styles.whiteCard}>
              <h2>{localize(c.impact.allocationTitle, locale)}</h2>
              <div className={styles.allocationBar} aria-hidden="true">
                {c.impact.allocations.map((item) => <span className={styles[`allocation${item.tone}`]} key={item.tone} style={{ width: `${item.value}%` }} />)}
              </div>
              <ul className={styles.allocationLegend}>
                {c.impact.allocations.map((item) => (
                  <li key={item.tone}><span className={styles[`dot${item.tone}`]} />{localize(item.label, locale)} <strong>{item.value === 5 ? "<5" : item.value}%</strong></li>
                ))}
              </ul>
            </div>
            <div className={styles.whiteCard}>
              <h2>{localize(c.impact.commitmentTitle, locale)}</h2>
              <ul className={styles.commitments}>
                {c.impact.commitments.map((item) => <li key={item.en}><span aria-hidden="true">✓</span>{localize(item, locale)}</li>)}
              </ul>
              <a className={styles.reportLink} href={locale === "zh" ? "/zh/our-finance-hk/" : "/our-finance/"}>
                {localize(c.impact.reportAction, locale)} <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function EventsPanel({ locale, active }: { locale: DonationLocale; active: boolean }) {
  const c = donationContent.events;
  const [selectedEvent, setSelectedEvent] = useState<FundableEvent | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function closePreview() {
    const eventId = selectedEvent?.id;
    setSelectedEvent(null);
    if (eventId) requestAnimationFrame(() => triggerRefs.current[eventId]?.focus());
  }

  return (
    <section aria-labelledby="donation-tab-events" className={styles.eventsSection} hidden={!active} id="donation-panel-events" role="tabpanel" tabIndex={active ? 0 : -1}>
      <header className={styles.sectionHeading}>
        <p className={styles.accentLabel}>{localize(c.eyebrow, locale)}</p>
        <h2 id="events-panel-title">{localize(c.title, locale)}</h2>
        <p>{localize(c.description, locale)}</p>
        <span>{localize(c.listEyebrow, locale)}</span>
        <h3>{localize(c.listTitle, locale)}</h3>
      </header>
      <div className={styles.eventScroller}>
        {c.items.map((item, index) => (
          <article className={`${styles.eventCard} ${styles[`eventTone${index + 1}`]}`} key={item.id}>
            <div className={styles.eventMedia} aria-hidden="true" />
            <div className={styles.eventBody}>
              <span className={`${styles.category} ${styles[`category${item.category}`]}`}>{localize(item.categoryLabel, locale)}</span>
              <h3>{localize(item.title, locale)}</h3>
              <p className={styles.eventSchedule}>{localize(item.schedule, locale)}</p>
              <p>{localize(item.description, locale)}</p>
              <details className={styles.needs}>
                <summary>{localize(c.needsTitle, locale)}</summary>
                <ul>
                  {item.needs.map((need) => <li key={need.label.en}><span>{localize(need.label, locale)}</span><strong>{localize(need.detail, locale)}</strong></li>)}
                </ul>
              </details>
              <div className={styles.goalLine}>
                <strong>{localize(c.goalLabel, locale)}: {formatHkd(item.goalHkd, locale)}</strong>
                <span>{item.progressPercent}% {localize(c.fundedLabel, locale)}</span>
              </div>
              <div className={styles.progressTrack} role="progressbar" aria-label={`${localize(item.title, locale)}: ${item.progressPercent}% ${localize(c.fundedLabel, locale)}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.progressPercent}>
                <span style={{ width: `${item.progressPercent}%` }} />
              </div>
              <button
                className={styles.eventAction}
                onClick={() => setSelectedEvent(item)}
                ref={(element) => { triggerRefs.current[item.id] = element; }}
                type="button"
              >
                {localize(c.action, locale)}
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.scrollHint}>{locale === "zh" ? "在小螢幕上左右滑動查看更多" : "Swipe sideways on smaller screens to see more"}</p>
      {active && selectedEvent && <EventPreview event={selectedEvent} locale={locale} onClose={closePreview} />}
    </section>
  );
}

function ItemsPanel({ locale, active }: { locale: DonationLocale; active: boolean }) {
  const c = donationContent.wishlist;
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  return (
    <section aria-labelledby="donation-tab-items" className={styles.itemsSection} hidden={!active} id="donation-panel-items" role="tabpanel" tabIndex={active ? 0 : -1}>
      <header className={styles.sectionHeading}>
        <p className={styles.accentLabel}>{localize(c.eyebrow, locale)}</p>
        <h2 id="items-panel-title">{localize(c.title, locale)}</h2>
        <p>{localize(c.description, locale)}</p>
        <small className={styles.partnerNote}>{localize(c.partnerNote, locale)}</small>
      </header>
      {selectedItem && (
        <div className={styles.itemConfirmation} role="status">
          <span aria-hidden="true">♡</span>
          <div>
            <strong>{localize(c.selectedTitle, locale)}: {localize(selectedItem.title, locale)}</strong>
            <p>{localize(c.selectedDescription, locale)}</p>
          </div>
          <button type="button" onClick={() => setSelectedItem(null)}>{localize(c.reset, locale)}</button>
        </div>
      )}
      <div className={styles.wishlistScroller}>
        {c.items.map((item, index) => (
          <article className={`${styles.wishlistCard} ${styles[`wishlistTone${index + 1}`]}`} key={item.id}>
            <div className={styles.wishlistMedia} aria-hidden="true" />
            <div>
              <span>{localize(item.status, locale)}</span>
              <h3>{localize(item.title, locale)}</h3>
              <button aria-pressed={selectedItem?.id === item.id} onClick={() => setSelectedItem(item)} type="button">{localize(c.action, locale)}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DonateExperience({ locale }: { locale: DonationLocale }) {
  const c = donationContent;
  const [mode, setMode] = useState<DonationModeId>("money");
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const isChinese = locale === "zh";

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % c.modes.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + c.modes.length) % c.modes.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = c.modes.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextMode = c.modes[nextIndex];
    setMode(nextMode.id);
    tabsRef.current[nextIndex]?.focus();
  }

  return (
    <article className={`${styles.page} ${isChinese ? styles.zh : ""}`}>
      <SectionShell width="standard" className={styles.hero}>
        <header className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{localize(c.intro.eyebrow, locale)}</p>
          <h1>{localize(c.intro.title, locale)}</h1>
          <p>{localize(c.intro.description, locale)}</p>
        </header>
        <div aria-label={isChinese ? "選擇捐贈方式" : "Choose a donation mode"} className={styles.modeGrid} role="tablist">
          {c.modes.map((item, index) => (
            <button
              aria-controls={`donation-panel-${item.id}`}
              aria-selected={mode === item.id}
              className={`${styles.modeCard} ${mode === item.id ? styles.modeSelected : ""}`}
              id={`donation-tab-${item.id}`}
              key={item.id}
              onClick={() => setMode(item.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              ref={(element) => { tabsRef.current[index] = element; }}
              role="tab"
              tabIndex={mode === item.id ? 0 : -1}
              type="button"
            >
              <span>{localize(item.label, locale)}</span>
              <strong>{localize(item.title, locale)}</strong>
            </button>
          ))}
        </div>
      </SectionShell>

      <div className={styles.modePanel}>
        <MoneyPanel active={mode === "money"} locale={locale} />
        <EventsPanel active={mode === "events"} locale={locale} />
        <ItemsPanel active={mode === "items"} locale={locale} />
      </div>

      <SectionShell tone="blue" width="wide" className={styles.fundraiser}>
        <div className={styles.fundraiserInner}>
          <div>
            <p>{localize(c.fundraiser.eyebrow, locale)}</p>
            <h2>{localize(c.fundraiser.title, locale)}</h2>
            <span>{localize(c.fundraiser.description, locale)}</span>
          </div>
          <button disabled type="button">
            {localize(c.fundraiser.action, locale)}
            <small>{localize(c.fundraiser.comingSoon, locale)}</small>
          </button>
        </div>
      </SectionShell>
    </article>
  );
}
