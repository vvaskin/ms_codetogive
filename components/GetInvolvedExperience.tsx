"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getInvolvedContent,
  opportunityFilters,
  t,
  volunteerOpportunities,
  type GetInvolvedLocale,
  type OpportunityFilter,
} from "../content/get-involved";
import { ButtonLink } from "./ui/ButtonLink";
import { PreviewPanel } from "./ui/PreviewPanel";
import { StatusPill } from "./ui/StatusPill";
import styles from "./GetInvolvedExperience.module.css";

export function GetInvolvedExperience({
  locale,
  initialSection,
}: {
  locale: GetInvolvedLocale;
  initialSection?: "opportunities" | "corporate";
}) {
  const c = getInvolvedContent;
  const zh = locale !== "en";
  const [filter, setFilter] = useState<OpportunityFilter>("all");

  useEffect(() => {
    if (!initialSection || typeof window === "undefined") return;
    if (window.location.hash) return;
    const target = document.getElementById(initialSection);
    target?.scrollIntoView({ block: "start" });
  }, [initialSection]);

  const filtered = useMemo(
    () =>
      volunteerOpportunities.filter(
        (item) => filter === "all" || item.category === filter,
      ),
    [filter],
  );

  return (
    <article className={`${styles.page} ${zh ? styles.zh : ""}`}>
      <section className={styles.hero} aria-labelledby="get-involved-hero-title">
        <div className={styles.heroBlobOne} aria-hidden="true" />
        <div className={styles.heroBlobTwo} aria-hidden="true" />
        <div className={styles.heroBlobThree} aria-hidden="true" />
        <p className={styles.heroEyebrow}>{t(c.hero.eyebrow, locale)}</p>
        <h1 id="get-involved-hero-title">{t(c.hero.title, locale)}</h1>
        <p className={styles.heroLead}>{t(c.hero.description, locale)}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href={c.hero.primary.href}>
            {t(c.hero.primary.label, locale)}
          </a>
          <a className={styles.outlinePinkButton} href={c.hero.secondary.href}>
            {t(c.hero.secondary.label, locale)}
          </a>
        </div>
        <p className={styles.heroHelper}>{t(c.hero.helper, locale)}</p>
      </section>

      <section className={styles.ways} aria-label={locale === "zh" ? "參與方式" : locale === "cn" ? "参与方式" : "Ways to help"}>
        <article className={`${styles.wayCard} ${styles.wayVolunteer}`}>
          <div className={styles.wayMeta}>
            <span className={styles.wayAudience}>{t(c.ways.volunteer.audience, locale)}</span>
            <StatusPill tone="pink">{t(c.ways.volunteer.badge, locale)}</StatusPill>
          </div>
          <h2>{t(c.ways.volunteer.title, locale)}</h2>
          <p>{t(c.ways.volunteer.description, locale)}</p>
          <a className={styles.wayAction} href={c.ways.volunteer.action.href}>
            {t(c.ways.volunteer.action.label, locale)} <span aria-hidden="true">→</span>
          </a>
        </article>

        <div className={styles.waysSide}>
          <article className={`${styles.wayCard} ${styles.wayCorporate}`}>
            <span className={styles.wayAudience}>{t(c.ways.corporate.audience, locale)}</span>
            <h2>{t(c.ways.corporate.title, locale)}</h2>
            <p>{t(c.ways.corporate.description, locale)}</p>
            <a className={styles.wayAction} href={c.ways.corporate.action.href}>
              {t(c.ways.corporate.action.label, locale)} <span aria-hidden="true">→</span>
            </a>
          </article>

          <article className={`${styles.wayCard} ${styles.wayGive}`}>
            <span className={styles.wayAudience}>{t(c.ways.give.audience, locale)}</span>
            <h2>{t(c.ways.give.title, locale)}</h2>
            <p>{t(c.ways.give.description, locale)}</p>
            <Link className={styles.wayAction} href={c.ways.give.action.href[locale]}>
              {t(c.ways.give.action.label, locale)} <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>

      <section
        id="opportunities"
        className={styles.opportunities}
        aria-labelledby="opportunities-title"
      >
        <div className={styles.opportunitiesInner}>
          <div className={styles.sectionIntro}>
            <StatusPill tone="coral">{t(c.opportunities.badge, locale)}</StatusPill>
            <h2 id="opportunities-title">{t(c.opportunities.title, locale)}</h2>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.chips} role="group" aria-label={locale === "cn" ? "筛选机会" : zh ? "篩選機會" : "Filter opportunities"}>
              {opportunityFilters.map((item) => {
                const selected = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.chip} ${selected ? styles.chipSelected : ""}`}
                    aria-pressed={selected}
                    onClick={() => setFilter(item.id)}
                  >
                    {t(item.label, locale)}
                  </button>
                );
              })}
            </div>
            <Link className={styles.calendarLink} href={c.opportunities.calendarLink.href[locale]}>
              {t(c.opportunities.calendarLink.label, locale)} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <PreviewPanel notice={t(c.opportunities.previewNotice, locale)}>
            {filtered.length === 0 ? (
              <p className={styles.emptyState}>{t(c.opportunities.empty, locale)}</p>
            ) : (
              <ul className={styles.opportunityGrid}>
                {filtered.map((item) => (
                  <li key={item.id}>
                    <article className={styles.opportunityCard}>
                      <div className={styles.opportunityMeta}>
                        <span className={styles.opportunityCategory}>
                          {t(item.categoryLabel, locale)}
                        </span>
                        <span className={styles.opportunitySpots}>{t(item.spots, locale)}</span>
                      </div>
                      <h3>{t(item.title, locale)}</h3>
                      <p className={styles.opportunityDetail}>
                        <span>{t(item.location, locale)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t(item.time, locale)}</span>
                      </p>
                      <p className={styles.opportunityRecurrence}>{t(item.recurrence, locale)}</p>
                      <button type="button" className={styles.signupButton} disabled>
                        {t(c.opportunities.signup, locale)}
                      </button>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </PreviewPanel>
        </div>
      </section>

      <section
        id="corporate"
        className={styles.corporate}
        aria-labelledby="corporate-title"
      >
        <div className={styles.corporateCopy}>
          <StatusPill tone="blue">{t(c.corporate.badge, locale)}</StatusPill>
          <h2 id="corporate-title">{t(c.corporate.title, locale)}</h2>
          <p>{t(c.corporate.description, locale)}</p>
          <ul className={styles.benefitList}>
            {c.corporate.benefits.map((benefit) => (
              <li key={benefit.en}>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                <span>{t(benefit, locale)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.corporateActions}>
            <PreviewPanel notice={t(c.corporate.bookPreviewNotice, locale)}>
              <button type="button" className={styles.primaryButton} disabled>
                {t(c.corporate.bookSession.label, locale)}
              </button>
            </PreviewPanel>
            <ButtonLink href={c.corporate.talkTeam.href[locale]} variant="outline">
              {t(c.corporate.talkTeam.label, locale)}
            </ButtonLink>
          </div>
        </div>

        <aside className={styles.corporatePanel}>
          <p className={styles.howEyebrow}>{t(c.corporate.howItWorks.eyebrow, locale)}</p>
          <ol className={styles.steps}>
            {c.corporate.howItWorks.steps.map((step, index) => (
              <li key={step.title.en}>
                <span className={styles.stepIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{t(step.title, locale)}</strong>
                  <p>{t(step.copy, locale)}</p>
                </div>
              </li>
            ))}
          </ol>
          <blockquote className={styles.quote}>
            <p>{t(c.corporate.quote.body, locale)}</p>
            <footer>
              <cite>{t(c.corporate.quote.attribution, locale)}</cite>
              <span>{t(c.corporate.quote.note, locale)}</span>
            </footer>
          </blockquote>
        </aside>
      </section>

      <section className={styles.bottomCta} aria-labelledby="bottom-cta-title">
        <div className={styles.bottomInner}>
          <div>
            <h2 id="bottom-cta-title">{t(c.bottomCta.title, locale)}</h2>
            <p>{t(c.bottomCta.description, locale)}</p>
          </div>
          <div className={styles.bottomActions}>
            <ButtonLink href={c.bottomCta.volunteer.href[locale]} variant="pink">
              {t(c.bottomCta.volunteer.label, locale)}
            </ButtonLink>
            <ButtonLink href={c.bottomCta.corporate.href[locale]} variant="outline">
              {t(c.bottomCta.corporate.label, locale)}
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
