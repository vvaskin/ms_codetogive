import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  facebookUrl,
  instagramUrl,
  mediaContent,
  mediaFeedItems,
  mediaText,
} from "../content/media";
import { mediaArticles, type Locale } from "../content/site-data";
import { InstagramFeed } from "./InstagramFeed";
import { SectionShell } from "./ui/SectionShell";
import styles from "./MediaExperience.module.css";

export function MediaExperience({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
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

        <section className={styles.reels} aria-labelledby="event-reels">
          <div className={styles.reelsHeading}>
            <div>
              <p>{mediaText(mediaContent.reels.eyebrow, locale)}</p>
              <h2 id="event-reels">{mediaText(mediaContent.reels.title, locale)}</h2>
            </div>
            <span>{mediaText(mediaContent.reels.hint, locale)}</span>
          </div>
          <div className={styles.reelScroller}>
            {mediaContent.reels.items.map((reel) => (
              <article
                className={styles.reel}
                key={reel.title.en}
                style={{ "--reel-accent": reel.accent } as CSSProperties}
              >
                {reel.image ? (
                  <Image
                    src={reel.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 68vw, 225px"
                  />
                ) : null}
                <div className={styles.reelOverlay} />
                <span className={styles.reelIcon} aria-hidden="true">{reel.icon}</span>
                <div className={styles.reelCopy}>
                  <span>{mediaText(reel.label, locale)}</span>
                  <h3>{mediaText(reel.title, locale)}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>
      </SectionShell>

      <SectionShell tone="canvas" className={styles.feeds}>
        <div className={styles.centeredHeading}>
          <p className={styles.eyebrow}>{mediaText(mediaContent.feeds.eyebrow, locale)}</p>
          <h2>{mediaText(mediaContent.feeds.title, locale)}</h2>
          <p>{mediaText(mediaContent.feeds.description, locale)}</p>
        </div>
        <div className={styles.feedGrid}>
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

      <SectionShell tone="blush" className={styles.instagram}>
        <div className={styles.centeredHeading}>
          <p className={styles.eyebrow}>
            {mediaText(mediaContent.instagram.eyebrow, locale)}
          </p>
          <h2>{mediaText(mediaContent.instagram.title, locale)}</h2>
        </div>
        <div className={styles.instagramFeed}>
          <InstagramFeed />
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
