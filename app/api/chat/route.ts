import { NextResponse } from "next/server";

import { company } from "@/content/company";
import { validateChat } from "@/lib/chat-schema";
import { buildSystemPrompt } from "@/lib/chat-context";
import { getCatalogSafe } from "@/lib/catalog";
import { allowChatMessage, hashClientIp } from "@/lib/leads-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MAX_BODY = 20_000;

function configured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** The widget asks this at runtime so the button only appears when a key is configured on the server. */
export async function GET() {
  return NextResponse.json({ enabled: configured() }, { headers: { "Cache-Control": "no-store" } });
}

/** Streams the assistant's reply as plain text. Messages are never logged; only counts and status codes are. */
export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const raw = await req.text();
  if (raw.length > MAX_BODY) return NextResponse.json({ error: "too_long" }, { status: 413 });
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const checked = validateChat(json);
  if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });

  const cap = Math.max(50, Number(process.env.CHAT_DAILY_LIMIT) || 1500);
  const limit = await allowChatMessage(hashClientIp(req), cap);
  if (limit !== "ok") return NextResponse.json({ error: limit === "visitor" ? "rate_limited" : "busy" }, { status: 429 });

  const products = await getCatalogSafe("en");
  const system = buildSystemPrompt(products, {
    whatsapp: company.whatsapp,
    email: company.email,
    site: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://zatgoinnovation.com",
  });

  const model = process.env.CHAT_MODEL?.trim() || DEFAULT_MODEL;
  const base = (process.env.GEMINI_API_URL?.trim() || DEFAULT_BASE).replace(/\/$/, "");
  let upstream: Response;
  try {
    upstream = await fetch(`${base}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "x-goog-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: checked.messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: {
          maxOutputTokens: 600,
          temperature: 0.4,
          // Flash models otherwise spend the output budget on hidden reasoning.
          ...(model.includes("flash") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        },
      }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    console.warn("chat_upstream_unreachable");
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    console.warn("chat_upstream_status", upstream.status);
    const busy = upstream.status === 429 || upstream.status === 503;
    return NextResponse.json({ error: busy ? "busy" : "upstream" }, { status: busy ? 503 : 502 });
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            try {
              const evt = JSON.parse(line.slice(5).trim()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
              const text = (evt.candidates?.[0]?.content?.parts ?? []).map((x) => x.text ?? "").join("");
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              /* ignore keep-alive or partial lines */
            }
          }
        }
      } catch {
        console.warn("chat_stream_error");
      } finally {
        controller.close();
      }
    },
    cancel() {
      void reader.cancel();
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } });
}
