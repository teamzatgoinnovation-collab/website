import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type LeadRecord = {
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  interest: string;
  message: string;
  tier?: string;
  locale?: string;
  receivedAt: string;
  ipHash: string;
  id: string;
};

function leadsDir(): string {
  return (
    process.env.LEADS_STORE_DIR?.trim() ||
    path.join(process.cwd(), ".data", "leads")
  );
}

async function ensureDir() {
  await mkdir(leadsDir(), { recursive: true });
}

export async function persistLead(record: LeadRecord): Promise<void> {
  await ensureDir();
  await appendFile(
    path.join(leadsDir(), "leads.jsonl"),
    `${JSON.stringify(record)}\n`,
    "utf8",
  );
}

type QueueItem = {
  id: string;
  lead: LeadRecord;
  attempts: number;
  nextAttemptAt: string;
  lastError?: string;
};

function queuePath() {
  return path.join(leadsDir(), "webhook-queue.jsonl");
}

function failedPath() {
  return path.join(leadsDir(), "webhook-failed.jsonl");
}

export async function enqueueWebhook(lead: LeadRecord): Promise<void> {
  await ensureDir();
  const item: QueueItem = {
    id: lead.id,
    lead,
    attempts: 0,
    nextAttemptAt: new Date().toISOString(),
  };
  await appendFile(queuePath(), `${JSON.stringify(item)}\n`, "utf8");
}

async function readQueue(): Promise<QueueItem[]> {
  try {
    const raw = await readFile(queuePath(), "utf8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as QueueItem);
  } catch {
    return [];
  }
}

async function writeQueue(items: QueueItem[]): Promise<void> {
  await ensureDir();
  const body = items.map((item) => JSON.stringify(item)).join("\n");
  await writeFile(queuePath(), body ? `${body}\n` : "", "utf8");
}

async function deliverOnce(lead: LeadRecord): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!url) return;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...lead,
      notifyEmail: process.env.LEADS_NOTIFY_EMAIL ?? null,
    }),
  });
  if (!res.ok) {
    throw new Error(`Webhook failed with ${res.status}`);
  }
}

const MAX_ATTEMPTS = 5;
const BACKOFF_MS = [0, 2_000, 5_000, 15_000, 60_000];

/**
 * Attempt webhook delivery with retries. Failures are queued; never throws to callers
 * after the first persist has succeeded.
 */
export async function deliverWebhookWithRetry(lead: LeadRecord): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!url) return;

  let lastError = "";
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const delay = BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)] ?? 0;
    if (delay > 0) {
      await new Promise((r) => setTimeout(r, delay));
    }
    try {
      await deliverOnce(lead);
      console.info(
        JSON.stringify({
          event: "lead_webhook_delivered",
          id: lead.id,
          attempts: attempt + 1,
        }),
      );
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.warn("lead_webhook_attempt_failed", {
        id: lead.id,
        attempt: attempt + 1,
        error: lastError,
      });
    }
  }

  await ensureDir();
  await appendFile(
    failedPath(),
    `${JSON.stringify({
      ...lead,
      failedAt: new Date().toISOString(),
      lastError,
      attempts: MAX_ATTEMPTS,
    })}\n`,
    "utf8",
  );
  await enqueueWebhook(lead);
}

/** Drain due webhook queue items (for cron / manual retry). */
export async function processWebhookQueue(limit = 20): Promise<{
  processed: number;
  delivered: number;
  failed: number;
}> {
  const url = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!url) return { processed: 0, delivered: 0, failed: 0 };

  const now = Date.now();
  const items = await readQueue();
  const remaining: QueueItem[] = [];
  let processed = 0;
  let delivered = 0;
  let failed = 0;

  for (const item of items) {
    if (processed >= limit) {
      remaining.push(item);
      continue;
    }
    if (Date.parse(item.nextAttemptAt) > now) {
      remaining.push(item);
      continue;
    }

    processed += 1;
    try {
      await deliverOnce(item.lead);
      delivered += 1;
    } catch (error) {
      const attempts = item.attempts + 1;
      const lastError = error instanceof Error ? error.message : String(error);
      if (attempts >= MAX_ATTEMPTS) {
        failed += 1;
        await appendFile(
          failedPath(),
          `${JSON.stringify({
            ...item.lead,
            failedAt: new Date().toISOString(),
            lastError,
            attempts,
          })}\n`,
          "utf8",
        );
      } else {
        const backoff = BACKOFF_MS[Math.min(attempts, BACKOFF_MS.length - 1)] ?? 60_000;
        remaining.push({
          ...item,
          attempts,
          lastError,
          nextAttemptAt: new Date(now + backoff).toISOString(),
        });
      }
    }
  }

  await writeQueue(remaining);
  return { processed, delivered, failed };
}
