"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Locale } from "../content/site-data";
import styles from "./EventsCarousel.module.css";

export interface UpcomingEvent {
  id: string;
  title: { en: string; zh: string; cn: string };
  date: { en: string; zh: string; cn: string };
  time: { en: string; zh: string; cn: string };
  location: { en: string; zh: string; cn: string };
  image?: string;
  href: string;
  tone: "pink" | "sky" | "mint" | "yellow";
  category?: { en: string; zh: string; cn: string };
  ctaLabel?: { en: string; zh: string; cn: string };
}

function t(val: { en: string; zh: string; cn: string }, locale: Locale) {
  return val[locale];
}

function EventCard({
  event,
  locale,
}: {
  event: UpcomingEvent;
  locale: Locale;
}) {
  return (
    <article className={`${styles.card} ${styles[event.tone]}`}>
      <div className={styles.cardImageArea}>
        {event.category && (
          <span className={`${styles.categoryTag} ${styles[`tag_${event.tone}`]}`}>
            {t(event.category, locale)}
          </span>
        )}
        {event.image && (
          <Image
            src={event.image}
            alt=""
            fill
            sizes="(max-width: 600px) 80vw, 360px"
          />
        )}
      </div>
      <div className={styles.cardBody}>
        <time className={styles.cardDate}>{t(event.date, locale)}</time>
        <h3>{t(event.title, locale)}</h3>
        {event.ctaLabel ? (
          <Link href={event.href} className={`${styles.registerTag} ${styles[`reg_${event.tone}`]}`}>
            {t(event.ctaLabel, locale)}
          </Link>
        ) : (
          <Link href={event.href} className={styles.cardLink}>
            {locale === "en"
              ? "Details →"
              : locale === "zh"
                ? "詳情 →"
                : "详情 →"}
          </Link>
        )}
      </div>
    </article>
  );
}

export function EventsCarousel({
  events,
  locale,
}: {
  events: UpcomingEvent[];
  locale: Locale;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (events.length === 0) return null;

  const eyebrow =
    locale === "en"
      ? "happening soon"
      : locale === "zh"
        ? "即將舉行"
        : "即将举行";
  const heading =
    locale === "en"
      ? "Upcoming Events"
      : locale === "zh"
        ? "即將舉行的活動"
        : "即将举行的活动";
  const seeAll =
    locale === "en"
      ? "View full calendar →"
      : locale === "zh"
        ? "查看完整日曆 →"
        : "查看完整日历 →";

  const calendarHref =
    locale === "en"
      ? "/events#activity-calendar"
      : locale === "zh"
        ? "/zh/events-hk/#activity-calendar"
        : "/cn/events#activity-calendar";

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h3 className={styles.heading}>{heading}</h3>
          </div>
          <Link href={calendarHref} className={styles.seeAll}>
            {seeAll}
          </Link>
        </div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.track} ref={trackRef}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} />
          ))}
          {events.map((event) => (
            <EventCard
              key={`dup-${event.id}`}
              event={event}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
