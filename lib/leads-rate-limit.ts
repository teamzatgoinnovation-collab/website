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

function memoryAllow(key: string): boolean {
  const now = Date.now();
  const entry = memoryMap.get(key);
  if (!entry || now > entry.resetAt) {
    memoryMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_HITS) return false;
  entry.count += 1;
  return true;
}

async function upstashAllow(key: string): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const redisKey = `marketing:leads:rl:${key}`;
  const pipe = [
    ["INCR", redisKey],
    ["PEXPIRE", redisKey, String(WINDOW_MS), "NX"],
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
    return count <= MAX_HITS;
  } catch (error) {
    console.warn("upstash_ratelimit_error", error);
    return null;
  }
}

async function ioredisAllow(key: string): Promise<boolean | null> {
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
        await redis.pexpire(redisKey, WINDOW_MS);
      }
      return count <= MAX_HITS;
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
