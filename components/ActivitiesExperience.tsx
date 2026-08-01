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
  const zh = locale === "zh" || locale === "cn";
  const intlLocale = locale === "cn" ? "zh-CN" : locale === "zh" ? "zh-HK" : "en-HK";
  const pick = (en: string, zht: string, zhc: string) =>
    locale === "cn" ? zhc : locale === "zh" ? zht : en;
  const c = activitiesContent;
  const weekdays = zh
    ? ["日", "一", "二", "三", "四", "五", "六"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabel = new Intl.DateTimeFormat(intlLocale, {
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
            <ButtonLink href={pick("/get-involved/#opportunities", "/zh/get-involved-hk/#opportunities", "/cn/get-involved/#opportunities")} variant="outline">
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
          <p className={styles.eyebrow}>{pick("Activity calendar", "活動日曆", "活动日历")}</p>
          <h2>{pick("Pick a date. See what’s on.", "選擇日期，查看當日活動。", "选择日期，查看当日活动。")}</h2>
          <p>{pick("Days with coloured dots have activities. Select the same day again, or clear your selection, to return to the full calendar.", "有彩色圓點的日期代表有活動。按相同日期或清除選擇可回到完整日曆。", "有彩色圆点的日期代表有活动。按相同日期或清除选择可回到完整日历。")}</p>
        </div>
        <div className={`${styles.calendarLayout} ${selectedDate ? styles.calendarSelected : ""}`}>
          <div className={styles.calendarCard}>
            <div className={styles.calendarHeader}>
              <h3>{monthLabel}</h3>
              {selectedDate && (
                <button type="button" className={styles.clearSelection} onClick={() => setSelectedDate(null)}>
                  {pick("Clear selection", "清除選擇", "清除选择")}
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
                const dateLabel = new Intl.DateTimeFormat(intlLocale, {
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
                    aria-label={`${dateLabel}${dayEvents.length ? `, ${dayEvents.length} ${pick(dayEvents.length === 1 ? "activity" : "activities", "項活動", "项活动")}` : ""}`}
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
                  <p>{pick("Selected date", "已選日期", "已选日期")}</p>
                  <h3>{new Intl.DateTimeFormat(intlLocale, { month: "long", day: "numeric" }).format(new Date(`${selectedDate}T12:00:00`))}</h3>
                </div>
                <button type="button" onClick={() => setSelectedDate(null)} aria-label={pick("Close selected day events", "關閉已選日期活動", "关闭已选日期活动")}>×</button>
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
                <p className={styles.emptyDay}>{pick("No demo activities are listed for this day. Choose a date with coloured dots to explore.", "這天暫未有示範活動。請選擇另一個有彩色圓點的日期。", "这天暂未有示范活动。请选择另一个有彩色圆点的日期。")}</p>
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
            const href =
              index === 0
                ? pick("/join-us/", "/zh/join-us-hk/", "/cn/join-us/")
                : index === 1
                  ? pick("/get-involved/#opportunities", "/zh/get-involved-hk/#opportunities", "/cn/get-involved/#opportunities")
                  : pick("/get-involved/#corporate", "/zh/get-involved-hk/#corporate", "/cn/get-involved/#corporate");
            return <Link href={href} className={styles.quickCard} key={item.title.en}><strong>{activityText(item.title, locale)}</strong><span>{activityText(item.copy, locale)}</span><b aria-hidden="true">→</b></Link>;
          })}
        </div>
      </SectionShell>

      <SectionShell tone="blush" className={styles.upcoming}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{pick("What’s coming up", "即將舉行", "即将举行")}</p>
          <h2>{pick("Upcoming activities", "即將舉行的活動", "即将举行的活动")}</h2>
          <p>{pick("These are demo activity listings; registration will be available later.", "以下為示範活動資料；報名功能將於日後推出。", "以下为示范活动资料；报名功能将于日后推出。")}</p>
        </div>
        <div className={styles.filters} aria-label={pick("Filter activities by category", "活動類別篩選", "活动类别筛选")}>
          <button type="button" onClick={() => setActiveCategory("all")} aria-pressed={activeCategory === "all"}>{pick("All activities", "全部", "全部")}</button>
          {activityCategories.map((category) => <button type="button" key={category.id} onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id}>{activityText(category.label, locale)}</button>)}
        </div>
        <div className={styles.activityGrid}>
          {filteredActivities.map((activity) => (
            <article className={styles.activityCard} key={activity.id}>
              <span className={styles.cardDate}>{activityText(activity.dayLabel, locale)}</span>
              <span className={styles.eventCategory} style={{ backgroundColor: activityCategories.find((item) => item.id === activity.category)?.color }}>{activityText(activityCategories.find((item) => item.id === activity.category)!.label, locale)}</span>
              <h3>{activityText(activity.title, locale)}</h3>
              <p>{activity.time} · {activityText(activity.location, locale)}</p>
              <button type="button" disabled>{pick("Preview — booking coming later", "預覽 — 稍後開放報名", "预览 — 稍后开放报名")}</button>
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
        <div><ButtonLink href={pick("/get-involved/#opportunities", "/zh/get-involved-hk/#opportunities", "/cn/get-involved/#opportunities")} variant="teal">{activityText(c.volunteer.primary, locale)}</ButtonLink><ButtonLink href={pick("/contact-us/", "/zh/contact-us-hk/", "/cn/contact-us/")} variant="outline">{activityText(c.volunteer.secondary, locale)}</ButtonLink></div>
      </SectionShell>
    </article>
  );
}
