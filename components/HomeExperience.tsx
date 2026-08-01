import Image from "next/image";
import Link from "next/link";
import {
  homepageContent,
  hrefFor,
  t,
  type HomepageCardTone,
  type HomepageFeedCard,
  type HomepageStoryCard,
} from "../content/homepage";
import type { Locale } from "../content/site-data";
import { HeartIcon } from "./ui/HeartIcon";
import styles from "./HomeExperience.module.css";

const toneClasses: Record<HomepageCardTone, string> = {
  pink: styles.tonePink,
  sky: styles.toneSky,
  mint: styles.toneMint,
  yellow: styles.toneYellow,
};

function StoryCard({ item, locale }: { item: HomepageStoryCard; locale: Locale }) {
  return (
    <article className={styles.storyCard}>
      <Link href={item.href} className={styles.storyCardLink}>
        <span className={`${styles.storyCardMedia} ${toneClasses[item.tone]}`}>
          <Image
            src={item.image}
            alt={t(item.imageAlt, locale)}
            fill
            sizes="(max-width: 600px) 78vw, (max-width: 1000px) 42vw, 260px"
          />
        </span>
        <span className={styles.storyCardBody}>
          <span className={`${styles.cardTag} ${toneClasses[item.tone]}`}>
            {t(item.category, locale)}
          </span>
          <strong>{t(item.title, locale)}</strong>
          <span className={styles.cardSummary}>{t(item.summary, locale)}</span>
          <small>{t(item.meta, locale)}</small>
        </span>
      </Link>
    </article>
  );
}

function FeedCard({ item, locale }: { item: HomepageFeedCard; locale: Locale }) {
  return (
    <article className={styles.feedCard}>
      <Link href={item.href} className={styles.feedCardLink}>
        <span className={styles.feedMeta}>
          <span aria-hidden="true">21</span>
          <span>
            <strong>{t(item.network, locale)}</strong>
            <time>{item.date}</time>
          </span>
        </span>
        <span className={`${styles.feedImage} ${toneClasses[item.tone]}`}>
          <Image
            src={item.image}
            alt={t(item.imageAlt, locale)}
            fill
            sizes="(max-width: 600px) 78vw, (max-width: 1000px) 42vw, 260px"
          />
        </span>
        <span className={styles.feedBody}>
          <strong>{t(item.title, locale)}</strong>
          <span>{locale === "en" ? "Read more →" : locale === "zh" ? "閱讀更多 →" : "阅读更多 →"}</span>
        </span>
      </Link>
    </article>
  );
}

