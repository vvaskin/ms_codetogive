import "server-only";

/**
 * Naive in-memory sliding-bucket rate limiter, keyed by whatever identifier
 * the caller passes (typically an IP address).
 *
 * Known limitations — acceptable while we defer real bot protection:
 * - Per-process memory. Doesn't survive serverless cold starts and isn't
 *   shared across multiple concurrent instances behind a load balancer, so a
 *   determined attacker can bypass by hitting different instances.
 * - Resets on every deploy.
 * Move to a shared store (Upstash Redis, a Supabase table with a cleanup job,
 * or similar) if abuse actually shows up in the wild.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  // an expired window is replaced wholesale, so each burst restarts with a full quota
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
