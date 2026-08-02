/**
 * Reject anything that isn't a same-origin, non-protocol-relative absolute
 * path. Guards the `next` query parameter used across login redirects.
 */
export function safeRedirect(
  value: string | string[] | undefined,
  fallback = "/portal",
): string {
  const path = Array.isArray(value) ? value[0] : value;
  return path?.startsWith("/") && !path.startsWith("//") ? path : fallback;
}
