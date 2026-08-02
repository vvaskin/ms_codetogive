import Image from "next/image";
import Link from "next/link";
import {
  homepageContent,
  hrefFor,
  t,
  type HomepageCardTone,
  type HomepageFeedCard,
} from "../content/homepage";
import type { Locale } from "../content/site-data";
import { readInstagramPosts, type InstagramPost } from "../lib/instagram-storage";
import { AbilityFlipBook } from "./AbilityFlipBook";
import { CountUp } from "./CountUp";
import { HeartIcon } from "./ui/HeartIcon";
import styles from "./HomeExperience.module.css";

const toneClasses: Record<HomepageCardTone, string> = {
  pink: styles.tonePink,
  sky: styles.toneSky,
  mint: styles.toneMint,
  yellow: styles.toneYellow,
};

function FeedCard({ item, locale }: { item: HomepageFeedCard; locale: Locale }) {
  return (
    <article className={styles.feedCard}>
      <Link href={item.href} className={styles.feedCardLink}>
        <span className={styles.feedMeta}>
          <span className={styles.feedMetaLogo} aria-hidden="true">
            <Image
              src="/assets/images/love21_logo.png?v=3"
              alt=""
              width={330}
              height={202}
            />
          </span>
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

function InstagramFeedCard({
  post,
  locale,
}: {
  post: InstagramPost;
  locale: Locale;
}) {
  const date = new Date(post.timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <article className={styles.feedCard}>
      <a
        href={post.permalink}
        target="_blank"
        rel="noreferrer"
        className={styles.feedCardLink}
      >
        <span className={styles.feedMeta}>
          <span className={styles.feedMetaLogo} aria-hidden="true">
            <Image
              src="/assets/images/love21_logo.png?v=3"
              alt=""
              width={330}
              height={202}
            />
          </span>
          <span>
            <strong>Instagram</strong>
            <time>{date}</time>
          </span>
        </span>
        <span className={`${styles.feedImage} ${styles.tonePink}`}>
          <Image
            src={post.imageUrl}
            alt={post.caption || "Instagram post"}
            fill
            unoptimized
            sizes="(max-width: 600px) 78vw, (max-width: 1000px) 42vw, 260px"
          />
        </span>
        <span className={styles.feedBody}>
          <strong>{post.caption || "Instagram post"}</strong>
          <span>
            {locale === "en"
              ? "Read more →"
              : locale === "zh"
                ? "閱讀更多 →"
                : "阅读更多 →"}
          </span>
        </span>
      </a>
    </article>
  );
}

export async function HomeExperience({ locale = "en" }: { locale?: Locale }) {
  const content = homepageContent;
  const isChinese = locale !== "en";
  const heroPhotos = content.hero.photos;
  const impactFeatured = content.impactShowcase.featured;
  const [impactLeft, impactRight] = content.impactShowcase.sides;
  const instagramPosts = await readInstagramPosts();

  return (
    <main className={`${styles.page} ${isChinese ? styles.chinese : ""}`}>
      <AbilityFlipBook locale={locale} />

      <section className={styles.hero} aria-labelledby="homepage-title">
        <span className={styles.heroBlobOne} aria-hidden="true" />
        <span className={styles.heroBlobTwo} aria-hidden="true" />
        <span className={styles.heroDot} aria-hidden="true" />
        <span className={styles.heroFloatHearts} aria-hidden="true">
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartOne}`} />
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartTwo}`} />
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartThree}`} />
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartFour}`} />
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartFive}`} />
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartSix}`} />
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartSeven}`} />
          <HeartIcon className={`${styles.heroFloatHeart} ${styles.heroFloatHeartEight}`} />
        </span>
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

      <section
        className={styles.impactShowcase}
        aria-labelledby="impact-showcase-title"
      >
        <div className={styles.standardInner}>
          <p className={styles.bluePill}>{t(content.impactShowcase.eyebrow, locale)}</p>
          <ul className={styles.impactMetrics}>
            <li className={styles.impactSide}>
              <strong>
                <CountUp value={impactLeft.value} className={styles.countUp} />
              </strong>
              <span>{t(impactLeft.label, locale)}</span>
            </li>
            <li className={styles.impactFeatured}>
              <strong>
                <CountUp value={impactFeatured.value} className={styles.countUp} />
              </strong>
              <h2 id="impact-showcase-title">{t(impactFeatured.title, locale)}</h2>
              {impactFeatured.description ? (
                <p>{t(impactFeatured.description, locale)}</p>
              ) : null}
            </li>
            <li className={styles.impactSide}>
              <strong>
                <CountUp value={impactRight.value} className={styles.countUp} />
              </strong>
              <span>{t(impactRight.label, locale)}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.featuredStory} aria-labelledby="featured-story-title">
        <span className={styles.featuredStoryBgHearts} aria-hidden="true">
          <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartBgOne}`} />
          <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartBgTwo}`} />
          <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartBgThree}`} />
        </span>
        <div className={styles.wideInner}>
          <p className={styles.sectionEyebrow}>{t(content.featuredStory.eyebrow, locale)}</p>
          <h2 id="featured-story-title">{t(content.featuredStory.title, locale)}</h2>
          <div className={styles.featuredStoryStage}>
            <span className={styles.featuredStoryCardHearts} aria-hidden="true">
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartOne}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartTwo}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartThree}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartFour}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartFive}`} />
            </span>
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
                <div className={styles.featuredStoryFooter}>
                  <cite>{t(content.featuredStory.attribution, locale)}</cite>
                  <Link href={hrefFor(content.featuredStory.action, locale)}>
                    {t(content.featuredStory.action.label, locale)} ↗
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Stories + Stories of Ability temporarily hidden; content kept in homepage.ts */}

      <section className={styles.education} aria-labelledby="education-title">
        <div className={styles.standardInner}>
          <header className={styles.educationIntro}>
            <p className={styles.pinkEyebrow}>{t(content.education.eyebrow, locale)}</p>
            <h2 id="education-title">{t(content.education.title, locale)}</h2>
            <p className={styles.educationLead}>{t(content.education.description, locale)}</p>
          </header>
          <ul className={styles.educationPoints}>
            {content.education.points.map((point) => (
              <li key={point.value}>
                <strong>
                  <CountUp value={point.value} className={styles.countUp} />
                </strong>
                <span>{t(point.description, locale)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.educationFactsBlock}>
            <h3>{t(content.education.factsTitle, locale)}</h3>
            <div className={styles.educationFacts}>
              {content.education.facts.map((fact, index) => (
                <article key={fact.value}>
                  <strong className={index === 0 ? styles.factBlue : styles.factTeal}>
                    <CountUp value={fact.value} className={styles.countUp} />
                  </strong>
                  <span>{t(fact.label, locale)}</span>
                </article>
              ))}
            </div>
            <p className={styles.sourceNote}>{t(content.education.source, locale)}</p>
          </div>
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
            {instagramPosts.map((post) => (
              <InstagramFeedCard post={post} locale={locale} key={post.id} />
            ))}
            {content.socialFeed.items.map((item) => (
              <FeedCard item={item} locale={locale} key={item.id} />
            ))}
          </div>
        </div>
      </section>

      {/* volunteerCta sky band intentionally not rendered; Volunteer lives in donateCta below.
          Restore from content.volunteerCta if a standalone band is needed again. */}
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
            {content.donateCta.volunteer && (
              <Link
                className={styles.donateOutlineButton}
                href={hrefFor(content.donateCta.volunteer, locale)}
              >
                {t(content.donateCta.volunteer.label, locale)}
              </Link>
            )}
            {content.donateCta.secondary && (
              <Link
                className={styles.donateWishLink}
                href={hrefFor(content.donateCta.secondary, locale)}
              >
                {t(content.donateCta.secondary.label, locale)}
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
