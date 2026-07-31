"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import {
  hrefFor,
  t,
  type HomepageContent,
} from "../../content/homepage";
import type { Locale } from "../../content/site-data";
import styles from "../HomeExperience.module.css";

export function HomeAbilityStories({
  locale,
  content,
}: {
  locale: Locale;
  content: HomepageContent["stories"];
}) {
  const [index, setIndex] = useState(0);
  const labelId = useId();
  const story = content.items[index];
  const total = content.items.length;

  function goTo(next: number) {
    setIndex((next + total) % total);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  }

  return (
    <section
      id={content.id}
      className={styles.homeStories}
      aria-labelledby={labelId}
    >
      <div className={styles.homeSectionInner}>
        <p className={styles.homeEyebrow}>{t(content.eyebrow, locale)}</p>
        <h2 id={labelId} className={styles.homeSectionTitle}>
          {t(content.title, locale)}
        </h2>

        <div
          className={styles.homeStoryStage}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={t(content.title, locale)}
        >
          <div className={styles.homeStoryMedia}>
            <Image
              src={story.image}
              alt={t(story.imageAlt, locale)}
              fill
              sizes="(max-width: 760px) 100vw, (max-width: 1024px) 90vw, 54vw"
            />
          </div>

          <div className={styles.homeStoryCopy}>
            <p className={styles.homeStoryStatus} aria-live="polite">
              {index + 1} / {total}
            </p>
            <h3 className={styles.homeStoryAchievement}>
              {t(story.achievement, locale)}
            </h3>

            {story.status === "placeholder" && story.placeholderBadge && (
              <p className={styles.homePlaceholderBadge} role="note">
                {t(story.placeholderBadge, locale)}
              </p>
            )}

            <ol className={styles.homeMilestoneList}>
              {story.milestones.map((milestone) => (
                <li key={milestone.en}>{t(milestone, locale)}</li>
              ))}
            </ol>

            <p className={styles.homeStoryProgramme}>
              {t(story.supportingProgramme, locale)}
            </p>

            {story.source && (
              <p className={styles.homeStorySource}>
                {t(story.source.label, locale)}
              </p>
            )}

            <Link
              className={styles.homeButtonSecondary}
              href={hrefFor(story.action, locale)}
            >
              {t(story.action.label, locale)}
            </Link>
          </div>
        </div>

        <div className={styles.homeStoryControls}>
          <button
            type="button"
            className={styles.homeIconButton}
            aria-label={t(content.previousLabel, locale)}
            onClick={() => goTo(index - 1)}
          >
            ←
          </button>
          <div className={styles.homeStoryTabs} role="tablist">
            {content.items.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={itemIndex === index}
                aria-label={`${t(content.tabLabel, locale)} ${itemIndex + 1}: ${t(item.achievement, locale)}`}
                className={styles.homeStoryTab}
                onClick={() => goTo(itemIndex)}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.homeIconButton}
            aria-label={t(content.nextLabel, locale)}
            onClick={() => goTo(index + 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
