import { createHash } from "node:crypto";

const WINDOW_MS = 60_000;
const MAX_HITS = 8;

const memoryMap = new Map<string, { count: number; resetAt: number }>();

export function hashClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const raw = forwarded || realIp || "unknown";
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

function memoryAllow(key: string, windowMs = WINDOW_MS, max = MAX_HITS): boolean {
  const now = Date.now();
  const entry = memoryMap.get(key);
  if (!entry || now > entry.resetAt) {
    memoryMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

async function upstashAllow(key: string, windowMs = WINDOW_MS, max = MAX_HITS): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const redisKey = `marketing:leads:rl:${key}`;
  const pipe = [
    ["INCR", redisKey],
    ["PEXPIRE", redisKey, String(windowMs), "NX"],
  ];

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipe),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn("upstash_ratelimit_http", res.status);
      return null;
    }
    const data = (await res.json()) as { result?: number }[];
    const count = Number(data?.[0]?.result ?? 0);
    return count <= max;
  } catch (error) {
    console.warn("upstash_ratelimit_error", error);
    return null;
  }
}

async function ioredisAllow(key: string, windowMs = WINDOW_MS, max = MAX_HITS): Promise<boolean | null> {
  const redisUrl = process.env.REDIS_URL?.trim();
  if (!redisUrl) return null;

  try {
    const { default: Redis } = await import("ioredis");
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
      connectTimeout: 1500,
    });
    try {
      await redis.connect();
      const redisKey = `marketing:leads:rl:${key}`;
      const count = await redis.incr(redisKey);
      if (count === 1) {
        await redis.pexpire(redisKey, windowMs);
      }
      return count <= max;
    } finally {
      redis.disconnect();
    }
  } catch (error) {
    console.warn("ioredis_ratelimit_error", error);
    return null;
  }
}

/**
 * Allow a lead submission for the hashed client key.
 * Prefers Upstash REST, then REDIS_URL (ioredis), then in-memory fallback.
 */
export async function allowLeadRequest(key: string): Promise<{
  allowed: boolean;
  backend: "upstash" | "redis" | "memory";
}> {
  const upstash = await upstashAllow(key);
  if (upstash !== null) {
    return { allowed: upstash, backend: "upstash" };
  }

  const redis = await ioredisAllow(key);
  if (redis !== null) {
    return { allowed: redis, backend: "redis" };
  }

  return { allowed: memoryAllow(key), backend: "memory" };
}

async function allowWith(key: string, windowMs: number, max: number): Promise<boolean> {
  return (await upstashAllow(key, windowMs, max)) ?? (await ioredisAllow(key, windowMs, max)) ?? memoryAllow(`${windowMs}:${key}`, windowMs, max);
}

/**
 * The visitor confirmation goes to an address a stranger typed, so one address may receive at most 1 per hour and 5 per day.
 * The address is hashed before it is used as a key. Both windows are consumed together.
 */
export async function allowConfirmationEmail(email: string): Promise<boolean> {
  const key = createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24);
  const hour = await allowWith(`confirm:h:${key}`, 3_600_000, 1);
  const day = await allowWith(`confirm:d:${key}`, 86_400_000, 5);
  return hour && day;
}

/** Chat assistant limits: per visitor (hashed IP) 15 messages / 10 min and 80 / day, plus one global daily cap that bounds the API bill. */
export async function allowChatMessage(clientKey: string, globalDailyCap: number): Promise<"ok" | "visitor" | "global"> {
  const burst = await allowWith(`chat:b:${clientKey}`, 600_000, 15);
  const day = await allowWith(`chat:d:${clientKey}`, 86_400_000, 80);
  if (!burst || !day) return "visitor";
  const global = await allowWith("chat:global", 86_400_000, globalDailyCap);
  return global ? "ok" : "global";
}
