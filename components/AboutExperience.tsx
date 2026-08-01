import Image from "next/image";
import Link from "next/link";
import {
  aboutBoardDirectory,
  aboutContent,
  t,
  type AboutLocale,
} from "../content/about";
import { StatusPill } from "./ui/StatusPill";
import styles from "./AboutExperience.module.css";

export function AboutExperience({ locale }: { locale: AboutLocale }) {
  const c = aboutContent;
  const board = aboutBoardDirectory();
  const storiesHref = c.mission.storiesLink.href[locale];
  const financeHref = c.governance.financeLink.href[locale];
  const boardHref = c.governance.boardHref[locale];

  return (
    <article className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-hero-title">
        <div className={styles.heroBlobOne} aria-hidden="true" />
        <div className={styles.heroBlobTwo} aria-hidden="true" />
        <StatusPill tone="blue">{t(c.hero.badge, locale)}</StatusPill>
        <h1 id="about-hero-title">{t(c.hero.title, locale)}</h1>
        <p className={styles.heroLead}>{t(c.hero.description, locale)}</p>
        <p className={styles.heroScript}>{t(c.hero.scriptNote, locale)}</p>
      </section>

      <section className={styles.mission} aria-labelledby="about-mission-title">
        <div className={styles.missionVisual} aria-hidden="true">
          <div className={`${styles.missionCard} ${styles.missionCardPink}`}>
            <Image
              src={c.mission.visuals[0].image}
              alt=""
              fill
              sizes="280px"
            />
          </div>
          <div className={`${styles.missionCard} ${styles.missionCardBlue}`}>
            <Image
              src={c.mission.visuals[1].image}
              alt=""
              fill
              sizes="200px"
            />
          </div>
        </div>
        <div className={styles.missionCopy}>
          <StatusPill tone="pink">{t(c.mission.badge, locale)}</StatusPill>
          <h2 id="about-mission-title">{t(c.mission.title, locale)}</h2>
          {c.mission.paragraphs.map((paragraph) => (
            <p key={paragraph.en}>{t(paragraph, locale)}</p>
          ))}
          <Link className={styles.textLink} href={storiesHref}>
            {t(c.mission.storiesLink.label, locale)}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className={styles.programmes} aria-labelledby="about-programmes-title">
        <div className={styles.sectionIntro}>
          <h2 id="about-programmes-title">{t(c.programmes.title, locale)}</h2>
          <p>{t(c.programmes.lead, locale)}</p>
        </div>
        <div className={styles.programmeGrid}>
          {c.programmes.items.map((item) => (
            <article
              key={item.key}
              className={`${styles.programmeCard} ${styles[`tone_${item.tone}`]}`}
            >
              <div className={styles.programmeMedia}>
                <Image
                  src={item.image}
                  alt={t(item.imageAlt, locale)}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className={styles.programmeBody}>
                <h3>{t(item.title, locale)}</h3>
                <p>{t(item.description, locale)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.governance} aria-labelledby="about-board-title">
        <div className={styles.sectionIntro}>
          <StatusPill tone="blue">{t(c.governance.badge, locale)}</StatusPill>
          <h2 id="about-board-title">{t(c.governance.title, locale)}</h2>
        </div>

        <blockquote className={styles.quote}>
          <p className={styles.quoteLabel}>
            {t(c.governance.messageLabel, locale)}
          </p>
          <p className={styles.quoteBody}>{t(c.governance.quote, locale)}</p>
          <footer className={styles.quoteAttribution}>
            {t(c.governance.quoteAttribution, locale)}
          </footer>
        </blockquote>

        <div className={styles.leadershipRow}>
          {c.governance.leadership.map((leader) => {
            const content = (
              <>
                <strong>{t(leader.name, locale)}</strong>
                <span>{t(leader.role, locale)}</span>
              </>
            );
            if ("href" in leader) {
              return (
                <a
                  key={leader.name.en}
                  href={leader.href}
                  className={styles.leaderCard}
                >
                  {content}
                </a>
              );
            }
            return (
              <Link
                key={leader.name.en}
                href={
                  locale !== "en"
                    ? boardHref
                    : `/board-of-directors/${leader.slug}/`
                }
                className={styles.leaderCard}
              >
                {content}
              </Link>
            );
          })}
        </div>

        <div className={styles.boardBlock}>
          <h3 className={styles.boardHeading}>
            {t(c.governance.boardHeading, locale)}
          </h3>
          <ul className={styles.boardGrid}>
            {board.map((member) => (
              <li key={member.slug}>
                <Link
                  href={
                    locale !== "en"
                      ? boardHref
                      : `/board-of-directors/${member.slug}/`
                  }
                >
                  {member.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link className={styles.governanceLink} href={financeHref}>
            {t(c.governance.financeLink.label, locale)}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
