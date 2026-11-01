import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { LeadRecord } from "@/lib/leads-store";

/**
 * Forwards leads to website-api. The local JSONL file stays the first, durable record; this is the
 * second hop. `submissionId` is the lead's own UUID, so retries (and duplicate deliveries) are
 * idempotent on the API's database unique constraint.
 */

const MAX_ATTEMPTS = 8;
const BACKOFF_MS = [0, 2_000, 5_000, 30_000, 120_000, 600_000, 1_800_000, 3_600_000];

export function apiConfig(): { url: string; key: string } | null {
  const url = process.env.LEADS_API_URL?.trim().replace(/\/$/, "");
  const key = process.env.LEADS_API_KEY?.trim();
  return url && key ? { url, key } : null;
}

/** Website inquiry types map onto the API's EnquiryType; "demo" has its own endpoint. */
const ENQUIRY_TYPE: Record<string, string> = {
  sales: "SALES",
  support: "SUPPORT",
  partnership: "PARTNERSHIP",
  quotation: "QUOTATION",
  careers: "CAREERS",
  other: "OTHER",
};

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

export function toApiRequest(lead: LeadRecord): { path: string; body: Record<string, unknown> } {
  const interest = lead.tier ? `${lead.interest} (${lead.tier})` : lead.interest;
  const common = {
    submissionId: lead.id,
    name: cut(lead.name, 120),
    email: lead.email.toLowerCase(),
    locale: lead.locale ? cut(lead.locale, 10) : undefined,
  };
  if (lead.inquiryType === "demo") {
    return {
      path: "/public/demo",
      body: { ...common, company: cut(lead.company, 160), message: cut(`${interest}\n\n${lead.message}`, 5000) },
    };
  }
  return {
    path: "/public/contact",
    body: {
      ...common,
      type: ENQUIRY_TYPE[lead.inquiryType] ?? "CONTACT",
      company: cut(lead.company, 160),
      interest: cut(interest, 200),
      message: cut(lead.message, 5000),
      source: "website",
    },
  };
}

export type ForwardResult = "delivered" | "retry" | "rejected" | "disabled";

/** One attempt. "rejected" = the API refused the payload (4xx); retrying cannot help. */
export async function forwardLeadOnce(lead: LeadRecord): Promise<ForwardResult> {
  const cfg = apiConfig();
  if (!cfg) return "disabled";
  const req = toApiRequest(lead);
  try {
    const res = await fetch(`${cfg.url}${req.path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ingest-key": cfg.key, "x-client-ip": lead.ipHash },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return "delivered"; // 202 whether newly created or a duplicate of the same submissionId
    if (res.status === 408 || res.status === 429 || res.status >= 500) return "retry";
    console.error("lead_api_rejected", { id: lead.id, status: res.status });
    return "rejected";
  } catch (error) {
    console.warn("lead_api_unreachable", { id: lead.id, error: error instanceof Error ? error.message : String(error) });
    return "retry";
  }
}

type ApiQueueItem = { id: string; lead: LeadRecord; attempts: number; nextAttemptAt: string; lastError?: string };

const dir = () => process.env.LEADS_STORE_DIR?.trim() || path.join(process.cwd(), ".data", "leads");
const queueFile = () => path.join(dir(), "api-queue.jsonl");
const deadFile = () => path.join(dir(), "api-rejected.jsonl");

async function readQueue(): Promise<ApiQueueItem[]> {
  try {
    return (await readFile(queueFile(), "utf8"))
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => JSON.parse(l) as ApiQueueItem);
  } catch {
    return [];
  }
}

async function writeQueue(items: ApiQueueItem[]) {
  await mkdir(dir(), { recursive: true });
  const body = items.map((i) => JSON.stringify(i)).join("\n");
  await writeFile(queueFile(), body ? `${body}\n` : "", "utf8");
}

async function deadLetter(lead: LeadRecord, reason: string) {
  await mkdir(dir(), { recursive: true });
  await appendFile(deadFile(), `${JSON.stringify({ ...lead, rejectedAt: new Date().toISOString(), reason })}\n`, "utf8");
}

async function enqueue(lead: LeadRecord, lastError: string) {
  await mkdir(dir(), { recursive: true });
  const item: ApiQueueItem = { id: lead.id, lead, attempts: 1, nextAttemptAt: new Date(Date.now() + BACKOFF_MS[1]).toISOString(), lastError };
  await appendFile(queueFile(), `${JSON.stringify(item)}\n`, "utf8");
}

/** Called after the HTTP response: two quick attempts, then hand over to the retry queue. */
export async function forwardLeadWithRetry(lead: LeadRecord): Promise<void> {
  if (!apiConfig()) return;
  for (const delay of [0, 2_000]) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    const result = await forwardLeadOnce(lead);
    if (result === "delivered") return;
    if (result === "rejected") return deadLetter(lead, "api_rejected_payload");
  }
  await enqueue(lead, "api_unreachable_or_5xx");
}

/** Drain due items (PUT /api/leads). Safe to run repeatedly: the API de-duplicates on submissionId. */
export async function processApiQueue(limit = 20): Promise<{ processed: number; delivered: number; rejected: number; pending: number }> {
  if (!apiConfig()) return { processed: 0, delivered: 0, rejected: 0, pending: 0 };
  const now = Date.now();
  const items = await readQueue();
  const keep: ApiQueueItem[] = [];
  let processed = 0;
  let delivered = 0;
  let rejected = 0;

  for (const item of items) {
    if (processed >= limit || Date.parse(item.nextAttemptAt) > now) {
      keep.push(item);
      continue;
    }
    processed += 1;
    const result = await forwardLeadOnce(item.lead);
    if (result === "delivered") {
      delivered += 1;
    } else if (result === "rejected") {
      rejected += 1;
      await deadLetter(item.lead, "api_rejected_payload");
    } else if (item.attempts + 1 >= MAX_ATTEMPTS) {
      rejected += 1;
      await deadLetter(item.lead, "api_unreachable_max_attempts");
    } else {
      const attempts = item.attempts + 1;
      keep.push({ ...item, attempts, nextAttemptAt: new Date(now + BACKOFF_MS[Math.min(attempts, BACKOFF_MS.length - 1)]).toISOString() });
    }
  }
  await writeQueue(keep);
  return { processed, delivered, rejected, pending: keep.length };
}
