import Image from "next/image";
import { donationContent, type DonationLocale } from "../content/donation";
import { ButtonLink } from "./ui/ButtonLink";
import { PageIntro } from "./ui/PageIntro";
import { PreviewPanel } from "./ui/PreviewPanel";
import { SectionShell } from "./ui/SectionShell";
import styles from "./DonateExperience.module.css";

export function DonateExperience({ locale }: { locale: DonationLocale }) {
  const c = donationContent;
  const text = (value: Record<DonationLocale, string>) => value[locale];
  const isChinese = locale !== "en";

  return (
    <article className={styles.page}>
      <SectionShell width="standard" className={styles.hero}>
        <PageIntro
          handEyebrow={!isChinese}
          eyebrow={text(c.intro.eyebrow)}
          title={text(c.intro.title)}
          description={text(c.intro.description)}
          scriptNote={text(c.intro.scriptNote)}
        />
        <div className={styles.modeGrid}>
          {c.modes.map((mode, index) => (
            <button
              className={`${styles.modeCard} ${index === 0 ? styles.modeSelected : ""}`}
              type="button"
              key={text(mode.title)}
              aria-pressed={index === 0}
            >
              <span className={`${styles.modeLabel} ${isChinese ? styles.localizedAccent : ""}`}>{text(mode.label)}</span>
              <h2>{text(mode.title)}</h2>
              <p>{text(mode.description)}</p>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell tone="blush" width="wide" className={styles.supportBand}>
        <div className={styles.mainGrid}>
          <PreviewPanel notice={text(c.preview)}>
            <section className={styles.configurator} aria-label={text(c.configurator.title)}>
              <p className={`${styles.accentLabel} ${isChinese ? styles.localizedAccent : ""}`}>{text(c.configurator.eyebrow)}</p>
              <h2>{text(c.configurator.title)}</h2>
              <fieldset disabled>
                <legend className={styles.screenReaderOnly}>{text(c.configurator.title)}</legend>
                <div className={styles.frequency} aria-label={text(c.configurator.title)}>
                  {c.configurator.frequency.map((item, index) => (
                    <button className={index === 0 ? styles.frequencySelected : ""} key={text(item)} type="button">
                      {text(item)}
                    </button>
                  ))}
                </div>
                <p className={styles.controlLabel}>{text(c.configurator.amountLabel)}</p>
                <div className={styles.amountGrid}>
                  {[...c.configurator.amounts, c.configurator.customAmount].map((item, index) => (
                    <button className={index === 1 ? styles.amountSelected : ""} key={text(item)} type="button">
                      {text(item)}
                    </button>
                  ))}
                </div>
                <label className={styles.controlLabel}>
                  {text(c.configurator.programmeLabel)}
                  <select defaultValue="">
                    <option value="" disabled>{text(c.configurator.programmeLabel)}</option>
                    {c.configurator.programmes.map((item) => <option key={text(item)}>{text(item)}</option>)}
                  </select>
                </label>
                <p className={styles.controlLabel}>{text(c.configurator.detailsTitle)}</p>
                <div className={styles.detailsGrid}>
                  {c.configurator.fields.map((item) => (
                    <input aria-label={text(item)} key={text(item)} placeholder={text(item)} />
                  ))}
                </div>
                <p className={styles.controlLabel}>{text(c.configurator.walletsTitle)}</p>
                <div className={styles.walletRow}>
                  {c.configurator.wallets.map((item) => <button key={text(item)} type="button">{text(item)}</button>)}
                </div>
                <input aria-label={text(c.configurator.cardLabel)} placeholder={text(c.configurator.cardLabel)} />
                <button className={styles.previewAction} type="button">{text(c.configurator.action)}</button>
              </fieldset>
              <p className={styles.trustLine}>{text(c.configurator.trustLine)}</p>
            </section>
          </PreviewPanel>

          <aside className={styles.impactPanel}>
            <p className={`${styles.accentLabel} ${isChinese ? styles.localizedAccent : ""}`}>{text(c.impact.eyebrow)}</p>
            <h2>{text(c.impact.title)}</h2>
            <p className={styles.selectedAmount}>{text(c.impact.selectedAmount)}</p>
            <p>{text(c.impact.description)}</p>
            <div className={styles.impactPoints}>
              {c.impact.points.map((point) => (
                <div key={point.value}>
                  <strong>{point.value}</strong>
                  <span>{text(point.label)}</span>
                </div>
              ))}
            </div>
            <p className={styles.impactNote}>{text(c.impact.previewNote)}</p>
          </aside>
        </div>

        <section className={styles.livePayments} aria-labelledby="live-payment-title">
          <div className={styles.liveCopy}>
            <p className={styles.liveLabel}>{text(c.payment.heading)}</p>
            <h2 id="live-payment-title">{text(c.payment.description)}</h2>
          </div>
          <div className={styles.payme}>
            <Image src="/assets/images/payme.png" width={128} height={128} unoptimized alt="Love 21 PayMe" />
            <span>{text(c.payment.payme)}</span>
          </div>
          <div className={styles.moonclerk}>
            <Image src="/assets/images/moonclerk.png" width={180} height={90} unoptimized alt="MoonClerk" />
            <ButtonLink href="https://app.moonclerk.com/pay/2805gcehxjca" external variant="pink">
              {text(c.payment.moonclerk)} <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </section>
      </SectionShell>

      <SectionShell width="wide" className={styles.wishlistSection}>
        <header className={styles.sectionHeading}>
          <p className={`${styles.accentLabel} ${isChinese ? styles.localizedAccent : ""}`}>{text(c.wishlist.eyebrow)}</p>
          <h2>{text(c.wishlist.title)}</h2>
          <p>{text(c.wishlist.description)}</p>
        </header>
        <PreviewPanel notice={text(c.preview)}>
          <div className={styles.wishlistGrid}>
            {c.wishlist.items.map((item, index) => (
              <article className={`${styles.wishlistCard} ${styles[`wishlistTone${index + 1}`]}`} key={text(item.title)}>
                <span>{text(item.status)}</span>
                <h3>{text(item.title)}</h3>
                <button type="button" disabled>{text(c.wishlist.action)}</button>
              </article>
            ))}
          </div>
        </PreviewPanel>
      </SectionShell>

      <SectionShell tone="blue" width="wide" className={styles.fundraiser}>
        <div className={styles.fundraiserInner}>
          <div>
            <p className={`${styles.fundraiserLabel} ${isChinese ? styles.localizedAccent : ""}`}>{text(c.fundraiser.eyebrow)}</p>
            <h2>{text(c.fundraiser.title)}</h2>
            <p>{text(c.fundraiser.description)}</p>
          </div>
          <PreviewPanel notice={text(c.preview)}>
            <button className={styles.fundraiserAction} type="button" disabled>{text(c.fundraiser.action)}</button>
          </PreviewPanel>
        </div>
      </SectionShell>
    </article>
  );
}
