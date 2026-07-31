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
          <ul className={styles.homeProofList}>
            {content.hero.metrics.map((metric) => (
              <li key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{t(metric.label, locale)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={styles.homeHeroVisual}
          aria-label={t(content.hero.imageAlt, locale)}
        >
          <Image
            src={content.hero.image}
            alt={t(content.hero.imageAlt, locale)}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div className={styles.homeHeroCaption}>
            <span className={styles.homePulse} aria-hidden="true" />
            {t(content.hero.caption, locale)}
          </div>
          <div className={styles.homeHeroSticker} aria-hidden="true">
            {content.hero.stickers.map((sticker) => (
              <span key={sticker.en}>{t(sticker, locale)}</span>
            ))}
          </div>
        </div>
      </section>

      <section
        className={styles.homeJourney}
        aria-label={t(content.journey.label, locale)}
      >
        {content.journey.steps.map((step, index) => (
          <div key={step.en}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{t(step, locale)}</strong>
          </div>
        ))}
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
                  <span aria-hidden="true">↗</span>
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
        </div>
      </section>

      <section
        id={content.opportunities.id}
        className={styles.homeOpportunities}
        aria-labelledby="home-opportunities-heading"
      >
        <div className={styles.homeSectionInner}>
          <div className={styles.homeSectionHeadingSolo}>
            <div>
              <p className={`${styles.homeEyebrow} ${styles.homeEyebrowTeal}`}>
                {t(content.opportunities.eyebrow, locale)}
              </p>
              <h2
                id="home-opportunities-heading"
                className={styles.homeSectionTitle}
              >
                {t(content.opportunities.title, locale)}
              </h2>
            </div>
          </div>

          {content.opportunities.activities.length > 0 ? (
            <>
              <div className={styles.homeEventToolbar}>
                <span>{t(content.opportunities.filterLabel, locale)}</span>
                <p className={styles.homeDemoNote}>
                  {t(content.opportunities.demoNote, locale)}
                </p>
              </div>
              <div className={styles.homeEventGrid}>
                {content.opportunities.activities.map((activity) => (
                  <article key={activity.id} className={styles.homeEventCard}>
                    <div className={styles.homeEventImage}>
                      <Image
                        src={activity.image}
                        alt={t(activity.imageAlt, locale)}
                        fill
                        sizes="(max-width: 760px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {activity.badge && (
                        <span>{t(activity.badge, locale)}</span>
                      )}
                    </div>
                    <div className={styles.homeEventContent}>
                      <div className={styles.homeEventDate}>
                        <strong>{activity.day}</strong>
                        <span>{t(activity.month, locale)}</span>
                      </div>
                      <div>
                        <h3>{t(activity.title, locale)}</h3>
                        <p>
                          {t(activity.time, locale)} ·{" "}
                          {t(activity.location, locale)}
                        </p>
                        <p className={styles.homeEventRole}>
                          {t(activity.role, locale)}
                        </p>
                      </div>
                    </div>
                    <Link
                      className={`${styles.homeButtonDark} ${styles.homeButtonFull}`}
                      href={hrefFor(activity.action, locale)}
                    >
                      {t(activity.action.label, locale)}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ))}
              </div>
              <div className={styles.homeEventFooter}>
                <Link
                  className={styles.homeButtonGhostSoft}
                  href={hrefFor(content.opportunities.volunteerCta, locale)}
                >
                  {t(content.opportunities.volunteerCta.label, locale)}
                </Link>
                <Link
                  className={styles.homeChipLink}
                  href={hrefFor(content.opportunities.contactCta, locale)}
                >
                  {t(content.opportunities.contactCta.label, locale)}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </>
          ) : (
            <div className={styles.homeEmptyState}>
              <span className={styles.homeEmptyBadge}>
                {t(content.opportunities.emptyBadge, locale)}
              </span>
              <h3>{t(content.opportunities.emptyTitle, locale)}</h3>
              <p>{t(content.opportunities.emptyDescription, locale)}</p>
              <div className={styles.homeHeroActions}>
                <Link
                  className={styles.homeButtonDark}
                  href={hrefFor(content.opportunities.volunteerCta, locale)}
                >
                  {t(content.opportunities.volunteerCta.label, locale)}
                  <span aria-hidden="true">↗</span>
                </Link>
                <Link
                  className={styles.homeButtonGhostSoft}
                  href={hrefFor(content.opportunities.contactCta, locale)}
                >
                  {t(content.opportunities.contactCta.label, locale)}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <HomeDonatePreview locale={locale} content={content.donatePreview} />

      <section
        id={content.help.id}
        className={styles.homeHelp}
        aria-labelledby="home-help-heading"
      >
        <div className={styles.homeSectionInner}>
          <div className={styles.homeSectionHeadingSolo}>
            <div>
              <p className={`${styles.homeEyebrow} ${styles.homeEyebrowCoral}`}>
                {t(content.help.eyebrow, locale)}
              </p>
              <h2 id="home-help-heading" className={styles.homeSectionTitle}>
                {t(content.help.title, locale)}
              </h2>
            </div>
          </div>
          <div className={styles.homeHelpRows}>
            {content.help.actions.map((action, index) => (
              <article key={action.id} className={styles.homeHelpRow}>
                <span className={styles.homeHelpIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
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
                      : styles.homeButtonGhostSoft
                  }
                  href={hrefFor(action.action, locale)}
                >
                  {t(action.action.label, locale)}
                  <span aria-hidden="true">↗</span>
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
          <div className={styles.homeSectionHeadingSolo}>
            <div>
              <p className={`${styles.homeEyebrow} ${styles.homeEyebrowCobalt}`}>
                {t(content.trust.eyebrow, locale)}
              </p>
              <h2 id="home-trust-heading" className={styles.homeSectionTitle}>
                {t(content.trust.title, locale)}
              </h2>
            </div>
          </div>

          <div className={styles.homeTrustLayout}>
            <div className={styles.homeTrustCopy}>
              <div className={styles.homeTrustCard}>
                <p>{t(content.trust.section88, locale)}</p>
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
                        className={styles.homeChipLink}
                        href={hrefFor(link, locale)}
                      >
                        {t(link.label, locale)}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <p className={styles.homeDignity}>
                <span className={styles.homePlannedBadge}>
                  {t(content.trust.dignityBadge, locale)}
                </span>
                {t(content.trust.dignityStatement, locale)}
              </p>
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
                className={styles.homeButtonPrimary}
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
