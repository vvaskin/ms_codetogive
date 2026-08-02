import type { Locale } from "@/content/site-data";

/**
 * Pick the localized value for a row that stores translations as suffixed
 * columns: `title` (en base), `title_zh` (Traditional), `title_cn` (Simplified).
 * Falls back to the base column when the localized one is empty, so a partly
 * translated row still renders something instead of blanks.
 */
export function pickLocalized<T extends Record<string, unknown>>(
  row: T,
  base: string,
  locale: Locale,
): string | null {
  const localizedKey = locale === "en" ? base : `${base}_${locale}`;
  const localized = row[localizedKey];
  if (typeof localized === "string" && localized.length > 0) return localized;
  const fallback = row[base];
  return typeof fallback === "string" ? fallback : null;
}
