import { randomUUID } from "node:crypto";

import { after, NextResponse } from "next/server";
import { z } from "zod";

import { inquiryTypes } from "@/content/company";
import { allowLeadRequest, hashClientIp } from "@/lib/leads-rate-limit";
import {
  deliverWebhookWithRetry,
  persistLead,
  processWebhookQueue,
  type LeadRecord,
} from "@/lib/leads-store";

export const runtime = "nodejs";

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  company: z.string().min(2).max(160),
  inquiryType: z.enum(inquiryTypes as unknown as [string, ...string[]]),
  interest: z.string().min(2).max(240),
  message: z.string().min(10).max(4000),
  tier: z.string().max(80).optional(),
  locale: z.string().max(12).optional(),
  /** Honeypot — bots fill this; humans leave it empty */
  website: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const ipHash = hashClientIp(request);
  const { allowed, backend } = await allowLeadRequest(ipHash);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  const record: LeadRecord = {
    id: randomUUID(),
    name: payload.name,
    email: payload.email,
    company: payload.company,
    inquiryType: payload.inquiryType,
    interest: payload.interest,
    message: payload.message,
    tier: payload.tier,
    locale: payload.locale,
    receivedAt: new Date().toISOString(),
    ipHash,
  };

  try {
    await persistLead(record);
  } catch (error) {
    console.error("lead_persist_failed", error);
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }

  // Persist succeeded — never fail the HTTP response for webhook issues.
  after(async () => {
    try {
      await deliverWebhookWithRetry(record);
    } catch (error) {
      console.error("lead_webhook_background_failed", error);
    }
  });

  console.info(
    JSON.stringify({
      event: "lead_received",
      id: record.id,
      inquiryType: record.inquiryType,
      company: record.company,
      interest: record.interest,
      tier: record.tier ?? null,
      locale: record.locale ?? null,
      rateLimitBackend: backend,
      notifyEmail: process.env.LEADS_NOTIFY_EMAIL ? "configured" : "none",
      webhook: process.env.LEADS_WEBHOOK_URL ? "queued" : "none",
    }),
  );

  return NextResponse.json({ ok: true, id: record.id });
}

/** Optional queue drain — protect with LEADS_RETRY_SECRET when exposed. */
export async function PUT(request: Request) {
  const secret = process.env.LEADS_RETRY_SECRET?.trim();
  if (secret) {
    const header = request.headers.get("x-leads-retry-secret");
    if (header !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "retry_secret_required" },
      { status: 503 },
    );
  }

  const result = await processWebhookQueue();
  return NextResponse.json({ ok: true, ...result });
}
