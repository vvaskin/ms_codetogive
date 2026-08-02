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
import { readHomepageEvents } from "../lib/supabase/calendar-events";
import { readHomepageTestimonials } from "../lib/testimonials";
import { CountUp } from "./CountUp";
import type { UpcomingEvent } from "./EventsCarousel";
import { GiveSection } from "./GiveSection";
import { NeurodiversitySection } from "./NeurodiversitySection";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { HeartIcon } from "./ui/HeartIcon";
import { VolunteerSection } from "./VolunteerSection";
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

const upcomingEventsFallback: UpcomingEvent[] = [
  {
    id: "sports-day",
    title: {
      en: "Sports Day — Adaptive Swimming",
      zh: "運動日——自適應游泳",
      cn: "运动日——自适应游泳",
    },
    date: { en: "SAT, AUG 9", zh: "8月9日 週六", cn: "8月9日 周六" },
    time: { en: "10:00 AM", zh: "上午10:00", cn: "上午10:00" },
    location: {
      en: "Victoria Park Pool",
      zh: "維多利亞公園游泳池",
      cn: "维多利亚公园游泳池",
    },
    image: "/assets/images/home-sports.jpg",
    href: "/events",
    tone: "pink",
    category: { en: "Sport", zh: "運動", cn: "运动" },
    ctaLabel: { en: "Register", zh: "報名", cn: "报名" },
  },
  {
    id: "nutrition-workshop",
    title: {
      en: "Nutrition Workshop: Healthy Snacks",
      zh: "營養工作坊：健康小食",
      cn: "营养工作坊：健康小食",
    },
    date: { en: "SUN, AUG 17", zh: "8月17日 週日", cn: "8月17日 周日" },
    time: { en: "2:00 PM", zh: "下午2:00", cn: "下午2:00" },
    location: {
      en: "Love 21 Space",
      zh: "Love 21 Space",
      cn: "Love 21 Space",
    },
    image: "/assets/images/home-nutrition.jpg",
    href: "/events",
    tone: "mint",
    category: { en: "Nutrition", zh: "營養", cn: "营养" },
    ctaLabel: { en: "Register", zh: "報名", cn: "报名" },
  },
  {
    id: "family-fun-day",
    title: {
      en: "Family Fun Day — Art & Movement",
      zh: "家庭同樂日——藝術與運動",
      cn: "家庭同乐日——艺术与运动",
    },
    date: { en: "SAT, AUG 23", zh: "8月23日 週六", cn: "8月23日 周六" },
    time: { en: "11:00 AM", zh: "上午11:00", cn: "上午11:00" },
    location: {
      en: "Love 21 Space",
      zh: "Love 21 Space",
      cn: "Love 21 Space",
    },
    image: "/assets/images/home-family.jpeg",
    href: "/events",
    tone: "sky",
    category: { en: "Family", zh: "家庭", cn: "家庭" },
    ctaLabel: { en: "Open registration", zh: "開放報名", cn: "开放报名" },
  },
];

export async function HomeExperience({ locale = "en" }: { locale?: Locale }) {
  const content = homepageContent;
  const isChinese = locale !== "en";
  const heroPhotos = content.hero.photos;
  const impactFeatured = content.impactShowcase.featured;
  const [impactLeft, impactRight] = content.impactShowcase.sides;
  const [instagramPosts, testimonials] = await Promise.all([
    readInstagramPosts(),
    readHomepageTestimonials(locale),
  ]);
  const upcomingEvents = await readHomepageEvents(locale, upcomingEventsFallback);

  return (
    <main className={`${styles.page} ${isChinese ? styles.chinese : ""}`}>
      {/* ─── HERO ─── */}
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

      {/* ─── IMPACT SHOWCASE ─── */}
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

      {/* ─── FEATURED STORY (panelTitle removed) ─── */}
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
            <TestimonialCarousel testimonials={testimonials} locale={locale} />
          </div>
        </div>
      </section>

      {/* ─── LEARN ABOUT OUR COMMUNITY ─── */}
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

      {/* ─── VOLUNTEERS + EVENTS CAROUSEL ─── */}
      <VolunteerSection events={upcomingEvents} locale={locale} />

      {/* ─── GIVE — TIME OR MONEY ─── */}
      <GiveSection locale={locale} />

      {/* ─── NEURODIVERSITY HUB (compact) ─── */}
      <NeurodiversitySection locale={locale} />

      {/* ─── SOCIAL FEED ─── */}
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

      {/* ─── COMMUNITY CTA BAND ─── */}
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
