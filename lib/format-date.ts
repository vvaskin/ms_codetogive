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
