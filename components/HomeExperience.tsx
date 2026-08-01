import Image from "next/image";
import Link from "next/link";
import {
  homepageContent,
  hrefFor,
  t,
} from "../content/homepage";
import type { Locale } from "../content/site-data";
import { HomeAbilityStories } from "./home/HomeAbilityStories";
import { HomeDonatePreview } from "./home/HomeDonatePreview";
import styles from "./HomeExperience.module.css";

export function HomeExperience({ locale = "en" }: { locale?: Locale }) {
  const content = homepageContent;

  return (
    <div className={styles.homePage}>
      <section className={styles.homeHero} aria-labelledby="home-hero-heading">
        <div className={styles.homeHeroCopy}>
          <p className={styles.homeEyebrow}>{t(content.hero.eyebrow, locale)}</p>
          <h1 id="home-hero-heading" className={styles.homeHeroHeadline}>
            {t(content.hero.headline, locale)}
          </h1>
          <p className={styles.homeHeroSupporting}>
            {t(content.hero.supporting, locale)}
          </p>
          <div className={styles.homeHeroActions}>
            <Link
              className={styles.homeButtonPrimary}
              href={hrefFor(content.hero.primaryCta, locale)}
            >
              {t(content.hero.primaryCta.label, locale)}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className={styles.homeTextLink}
              href={hrefFor(content.hero.secondaryCta, locale)}
            >
              {t(content.hero.secondaryCta.label, locale)}
              <span aria-hidden="true"> ↓</span>
            </Link>
          </div>
        </div>

        <div
          className={styles.homeHeroVisual}
          aria-label={t(content.hero.imageAlt, locale)}
        >
          <figure className={styles.homeHeroPolaroid}>
            <Image
              src={content.hero.image}
              alt={t(content.hero.imageAlt, locale)}
              fill
              priority
              sizes="(max-width: 760px) 90vw, 47vw"
            />
            <figcaption>{t(content.hero.caption, locale)}</figcaption>
          </figure>
          <figure className={styles.homeHeroMiniPolaroid}>
            <Image
              src={content.model.pillars[0].image}
              alt={t(content.model.pillars[0].imageAlt, locale)}
              fill
              sizes="180px"
            />
          </figure>
          <figure className={styles.homeHeroMiniPolaroidAlt}>
            <Image
              src={content.model.pillars[1].image}
              alt={t(content.model.pillars[1].imageAlt, locale)}
              fill
              sizes="160px"
            />
          </figure>
          <div className={styles.homeHeroSticker} aria-hidden="true">
            <span>{t(content.hero.stickers[0], locale)}</span>
            <span>✦</span>
          </div>
        </div>
      </section>

      <section className={styles.homeProofBand} aria-label="Love 21 by the numbers">
        <div className={styles.homeSectionInner}>
          <ul className={styles.homeProofList}>
            {content.hero.metrics.map((metric) => (
              <li key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{t(metric.label, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id={content.model.id}
        className={styles.homeModel}
        aria-labelledby="home-model-heading"
      >
        <div className={styles.homeSectionInner}>
          <div className={styles.homeSectionHeadingSolo}>
            <div>
              <p className={`${styles.homeEyebrow} ${styles.homeEyebrowTeal}`}>
                {t(content.model.eyebrow, locale)}
              </p>
              <h2 id="home-model-heading" className={styles.homeSectionTitle}>
                {t(content.model.title, locale)}
              </h2>
            </div>
            <p className={styles.homeModelCentreLine}>
              <strong>{t(content.model.centre.title, locale)}</strong>
              {" — "}
              {t(content.model.centre.description, locale)}
            </p>
          </div>

          <div className={styles.homeModelGrid}>
            {content.model.pillars.map((pillar) => (
              <article
                key={pillar.key}
                className={[
                  styles.homePillar,
                  pillar.key === "sports" ? styles.homePillar_sports : "",
                  pillar.key === "nutrition" ? styles.homePillar_nutrition : "",
                  pillar.key === "family" ? styles.homePillar_family : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className={styles.homePillarMedia}>
                  <Image
                    src={pillar.image}
                    alt={t(pillar.imageAlt, locale)}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1024px) 45vw, 28vw"
                  />
                </div>
                <div className={styles.homePillarCopy}>
                  <h3>{t(pillar.title, locale)}</h3>
                  <p>{t(pillar.explanation, locale)}</p>
                  <p className={styles.homePillarExample}>
                    {t(pillar.example, locale)}
                  </p>
                  <Link
                    className={styles.homeChipLink}
                    href={t(pillar.href, locale)}
                  >
                    {t(content.model.detailsLabel, locale)}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.homeProgrammeChips} aria-label={t(content.model.title, locale)}>
            {content.model.programmeChips.map((chip) => (
              <Link key={chip.label.en} href={t(chip.href, locale)}>
                {t(chip.label, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeAbilityStories locale={locale} content={content.stories} />

      <section
        id={content.trust.id}
        className={styles.homeImpact}
        aria-labelledby="home-impact-heading"
      >
        <div className={styles.homeSectionInner}>
          <div className={styles.homeImpactLayout}>
            <div>
              <p className={`${styles.homeEyebrow} ${styles.homeEyebrowPurple}`}>
                {t(content.trust.eyebrow, locale)}
              </p>
              <h2
                id="home-impact-heading"
                className={styles.homeSectionTitle}
              >
                {t(content.trust.title, locale)}
              </h2>
              <p className={styles.homeImpactLead}>
                {t(content.trust.section88, locale)}
              </p>
              <ul className={styles.homeTrustLinks}>
                {content.trust.links.map((link) => (
                  <li key={link.label.en}>
                    <Link className={styles.homeChipLink} href={hrefFor(link, locale)}>
                      {t(link.label, locale)} <span aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className={styles.homeImpactMetrics}>
              {content.trust.metrics.map((metric) => (
                <li key={`impact-${metric.value}`}>
                  <strong>{metric.value}</strong>
                  <span>{t(metric.label, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id={content.opportunities.id} className={styles.homeVolunteer} aria-labelledby="home-volunteer-heading">
        <div className={styles.homeSectionInner}>
          <div className={styles.homeVolunteerCard}>
            <div>
              <p className={styles.homeEyebrow}>{t(content.opportunities.eyebrow, locale)}</p>
              <h2 id="home-volunteer-heading">{t(content.opportunities.title, locale)}</h2>
              <p>{t(content.opportunities.emptyDescription, locale)}</p>
            </div>
            <div className={styles.homeVolunteerActions}>
              <Link className={styles.homeButtonPrimary} href={hrefFor(content.opportunities.volunteerCta, locale)}>
                {t(content.opportunities.volunteerCta.label, locale)} <span aria-hidden="true">↗</span>
              </Link>
              <Link className={styles.homeButtonSecondary} href={hrefFor(content.opportunities.contactCta, locale)}>
                {t(content.opportunities.contactCta.label, locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.homeCommunity} aria-labelledby="home-community-heading">
        <div className={styles.homeSectionInner}>
          <div className={styles.homeSectionHeadingSolo}>
            <p className={styles.homeEyebrow}>{t(content.trust.communityLabel, locale)}</p>
            <h2 id="home-community-heading" className={styles.homeSectionTitle}>
              {t(content.trust.communityLabel, locale)}
            </h2>
          </div>
          <div className={styles.homeCommunityGrid}>
            {content.trust.updates.map((update) => (
              <Link key={update.slug} href={`/${update.slug}/`} className={styles.homeCommunityCard}>
                {update.image && (
                  <span className={styles.homeCommunityImage}>
                    <Image src={update.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
                  </span>
                )}
                <span className={styles.homeUpdateDate}>{update.date}</span>
                <strong>{update.title}</strong>
                <span>{t(update.summary, locale)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeDonatePreview locale={locale} content={content.donatePreview} />

      <section
        className={styles.homeFinalCta}
        aria-labelledby="home-final-heading"
      >
        <div className={styles.homeSectionInner}>
          <p className={styles.homeFinalEyebrow}>
            {t(content.finalCta.eyebrow, locale)}
          </p>
          <h2 id="home-final-heading" className={styles.homeFinalTitle}>
            {t(content.finalCta.title, locale)}
          </h2>
          <div className={styles.homeFinalActions}>
            {content.finalCta.actions.map((action) => (
              <Link
                key={action.label.en}
                className={styles.homeButtonGhost}
                href={hrefFor(action, locale)}
              >
                {t(action.label, locale)}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
