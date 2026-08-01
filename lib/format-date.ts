// Hand-rolled date formatting: month/weekday abbreviations must come from a
// fixed lookup table, not Intl.DateTimeFormat. Node's ICU data and a
// browser's ICU data can disagree on locale abbreviations (e.g. "en-HK"
// gives "Sep" server-side but "Sept" client-side), which breaks React
// hydration. A hardcoded array is identical on every environment.

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
 * bare `YYYY-MM-DD`.
 */
export function formatWeekdayDayMonthAt(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
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
