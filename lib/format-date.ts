// Hand-rolled date formatting: month/weekday abbreviations must come from a
// fixed lookup table, not Intl.DateTimeFormat. Node's ICU data and a
// browser's ICU data can disagree on locale abbreviations (e.g. "en-HK"
// gives "Sep" server-side but "Sept" client-side), which breaks React
// hydration. A hardcoded array is identical on every environment.

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WEEKDAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"];

export type FormatLocale = "en" | "zh" | "cn";

export function formatDayMonthYear(iso: string, time = "T00:00:00"): string {
  const d = new Date(`${iso}${time}`);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatWeekdayDayMonth(iso: string, time = "T12:00:00"): string {
  const d = new Date(`${iso}${time}`);
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

export function formatMonthDay(iso: string, time = "T12:00:00"): string {
  const d = new Date(`${iso}${time}`);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Weekday + day + month from a full timestamp (e.g. events.starts_at).
 * Distinct from formatWeekdayDayMonth which appends a fake time to a
 * bare `YYYY-MM-DD`. Accepts an optional locale for Chinese variants.
 */
export function formatWeekdayDayMonthAt(iso: string, locale: FormatLocale = "en"): string {
  const d = new Date(iso);
  if (locale === "zh" || locale === "cn") {
    const weekPrefix = locale === "zh" ? "週" : "周";
    return `${d.getDate()}月${d.getMonth() + 1}日（${weekPrefix}${WEEKDAYS_ZH[d.getDay()]}）`;
  }
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/**
 * Full date from a full timestamp, hydration-safe (fixed lookup tables).
 */
export function formatDayMonthYearAt(iso: string, locale: FormatLocale = "en"): string {
  const d = new Date(iso);
  if (locale === "zh" || locale === "cn") {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

function formatClockTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * "9:30 AM – 11:30 AM" (with an en dash) when endsAt is set, else just start.
 */
export function formatEventTime(
  startsAtIso: string,
  endsAtIso?: string | null,
): string {
  const start = formatClockTime(startsAtIso);
  if (!endsAtIso) return start;
  return `${start} – ${formatClockTime(endsAtIso)}`;
}

/**
 * Localized event time: "9:30 AM – 11:30 AM" in English, "上午9:30 – 上午11:30"
 * in the Chinese variants (hydration-safe, fixed lookup tables).
 */
export function formatEventTimeLocale(
  startsAtIso: string,
  endsAtIso?: string | null,
  locale: FormatLocale = "en",
): string {
  if (locale === "en") return formatEventTime(startsAtIso, endsAtIso);

  const start = formatClockChinese(startsAtIso);
  if (!endsAtIso) return start;
  return `${start} – ${formatClockChinese(endsAtIso)}`;
}

function formatClockChinese(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const period = h < 12 ? "上午" : "下午";
  h = h % 12 || 12;
  return `${period}${h}:${m.toString().padStart(2, "0")}`;
}
