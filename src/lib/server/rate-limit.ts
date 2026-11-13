import "server-only";

/**
 * Fixed-window in-memory limiter. Good enough for a single Node server; on serverless each
 * instance has its own counters, so put Upstash/Redis behind this same interface when deploying there.
 */
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
}

/** Count every call; ok=false once `limit` is exceeded within the window. */
export function hit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  return { ok: b.count <= limit, retryAfter: Math.ceil((b.reset - now) / 1000) };
}

/** Failure-only counting (e.g. wrong passwords): check first, record on failure, clear on success. */
export function isBlocked(key: string, limit: number): boolean {
  const b = buckets.get(key);
  return !!b && b.reset > Date.now() && b.count >= limit;
}
export function recordFailure(key: string, windowMs: number) {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || b.reset < now) buckets.set(key, { count: 1, reset: now + windowMs });
  else b.count += 1;
}
export function clearKey(key: string) {
  buckets.delete(key);
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}
