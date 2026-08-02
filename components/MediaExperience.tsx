import Image from "next/image";
import Link from "next/link";
import {
  homepageContent,
  hrefFor,
  t,
} from "../content/homepage";
import {
  facebookUrl,
  instagramUrl,
  mediaContent,
  mediaFeedItems,
  mediaText,
} from "../content/media";
import { mediaArticles, type Locale } from "../content/site-data";
import { InstagramFeed } from "./InstagramFeed";
import { HeartIcon } from "./ui/HeartIcon";
import { SectionShell } from "./ui/SectionShell";
import styles from "./MediaExperience.module.css";

export function MediaExperience({ locale }: { locale: Locale }) {
  const zh = locale !== "en";
  const feedItems = mediaFeedItems();

  return (
    <article className={`${styles.page} ${zh ? styles.zh : ""}`}>
      <SectionShell tone="dark" className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.badge}>{mediaText(mediaContent.hero.badge, locale)}</p>
          <h1>{mediaText(mediaContent.hero.title, locale)}</h1>
          <p className={styles.heroDescription}>
            {mediaText(mediaContent.hero.description, locale)}
          </p>
          <div className={styles.socialActions}>
            <a href={facebookUrl} target="_blank" rel="noreferrer">
              <span aria-hidden="true">f</span>
              {mediaText(mediaContent.hero.facebook, locale)}
            </a>
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <span aria-hidden="true">◎</span>
              {mediaText(mediaContent.hero.instagram, locale)}
            </a>
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="blush" className={styles.testimonials}>
        <div className={styles.testimonialInner}>
          <p className={styles.eyebrow}>{t(homepageContent.featuredStory.eyebrow, locale)}</p>
          <h2>{t(homepageContent.featuredStory.title, locale)}</h2>
          <div className={styles.testimonialStage}>
            <span className={styles.testimonialHearts} aria-hidden="true">
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartOne}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartTwo}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartThree}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartFour}`} />
              <HeartIcon className={`${styles.storyGlowHeart} ${styles.storyGlowHeartFive}`} />
            </span>
            <article className={styles.testimonialCard}>
              <div className={styles.testimonialImage}>
                <Image
                  src={homepageContent.featuredStory.image}
                  alt={t(homepageContent.featuredStory.imageAlt, locale)}
                  fill
                  sizes="(max-width: 820px) 100vw, 62vw"
                />
              </div>
              <div className={styles.testimonialPanel}>
                <p>{t(homepageContent.featuredStory.panelLabel, locale)}</p>
                <h3>{t(homepageContent.featuredStory.panelTitle, locale)}</h3>
                <p className={styles.testimonialContext}>
                  {t(homepageContent.featuredStory.context, locale)}
                </p>
                <blockquote className={styles.testimonialQuote}>
                  <p>“{t(homepageContent.featuredStory.quote, locale)}”</p>
                </blockquote>
                <div className={styles.testimonialFooter}>
                  <cite>{t(homepageContent.featuredStory.attribution, locale)}</cite>
                  <Link href={hrefFor(homepageContent.featuredStory.action, locale)}>
                    {t(homepageContent.featuredStory.action.label, locale)} ↗
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="canvas" className={styles.feeds}>
        <div className={styles.centeredHeading}>
          <p className={styles.eyebrow}>{mediaText(mediaContent.feeds.eyebrow, locale)}</p>
          <h2>{mediaText(mediaContent.feeds.title, locale)}</h2>
          <p>{mediaText(mediaContent.feeds.description, locale)}</p>
        </div>
        <div className={styles.feedGrid}>
          <InstagramFeed />
          {feedItems.map((article, index) => (
            <article className={styles.feedCard} key={article.slug}>
              <div className={styles.feedMeta}>
                <span aria-hidden="true">♥</span>
                <time>{article.date}</time>
              </div>
              <Link href={`/${article.slug}/`} className={styles.feedImage}>
                {article.image ? (
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                ) : (
                  <span className={styles.feedPlaceholder} aria-hidden="true">
                    {index % 2 ? "✦" : "●"}
                  </span>
                )}
              </Link>
              <div className={styles.feedCopy}>
                <span>{index % 2 ? "Instagram" : "Facebook"}</span>
                <h3><Link href={`/${article.slug}/`}>{article.title}</Link></h3>
                {article.excerpt ? <p>{article.excerpt}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell tone="white" className={styles.press}>
        <div className={styles.centeredHeading}>
          <p className={styles.eyebrow}>{mediaText(mediaContent.press.eyebrow, locale)}</p>
          <h2>{mediaText(mediaContent.press.title, locale)}</h2>
        </div>
        <ul className={styles.pressList}>
          {mediaArticles.map((article) => (
            <li key={article.slug}>
              <time>{article.date}</time>
              <Link href={`/${article.slug}/`}>{article.title}</Link>
              <Link href={`/${article.slug}/`} className={styles.readLink}>
                {mediaText(mediaContent.press.read, locale)} <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </SectionShell>
    </article>
  );
}
