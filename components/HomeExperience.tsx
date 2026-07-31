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
        <div className={styles.homeHeroMedia}>
          <Image
            src={content.hero.image}
            alt={t(content.hero.imageAlt, locale)}
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.homeHeroGradient} aria-hidden="true" />
        </div>
        <div className={styles.homeHeroContent}>
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
            </Link>
            <Link
              className={styles.homeButtonGhost}
              href={hrefFor(content.hero.secondaryCta, locale)}
            >
              {t(content.hero.secondaryCta.label, locale)}
            </Link>
          </div>
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

      <nav
        className={styles.homePaths}
        aria-label={t(content.stakeholderPaths.label, locale)}
      >
        <div className={styles.homeSectionInner}>
          <p className={styles.homePathsLabel}>
            {t(content.stakeholderPaths.label, locale)}
          </p>
          <ul className={styles.homePathsList}>
            {content.stakeholderPaths.items.map((item) => (
              <li key={item.label.en}>
                <Link href={hrefFor(item, locale)}>
                  {t(item.label, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <HomeAbilityStories locale={locale} content={content.stories} />

      <section
        id={content.model.id}
        className={styles.homeModel}
        aria-labelledby="home-model-heading"
      >
        <div className={styles.homeSectionInner}>
          <p className={styles.homeEyebrow}>
            {t(content.model.eyebrow, locale)}
          </p>
          <h2 id="home-model-heading" className={styles.homeSectionTitle}>
            {t(content.model.title, locale)}
          </h2>

          <div className={styles.homeModelGrid}>
            <div className={styles.homeModelCentre}>
              <h3>{t(content.model.centre.title, locale)}</h3>
              <p>{t(content.model.centre.description, locale)}</p>
            </div>
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
                    className={styles.homeTextLink}
                    href={t(pillar.href, locale)}
                  >
                    {t(content.model.detailsLabel, locale)}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id={content.opportunities.id}
        className={styles.homeOpportunities}
        aria-labelledby="home-opportunities-heading"
      >
        <div className={styles.homeSectionInner}>
          <p className={styles.homeEyebrow}>
            {t(content.opportunities.eyebrow, locale)}
          </p>
          <h2
            id="home-opportunities-heading"
            className={styles.homeSectionTitle}
          >
            {t(content.opportunities.title, locale)}
          </h2>
          <div className={styles.homeEmptyState}>
            <h3>{t(content.opportunities.emptyTitle, locale)}</h3>
            <p>{t(content.opportunities.emptyDescription, locale)}</p>
            <div className={styles.homeHeroActions}>
              <Link
                className={styles.homeButtonPrimary}
                href={hrefFor(content.opportunities.volunteerCta, locale)}
              >
                {t(content.opportunities.volunteerCta.label, locale)}
              </Link>
              <Link
                className={styles.homeButtonSecondary}
                href={hrefFor(content.opportunities.contactCta, locale)}
              >
                {t(content.opportunities.contactCta.label, locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeDonatePreview locale={locale} content={content.donatePreview} />

      <section
        id={content.help.id}
        className={styles.homeHelp}
        aria-labelledby="home-help-heading"
      >
        <div className={styles.homeSectionInner}>
          <p className={styles.homeEyebrow}>{t(content.help.eyebrow, locale)}</p>
          <h2 id="home-help-heading" className={styles.homeSectionTitle}>
            {t(content.help.title, locale)}
          </h2>
          <p className={styles.homeSectionLead}>
            {t(content.help.description, locale)}
          </p>
          <div className={styles.homeHelpRows}>
            {content.help.actions.map((action) => (
              <article key={action.id} className={styles.homeHelpRow}>
                <div>
                  <div className={styles.homeHelpHeading}>
                    <h3>{t(action.title, locale)}</h3>
                    {action.status === "planned" && (
                      <span className={styles.homePlannedBadge}>
                        {t(content.help.plannedLabel, locale)}
                      </span>
                    )}
                  </div>
                  <p>{t(action.description, locale)}</p>
                </div>
                <Link
                  className={
                    action.status === "live"
                      ? styles.homeButtonPrimary
                      : styles.homeButtonSecondary
                  }
                  href={hrefFor(action.action, locale)}
                >
                  {t(action.action.label, locale)}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id={content.trust.id}
        className={styles.homeTrust}
        aria-labelledby="home-trust-heading"
      >
        <div className={styles.homeSectionInner}>
          <p className={styles.homeEyebrow}>
            {t(content.trust.eyebrow, locale)}
          </p>
          <h2 id="home-trust-heading" className={styles.homeSectionTitle}>
            {t(content.trust.title, locale)}
          </h2>

          <div className={styles.homeTrustLayout}>
            <div className={styles.homeTrustCopy}>
              <p>{t(content.trust.section88, locale)}</p>
              <p className={styles.homeDignity}>
                <span className={styles.homePlannedBadge}>
                  {t(content.trust.dignityBadge, locale)}
                </span>
                {t(content.trust.dignityStatement, locale)}
              </p>
              <ul className={styles.homeProofList}>
                {content.trust.metrics.map((metric) => (
                  <li key={`trust-${metric.value}`}>
                    <strong>{metric.value}</strong>
                    <span>{t(metric.label, locale)}</span>
                  </li>
                ))}
              </ul>
              <ul className={styles.homeTrustLinks}>
                {content.trust.links.map((link) => (
                  <li key={link.label.en}>
                    <Link
                      className={styles.homeTextLink}
                      href={hrefFor(link, locale)}
                    >
                      {t(link.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={styles.homeSubheading}>
                {t(content.trust.communityLabel, locale)}
              </h3>
              <ul className={styles.homeUpdates}>
                {content.trust.updates.map((update) => (
                  <li key={update.slug}>
                    <Link
                      href={`/${update.slug}/`}
                      className={styles.homeUpdateLink}
                    >
                      {update.image && (
                        <span className={styles.homeUpdateMedia}>
                          <Image
                            src={update.image}
                            alt=""
                            fill
                            sizes="120px"
                          />
                        </span>
                      )}
                      <span>
                        <span className={styles.homeUpdateDate}>
                          {update.date}
                        </span>
                        <strong>{update.title}</strong>
                        <span className={styles.homeUpdateSummary}>
                          {t(update.summary, locale)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className={styles.homeSubheading}>
                {t(content.trust.partnersLabel, locale)}
              </h3>
              <div className={styles.homePartners}>
                {content.trust.partners.map((partner) => (
                  <Image
                    key={partner.src}
                    src={partner.src}
                    alt={t(partner.alt, locale)}
                    width={partner.width}
                    height={partner.height}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.homeFinalCta}
        aria-labelledby="home-final-heading"
      >
        <div className={styles.homeSectionInner}>
          <h2 id="home-final-heading" className={styles.homeFinalTitle}>
            {t(content.finalCta.title, locale)}
          </h2>
          <div className={styles.homeFinalActions}>
            {content.finalCta.actions.map((action) => (
              <Link
                key={action.label.en}
                className={styles.homeButtonPrimary}
                href={hrefFor(action, locale)}
              >
                {t(action.label, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
