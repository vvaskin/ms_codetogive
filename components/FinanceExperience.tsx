import { financeContent, t, type FinanceLocale } from "../content/finance";
import { StatusPill } from "./ui/StatusPill";
import { FinanceContent } from "./FinanceContent";
import styles from "./FinanceExperience.module.css";

export function FinanceExperience({ locale }: { locale: FinanceLocale }) {
  const c = financeContent;

  return (
    <article className={styles.page}>
      <section className={styles.hero} aria-labelledby="finance-hero-title">
        <div className={styles.heroBlobOne} aria-hidden="true" />
        <div className={styles.heroBlobTwo} aria-hidden="true" />
        <div className={styles.heroBlobThree} aria-hidden="true" />
        <StatusPill tone="blue">{t(c.hero.badge, locale)}</StatusPill>
        <h1 id="finance-hero-title">{t(c.hero.title, locale)}</h1>
        <p className={styles.heroLead}>{t(c.hero.description, locale)}</p>
      </section>

      <FinanceContent locale={locale} />
    </article>
  );
}