export function HomeExperience({ locale = "en" }: { locale?: Locale }) {
  const content = homepageContent;
  const isChinese = locale !== "en";
  const heroPhotos = content.hero.photos;

  return (
    <main className={`${styles.page} ${isChinese ? styles.chinese : ""}`}>
      <section className={styles.hero} aria-labelledby="homepage-title">
        <span className={styles.heroBlobOne} aria-hidden="true" />
        <span className={styles.heroBlobTwo} aria-hidden="true" />
        <span className={styles.heroDot} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.handEyebrow}>{t(content.hero.eyebrow, locale)}</p>
            <h1 id="homepage-title">{t(content.hero.title, locale)}</h1>
            <p className={styles.heroDescription}>{t(content.hero.description, locale)}</p>
            <div className={styles.heroActions}>
              <Link
                className={`${styles.sparkButton} ${styles.pinkButton}`}
                href={hrefFor(content.hero.primary, locale)}
              >
                <span className={styles.sparkHearts} aria-hidden="true">
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartOne}`} />
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartTwo}`} />
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartThree}`} />
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartFour}`} />
                </span>
                <span className={styles.sparkLabel}>{t(content.hero.primary.label, locale)}</span>
              </Link>
              <Link
                className={`${styles.sparkButton} ${styles.heroVolunteer}`}
                href={hrefFor(content.hero.secondary, locale)}
              >
                <span className={styles.sparkHearts} aria-hidden="true">
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartOne}`} />
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartTwo}`} />
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartThree}`} />
                  <HeartIcon className={`${styles.sparkHeart} ${styles.sparkHeartFour}`} />
                </span>
                <span className={styles.sparkLabel}>{t(content.hero.secondary.label, locale)}</span>
              </Link>
            </div>
            <p className={styles.scriptNote}>{t(content.hero.note, locale)}</p>
          </div>

          <div className={styles.heroPhotos} aria-label={locale === "en" ? "Love 21 programme moments" : "Love 21 計劃時刻"}>
            <figure className={`${styles.polaroid} ${styles.polaroidMain}`}>
              <span className={styles.photoTape} aria-hidden="true" />
              <span className={styles.photoFrame}>
                <Image
                  src={heroPhotos[0].image}
                  alt={t(heroPhotos[0].alt, locale)}
                  fill
                  priority
                  sizes="(max-width: 760px) 62vw, 360px"
                />
              </span>
              <figcaption>{t(heroPhotos[0].caption, locale)}</figcaption>
            </figure>
            <figure className={`${styles.polaroid} ${styles.polaroidLeft}`}>
              <span className={styles.photoTape} aria-hidden="true" />
              <span className={styles.photoFrame}>
                <Image
                  src={heroPhotos[1].image}
                  alt={t(heroPhotos[1].alt, locale)}
                  fill
                  sizes="(max-width: 760px) 44vw, 260px"
                />
              </span>
              <figcaption>{t(heroPhotos[1].caption, locale)}</figcaption>
            </figure>
            <figure className={`${styles.polaroid} ${styles.polaroidRight}`}>
              <span className={styles.photoTape} aria-hidden="true" />
              <span className={styles.photoFrame}>
                <Image
                  src={heroPhotos[2].image}
                  alt={t(heroPhotos[2].alt, locale)}
                  fill
                  sizes="(max-width: 760px) 39vw, 230px"
                />
              </span>
              <figcaption>{t(heroPhotos[2].caption, locale)}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.impactShowcase} aria-labelledby="impact-showcase-title">
        <div className={styles.narrowInner}>
          <p className={styles.bluePill}>{t(content.impactShowcase.eyebrow, locale)}</p>
          <strong className={styles.impactNumber} aria-label={`${content.impactShowcase.value} ${t(content.impactShowcase.title, locale)}`}>
            {content.impactShowcase.value}
          </strong>
          <h2 id="impact-showcase-title">{t(content.impactShowcase.title, locale)}</h2>
          <p>{t(content.impactShowcase.description, locale)}</p>
          <ul className={styles.programmePills} aria-label={locale === "en" ? "Programme areas" : "計劃範疇"}>
            {content.impactShowcase.programmeLabels.map((label) => (
              <li key={label.en}>{t(label, locale)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.featuredStory} aria-labelledby="featured-story-title">
        <div className={styles.wideInner}>
          <p className={styles.sectionEyebrow}>{t(content.featuredStory.eyebrow, locale)}</p>
          <h2 id="featured-story-title">{t(content.featuredStory.title, locale)}</h2>
          <article className={styles.featuredStoryCard}>
            <div className={styles.featuredStoryImage}>
              <Image
                src={content.featuredStory.image}
                alt={t(content.featuredStory.imageAlt, locale)}
                fill
                sizes="(max-width: 820px) 100vw, 62vw"
              />
            </div>
            <div className={styles.featuredStoryPanel}>
              <p>{t(content.featuredStory.panelLabel, locale)}</p>
              <h3>{t(content.featuredStory.panelTitle, locale)}</h3>
              <p className={styles.featuredStoryContext}>
                {t(content.featuredStory.context, locale)}
              </p>
              <blockquote className={styles.featuredStoryQuote}>
                <p>“{t(content.featuredStory.quote, locale)}”</p>
              </blockquote>
              <ol>
                {content.featuredStory.milestones.map((milestone, index) => (
                  <li key={milestone.en}>
                    <span aria-hidden="true">{index + 1}</span>
                    {t(milestone, locale)}
                  </li>
                ))}
              </ol>
              <p className={styles.featuredStoryOutcome}>
                {t(content.featuredStory.familyOutcome, locale)}
              </p>
              <div className={styles.featuredStoryFooter}>
                <cite>{t(content.featuredStory.attribution, locale)}</cite>
                <Link href={hrefFor(content.featuredStory.action, locale)}>
                  {t(content.featuredStory.action.label, locale)} ↗
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.model} aria-labelledby="model-title">
        <div className={styles.wideInner}>
          <div className={styles.centeredHeading}>
            <p className={styles.tealEyebrow}>{t(content.model.eyebrow, locale)}</p>
            <h2 id="model-title">{t(content.model.title, locale)}</h2>
          </div>
          <div className={styles.modelGrid}>
            {content.model.pillars.map((pillar) => (
              <article className={`${styles.modelCard} ${styles[pillar.id]}`} key={pillar.id}>
                <span aria-hidden="true" />
                <h3>{t(pillar.title, locale)}</h3>
                <p>{t(pillar.description, locale)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.statBand} aria-label={t(content.impactStats.label, locale)}>
        <div className={styles.wideInner}>
          <ul>
            {content.impactStats.items.map((metric) => (
              <li key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{t(metric.label, locale)}</span>
                {metric.source && <small>{t(metric.source, locale)}</small>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.stories} aria-labelledby="stories-title">
        <div className={styles.wideInner}>
          <div className={styles.sectionHeadingRow}>
            <div>
              <p className={styles.tealEyebrow}>{t(content.featuredStories.eyebrow, locale)}</p>
              <h2 id="stories-title">{t(content.featuredStories.title, locale)}</h2>
            </div>
            <Link className={styles.outlineButton} href={hrefFor(content.featuredStories.action, locale)}>
              {t(content.featuredStories.action.label, locale)}
            </Link>
          </div>
          <div className={styles.cardScroller}>
            {content.featuredStories.items.map((item) => (
              <StoryCard item={item} locale={locale} key={item.id} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ability} aria-labelledby="ability-title">
        <div className={styles.wideInner}>
          <div className={styles.sectionHeadingRow}>
            <div>
              <p className={styles.pinkEyebrow}>{t(content.abilityConversation.eyebrow, locale)}</p>
              <h2 id="ability-title">{t(content.abilityConversation.title, locale)}</h2>
            </div>
            <Link className={styles.outlineButton} href={hrefFor(content.abilityConversation.action, locale)}>
              {t(content.abilityConversation.action.label, locale)}
            </Link>
          </div>

          <div className={styles.conversationIntro}>
            <p className={styles.cyanPill}>{t(content.abilityConversation.panelEyebrow, locale)}</p>
            <h3>{t(content.abilityConversation.panelTitle, locale)}</h3>
            <p>{t(content.abilityConversation.panelDescription, locale)}</p>
          </div>

          <article className={styles.chatCard} aria-label={t(content.abilityConversation.chatTitle, locale)}>
            <header>
              <span aria-hidden="true">♡</span>
              <span>
                <strong>{t(content.abilityConversation.chatTitle, locale)}</strong>
                <small>{t(content.abilityConversation.chatStatus, locale)}</small>
              </span>
            </header>
            <ol>
              {content.abilityConversation.items.map((item) => (
                <li className={item.side === "right" ? styles.chatRight : styles.chatLeft} key={item.id}>
                  <strong>{t(item.label, locale)}</strong>
                  <span>{t(item.message, locale)}</span>
                </li>
              ))}
            </ol>
            <span className={styles.chatDots} aria-hidden="true">•••</span>
          </article>
          <Link className={styles.readStoriesLink} href={hrefFor(content.abilityConversation.readAction, locale)}>
            {t(content.abilityConversation.readAction.label, locale)} →
          </Link>
        </div>
      </section>

      <section className={styles.education} aria-labelledby="education-title">
        <div className={styles.standardInner}>
          <p className={styles.pinkEyebrow}>{t(content.education.eyebrow, locale)}</p>
          <h2 id="education-title">{t(content.education.title, locale)}</h2>
          <p className={styles.educationLead}>{t(content.education.description, locale)}</p>
          <ul className={styles.educationPoints}>
            {content.education.points.map((point) => (
              <li key={point.value}>
                <strong>{point.value}</strong>
                <span>{t(point.description, locale)}</span>
              </li>
            ))}
          </ul>
          <h3>{t(content.education.factsTitle, locale)}</h3>
          <div className={styles.educationFacts}>
            {content.education.facts.map((fact, index) => (
              <article key={fact.value}>
                <strong className={index === 0 ? styles.factBlue : styles.factTeal}>{fact.value}</strong>
                <span>{t(fact.label, locale)}</span>
              </article>
            ))}
          </div>
          <p className={styles.sourceNote}>{t(content.education.source, locale)}</p>
          <Link className={styles.blueButton} href={hrefFor(content.education.action, locale)}>
            {t(content.education.action.label, locale)}
          </Link>
        </div>
      </section>

      <section className={styles.socialFeed} aria-labelledby="social-feed-title">
        <div className={styles.wideInner}>
          <div className={styles.sectionHeadingRow}>
            <div>
              <p className={styles.cyanPill}>{t(content.socialFeed.eyebrow, locale)}</p>
              <h2 id="social-feed-title">{t(content.socialFeed.title, locale)}</h2>
            </div>
            <div className={styles.followLinks}>
              <a href={hrefFor(content.socialFeed.facebook, locale)} target="_blank" rel="noreferrer">
                {t(content.socialFeed.facebook.label, locale)}
              </a>
              <a href={hrefFor(content.socialFeed.instagram, locale)} target="_blank" rel="noreferrer">
                {t(content.socialFeed.instagram.label, locale)}
              </a>
            </div>
          </div>
          <div className={styles.cardScroller}>
            {content.socialFeed.items.map((item) => (
              <FeedCard item={item} locale={locale} key={item.id} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.volunteerCta} aria-labelledby="volunteer-cta-title">
        <div className={styles.standardInner}>
          <div>
            {content.volunteerCta.eyebrow && <p>{t(content.volunteerCta.eyebrow, locale)}</p>}
            <h2 id="volunteer-cta-title">{t(content.volunteerCta.title, locale)}</h2>
            <span>{t(content.volunteerCta.description, locale)}</span>
          </div>
          <div className={styles.ctaActions}>
            <Link className={styles.paleButton} href={hrefFor(content.volunteerCta.primary, locale)}>
              {t(content.volunteerCta.primary.label, locale)}
            </Link>
            {content.volunteerCta.secondary && (
              <Link className={styles.blueOutlineButton} href={hrefFor(content.volunteerCta.secondary, locale)}>
                {t(content.volunteerCta.secondary.label, locale)}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className={styles.donateCta} aria-labelledby="donate-cta-title">
        <div className={styles.standardInner}>
          <div>
            <h2 id="donate-cta-title">{t(content.donateCta.title, locale)}</h2>
            <p>{t(content.donateCta.description, locale)}</p>
          </div>
          <div className={styles.donateActions}>
            <Link className={styles.whiteButton} href={hrefFor(content.donateCta.primary, locale)}>
              {t(content.donateCta.primary.label, locale)}
            </Link>
            {content.donateCta.secondary && (
              <Link href={hrefFor(content.donateCta.secondary, locale)}>
                {t(content.donateCta.secondary.label, locale)}
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
