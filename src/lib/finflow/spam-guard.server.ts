import { getRequestHeader } from "@tanstack/react-start/server";

/**
 * Best-effort anti-spam for public forms:
 *  - honeypot field (bots fill hidden inputs)
 *  - minimum time-to-submit (bots submit instantly)
 *  - per-IP sliding-window rate limit (in-memory per server instance)
 */
const buckets = new Map<string, number[]>();

function clientIp(): string {
  const h = (n: string) => getRequestHeader(n) ?? "";
  return (
    h("cf-connecting-ip") ||
    h("x-real-ip") ||
    h("x-forwarded-for").split(",")[0]?.trim() ||
    "unknown"
  );
}

export type GuardResult = "ok" | "bot" | "rate_limited";

export function guardForm(opts: {
  scope: string;
  honeypot?: string;
  startedAt?: number;
  limit: number;
  windowMs: number;
  minFillMs?: number;
}): GuardResult {
  if (opts.honeypot && opts.honeypot.trim() !== "") return "bot";
  if (opts.startedAt && Date.now() - opts.startedAt < (opts.minFillMs ?? 1500)) return "bot";

  const key = `${opts.scope}:${clientIp()}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < opts.windowMs);
  if (hits.length >= opts.limit) {
    buckets.set(key, hits);
    return "rate_limited";
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < opts.windowMs)) buckets.delete(k);
  }
  return "ok";
}
