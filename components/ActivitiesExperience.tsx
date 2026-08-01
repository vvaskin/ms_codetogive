"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  activitiesContent,
  activityCategories,
  activityText,
  august2026Events,
  upcomingActivities,
  type ActivityCategory,
} from "../content/activities";
import type { Locale } from "../content/site-data";
import { ButtonLink } from "./ui/ButtonLink";
import { SectionShell } from "./ui/SectionShell";
import styles from "./ActivitiesExperience.module.css";

const monthStart = new Date(2026, 7, 1);
const daysInMonth = 31;

function dateKey(day: number) {
  return `2026-08-${String(day).padStart(2, "0")}`;
}

export function ActivitiesExperience({ locale }: { locale: Locale }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ActivityCategory | "all">("all");
  const zh = locale === "zh";
  const c = activitiesContent;
  const weekdays = zh
    ? ["日", "一", "二", "三", "四", "五", "六"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabel = new Intl.DateTimeFormat(zh ? "zh-HK" : "en-HK", {
    month: "long",
    year: "numeric",
  }).format(monthStart);

  useEffect(() => {
    const clearOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedDate(null);
    };
    window.addEventListener("keydown", clearOnEscape);
    return () => window.removeEventListener("keydown", clearOnEscape);
  }, []);

  const eventsByDate = useMemo(
    () =>
      august2026Events.reduce<Record<string, typeof august2026Events>>((groups, event) => {
        (groups[event.date] ??= []).push(event);
        return groups;
      }, {}),
    [],
  );
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] ?? [] : [];
  const filteredActivities = upcomingActivities.filter(
    (activity) => activeCategory === "all" || activity.category === activeCategory,
  );
  const monthOffset = monthStart.getDay();

  return (
    <article className={`${styles.page} ${zh ? styles.zh : ""}`}>
      <SectionShell tone="canvas" className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{activityText(c.hero.eyebrow, locale)}</p>
          <h1>
            {activityText(c.hero.title, locale)} <span>{activityText(c.hero.accent, locale)}</span>
          </h1>
          <p>{activityText(c.hero.description, locale)}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#calendar">{activityText(c.hero.primary, locale)}</a>
            <ButtonLink href={zh ? "/zh/volunteer-hk/" : "/volunteer/"} variant="outline">
              {activityText(c.hero.secondary, locale)}
            </ButtonLink>
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="white" className={styles.metrics}>
        <ul>
          {c.metrics.map((metric) => (
            <li key={metric.value}>
              <strong>{metric.value}</strong>
              <span>{activityText(metric.label, locale)}</span>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell id="calendar" tone="blush" className={styles.calendarSection}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{zh ? "活動日曆" : "Activity calendar"}</p>
          <h2>{zh ? "選擇日期，查看當日活動。" : "Pick a date. See what’s on."}</h2>
          <p>{zh ? "有彩色圓點的日期代表有活動。按相同日期或清除選擇可回到完整日曆。" : "Days with coloured dots have activities. Select the same day again, or clear your selection, to return to the full calendar."}</p>
        </div>
        <div className={`${styles.calendarLayout} ${selectedDate ? styles.calendarSelected : ""}`}>
          <div className={styles.calendarCard}>
            <div className={styles.calendarHeader}>
              <h3>{monthLabel}</h3>
              {selectedDate && (
                <button type="button" className={styles.clearSelection} onClick={() => setSelectedDate(null)}>
                  {zh ? "清除選擇" : "Clear selection"}
                </button>
              )}
            </div>
            <div className={styles.weekdays} aria-hidden="true">
              {weekdays.map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className={styles.dayGrid}>
              {Array.from({ length: monthOffset }, (_, index) => <span key={`blank-${index}`} />)}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const key = dateKey(day);
                const dayEvents = eventsByDate[key] ?? [];
                const isSelected = selectedDate === key;
                const dateLabel = new Intl.DateTimeFormat(zh ? "zh-HK" : "en-HK", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }).format(new Date(2026, 7, day));
                return (
                  <button
                    type="button"
                    key={key}
                    className={`${styles.dayButton} ${isSelected ? styles.daySelected : ""}`}
                    onClick={() => setSelectedDate(isSelected ? null : key)}
                    aria-pressed={isSelected}
                    aria-label={`${dateLabel}${dayEvents.length ? `, ${dayEvents.length} ${zh ? "項活動" : dayEvents.length === 1 ? "activity" : "activities"}` : ""}`}
                  >
                    <span>{day}</span>
                    {dayEvents.length > 0 && (
                      <span className={styles.eventDots} aria-hidden="true">
                        {[...new Set(dayEvents.map((event) => event.category))].map((category) => (
                          <i key={category} style={{ backgroundColor: activityCategories.find((item) => item.id === category)?.color }} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <aside className={styles.dayPanel} aria-live="polite">
              <div className={styles.panelHeading}>
                <div>
                  <p>{zh ? "已選日期" : "Selected date"}</p>
                  <h3>{new Intl.DateTimeFormat(zh ? "zh-HK" : "en-HK", { month: "long", day: "numeric" }).format(new Date(`${selectedDate}T12:00:00`))}</h3>
                </div>
                <button type="button" onClick={() => setSelectedDate(null)} aria-label={zh ? "關閉已選日期活動" : "Close selected day events"}>×</button>
              </div>
              {selectedEvents.length ? (
                <ul className={styles.dayEvents}>
                  {selectedEvents.map((event) => (
                    <li key={event.id}>
                      <span className={styles.eventCategory} style={{ backgroundColor: activityCategories.find((item) => item.id === event.category)?.color }}>
                        {activityText(activityCategories.find((item) => item.id === event.category)!.label, locale)}
                      </span>
                      <strong>{activityText(event.title, locale)}</strong>
                      <span>{event.time} · {activityText(event.location, locale)}</span>
                      <p>{activityText(event.summary, locale)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyDay}>{zh ? "這天暫未有示範活動。請選擇另一個有彩色圓點的日期。" : "No demo activities are listed for this day. Choose a date with coloured dots to explore."}</p>
              )}
            </aside>
          )}
        </div>
      </SectionShell>

      <SectionShell tone="canvas" className={styles.quickStart}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{activityText(c.quickStart.eyebrow, locale)}</p>
          <h2>{activityText(c.quickStart.title, locale)}</h2>
        </div>
        <div className={styles.quickGrid}>
          {c.quickStart.items.map((item, index) => {
            const href = index === 0 ? (zh ? "/zh/join-us-hk/" : "/join-us/") : index === 1 ? (zh ? "/zh/volunteer-hk/" : "/volunteer/") : (zh ? "/zh/corporate-hk/" : "/corporate/");
            return <Link href={href} className={styles.quickCard} key={item.title.en}><strong>{activityText(item.title, locale)}</strong><span>{activityText(item.copy, locale)}</span><b aria-hidden="true">→</b></Link>;
          })}
        </div>
      </SectionShell>

      <SectionShell tone="blush" className={styles.upcoming}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{zh ? "即將舉行" : "What’s coming up"}</p>
          <h2>{zh ? "即將舉行的活動" : "Upcoming activities"}</h2>
          <p>{zh ? "以下為示範活動資料；報名功能將於日後推出。" : "These are demo activity listings; registration will be available later."}</p>
        </div>
        <div className={styles.filters} aria-label={zh ? "活動類別篩選" : "Filter activities by category"}>
          <button type="button" onClick={() => setActiveCategory("all")} aria-pressed={activeCategory === "all"}>{zh ? "全部" : "All activities"}</button>
          {activityCategories.map((category) => <button type="button" key={category.id} onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id}>{activityText(category.label, locale)}</button>)}
        </div>
        <div className={styles.activityGrid}>
          {filteredActivities.map((activity) => (
            <article className={styles.activityCard} key={activity.id}>
              <span className={styles.cardDate}>{activityText(activity.dayLabel, locale)}</span>
              <span className={styles.eventCategory} style={{ backgroundColor: activityCategories.find((item) => item.id === activity.category)?.color }}>{activityText(activityCategories.find((item) => item.id === activity.category)!.label, locale)}</span>
              <h3>{activityText(activity.title, locale)}</h3>
              <p>{activity.time} · {activityText(activity.location, locale)}</p>
              <button type="button" disabled>{zh ? "預覽 — 稍後開放報名" : "Preview — booking coming later"}</button>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell tone="white" className={styles.wrapped}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{activityText(c.recentlyWrapped.eyebrow, locale)}</p>
          <h2>{activityText(c.recentlyWrapped.title, locale)}</h2>
          <p>{activityText(c.recentlyWrapped.note, locale)}</p>
        </div>
        <ul>
          {c.recentlyWrapped.items.map((item) => <li key={item.title.en}><time>{item.date}</time><span>{activityText(item.title, locale)}</span><em>{activityText(activityCategories.find((category) => category.id === item.category)!.label, locale)}</em></li>)}
        </ul>
      </SectionShell>

      <SectionShell tone="sky" className={styles.volunteerCta}>
        <div><h2>{activityText(c.volunteer.title, locale)}</h2><p>{activityText(c.volunteer.description, locale)}</p></div>
        <div><ButtonLink href={zh ? "/zh/volunteer-hk/" : "/volunteer/"} variant="teal">{activityText(c.volunteer.primary, locale)}</ButtonLink><ButtonLink href={zh ? "/zh/contact-us-hk/" : "/contact-us/"} variant="outline">{activityText(c.volunteer.secondary, locale)}</ButtonLink></div>
      </SectionShell>
    </article>
  );
}
