import Image from "next/image";
import { programmeText, programmesContent } from "../content/programmes";
import type { Locale } from "../content/site-data";
import { ButtonLink } from "./ui/ButtonLink";
import { SectionShell } from "./ui/SectionShell";
import { StatusPill } from "./ui/StatusPill";
import styles from "./ProgrammesExperience.module.css";

export function ProgrammesExperience({ locale }: { locale: Locale }) {
  const c = programmesContent;
  const isChinese = locale === "zh";

  return (
    <article className={`${styles.page} ${isChinese ? styles.zh : ""}`}>
      <SectionShell tone="canvas" className={styles.hero}>
        <div className={styles.heroGlowOne} aria-hidden="true" />
        <div className={styles.heroGlowTwo} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{programmeText(c.hero.eyebrow, locale)}</p>
          <h1>
            {programmeText(c.hero.title, locale)}{" "}
            <span>{programmeText(c.hero.accent, locale)}</span>
          </h1>
          <p className={styles.heroDescription}>
            {programmeText(c.hero.description, locale)}
          </p>
          <p className={styles.scriptNote}>
            {programmeText(c.hero.scriptNote, locale)}
          </p>
          <div className={styles.heroActions}>
            <ButtonLink href={c.hero.primaryCta.href[locale]}>
              {programmeText(c.hero.primaryCta.label, locale)}
            </ButtonLink>
            <ButtonLink href={c.hero.secondaryCta.href[locale]} variant="outline">
              {programmeText(c.hero.secondaryCta.label, locale)}
            </ButtonLink>
          </div>
          <ul className={styles.heroChips} aria-label={programmeText(c.hero.eyebrow, locale)}>
            {c.hero.activities.map((activity) => (
              <li key={activity.en}>{programmeText(activity, locale)}</li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell tone="white" className={styles.metrics} aria-label="Love 21 impact">
        <ul className={styles.metricsList}>
          {c.metrics.map((metric) => (
            <li key={metric.value}>
              <strong>{metric.value}</strong>
              <span>{programmeText(metric.label, locale)}</span>
            </li>
          ))}
        </ul>
      </SectionShell>

      {c.programmes.map((programme, index) => (
        <SectionShell
          id={programme.id}
          key={programme.id}
          tone={index === 0 ? "blush" : index === 2 ? "sky" : "white"}
          className={`${styles.programmeBand} ${index % 2 === 1 ? styles.reverse : ""}`}
        >
          <div className={styles.programmeLayout}>
            <div className={styles.photoFrame}>
              <div className={styles.photoAccent} aria-hidden="true" />
              <Image
                src={programme.image}
                alt={programmeText(programme.imageAlt, locale)}
                fill
                unoptimized
                sizes="(max-width: 900px) calc(100vw - 2 * var(--layout-gutter)), 50vw"
              />
            </div>
            <div className={styles.programmeCopy}>
              <StatusPill tone={index === 1 ? "teal" : index === 2 ? "blue" : "pink"}>
                {programmeText(programme.eyebrow, locale)}
              </StatusPill>
              <h2>{programmeText(programme.title, locale)}</h2>
              {programme.paragraphs.map((paragraph) => (
                <p key={paragraph.en}>{programmeText(paragraph, locale)}</p>
              ))}
              <ul className={styles.activityChips}>
                {programme.activities.map((activity) => (
                  <li key={activity.en}>{programmeText(activity, locale)}</li>
                ))}
              </ul>
              <ButtonLink href={programme.action.href[locale]} variant="quiet">
                {programmeText(programme.action.label, locale)} <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>
          </div>
        </SectionShell>
      ))}

      <SectionShell tone="sky" className={styles.community}>
        <div className={styles.communityCopy}>
          <p className={styles.eyebrow}>{programmeText(c.community.eyebrow, locale)}</p>
          <h2>{programmeText(c.community.title, locale)}</h2>
          <p>{programmeText(c.community.description, locale)}</p>
        </div>
        <div className={styles.communityActions}>
          <ButtonLink href={c.community.volunteerCta.href[locale]} variant="teal">
            {programmeText(c.community.volunteerCta.label, locale)}
          </ButtonLink>
          <ButtonLink href={c.community.calendarCta.href[locale]} variant="outline">
            {programmeText(c.community.calendarCta.label, locale)}
          </ButtonLink>
        </div>
      </SectionShell>

      <SectionShell tone="blue" className={styles.donate}>
        <div>
          <p className={styles.donateEyebrow}>{programmeText(c.donate.eyebrow, locale)}</p>
          <h2>{programmeText(c.donate.title, locale)}</h2>
          <p>{programmeText(c.donate.description, locale)}</p>
        </div>
        <ButtonLink href={c.donate.cta.href[locale]} variant="pink">
          {programmeText(c.donate.cta.label, locale)}
        </ButtonLink>
      </SectionShell>
    </article>
  );
}
