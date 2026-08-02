"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { Locale } from "../content/site-data";
import type { PublicTestimonial } from "../lib/testimonials";
import styles from "./HomeExperience.module.css";

const AUTOPLAY_MS = 8_000;

type SlideState = {
  index: number;
  /** The story on its way out, or -1 before the first move. */
  previous: number;
  /** 1 moves the stories left to right, -1 sends them back the other way. */
  direction: 1 | -1;
};

/** "current" is the story on first paint: shown without an entry animation. */
type CardState = "current" | "active" | "leaving" | "idle";

const carouselLabels: Record<Locale, { region: string; previous: string; next: string; goTo: string }> = {
  en: {
    region: "Member testimonials",
    previous: "Previous testimonial",
    next: "Next testimonial",
    goTo: "Show testimonial",
  },
  zh: {
    region: "會員感言",
    previous: "上一則感言",
    next: "下一則感言",
    goTo: "顯示感言",
  },
  cn: {
    region: "会员感言",
    previous: "上一则感言",
    next: "下一则感言",
    goTo: "显示感言",
  },
};

function TestimonialCard({
  testimonial,
  state,
}: {
  testimonial: PublicTestimonial;
  state: CardState;
}) {
  const isActive = state === "active" || state === "current";
  return (
    <article
      className={styles.featuredStoryCard}
      data-state={state}
      aria-hidden={isActive ? undefined : true}
      inert={isActive ? undefined : true}
    >
      <div className={styles.featuredStoryImage}>
        <Image
          src={testimonial.image}
          alt={testimonial.imageAlt}
          fill
          unoptimized={/^https?:\/\//i.test(testimonial.image)}
          sizes="(max-width: 820px) 100vw, 62vw"
        />
      </div>
      <div className={styles.featuredStoryPanel}>
        <p>{testimonial.storyLabel}</p>
        <p className={styles.featuredStoryContext}>{testimonial.body}</p>
        {testimonial.quote ? (
          <blockquote className={styles.featuredStoryQuote}>
            <p>“{testimonial.quote}”</p>
          </blockquote>
        ) : null}
        <div className={styles.featuredStoryFooter}>
          {testimonial.attribution ? <cite>{testimonial.attribution}</cite> : null}
          <Link href={testimonial.ctaHref}>{testimonial.ctaLabel} ↗</Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Rotates the published member stories. Every story shares one grid cell: the
 * incoming one slides in from the left while the outgoing one leaves to the
 * right, so the stage keeps the height of the tallest story and wrapping past
 * the last story never rewinds through the whole set.
 */
export function TestimonialCarousel({
  testimonials,
  locale = "en",
}: {
  testimonials: PublicTestimonial[];
  locale?: Locale;
}) {
  const [slide, setSlide] = useState<SlideState>({
    index: 0,
    previous: -1,
    direction: 1,
  });
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;
  const hasMultiple = total > 1;
  const labels = carouselLabels[locale];

  const goTo = useCallback((nextIndex: number, direction: 1 | -1) => {
    setSlide((current) =>
      current.index === nextIndex
        ? current
        : { index: nextIndex, previous: current.index, direction },
    );
  }, []);

  const moveBy = useCallback(
    (direction: 1 | -1) => {
      setSlide((current) => ({
        index: (current.index + direction + total) % total,
        previous: current.index,
        direction,
      }));
    },
    [total],
  );

  useEffect(() => {
    if (!hasMultiple || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => moveBy(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [slide.index, hasMultiple, moveBy, paused]);

  if (total === 0) return null;

  // Forward travel brings the next story in from the left and sends the current
  // one out to the right; the previous arrow reverses both.
  const slideDirection = {
    "--testimonial-enter-sign": slide.direction === 1 ? -1 : 1,
    "--testimonial-leave-sign": slide.direction === 1 ? 1 : -1,
  } as CSSProperties;

  return (
    <div
      className={styles.testimonialCarousel}
      style={slideDirection}
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.region}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (!hasMultiple) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveBy(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          moveBy(1);
        }
      }}
    >
      <div className={styles.testimonialStack}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            testimonial={testimonial}
            state={
              index === slide.index
                ? slide.previous < 0
                  ? "current"
                  : "active"
                : index === slide.previous
                  ? "leaving"
                  : "idle"
            }
            key={testimonial.id}
          />
        ))}
      </div>

      {hasMultiple ? (
        <div className={styles.testimonialControls}>
          <button
            className={`${styles.testimonialArrow} ${styles.testimonialArrowPrevious}`}
            type="button"
            onClick={() => moveBy(-1)}
            aria-label={labels.previous}
          >
            <span aria-hidden="true">←</span>
          </button>

          <div className={styles.testimonialDots}>
            {testimonials.map((testimonial, index) => (
              <button
                className={styles.testimonialDot}
                type="button"
                data-active={index === slide.index}
                aria-label={`${labels.goTo} ${index + 1}`}
                aria-current={index === slide.index ? "true" : undefined}
                onClick={() => goTo(index, index > slide.index ? 1 : -1)}
                key={testimonial.id}
              />
            ))}
          </div>

          <button
            className={`${styles.testimonialArrow} ${styles.testimonialArrowNext}`}
            type="button"
            onClick={() => moveBy(1)}
            aria-label={labels.next}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
