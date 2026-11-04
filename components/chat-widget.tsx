"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { useDemo } from "@/components/demo-dialog";
import { company } from "@/content/company";
import { waLink } from "@/lib/whatsapp";

type Msg = { role: "user" | "assistant"; content: string };
const STORE = "zg-chat-v1";
const MAX_SEND = 9;

function load(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORE);
    const v = raw ? (JSON.parse(raw) as Msg[]) : [];
    return Array.isArray(v) ? v.filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-20) : [];
  } catch {
    return [];
  }
}

/** Floating AI assistant. Messages go to our own /api/chat route (the Anthropic key never reaches the browser); plain text only. */
export function ChatWidget() {
  const t = useTranslations("chat");
  const demo = useDemo();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/chat", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d: { enabled?: boolean }) => alive && setEnabled(Boolean(d.enabled)))
      .catch(() => undefined);
    setMsgs(load());
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-20)));
    } catch {
      /* storage can be blocked; the chat still works */
    }
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [msgs, open]);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    fab.current?.focus();
  }, []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, 600);
      if (!content || busy) return;
      setError(null);
      setInput("");
      const next: Msg[] = [...msgs, { role: "user", content }];
      setMsgs([...next, { role: "assistant", content: "" }]);
      setBusy(true);
      try {
        const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-MAX_SEND) }) });
        if (!res.ok || !res.body) {
          setMsgs(next);
          setError(res.status === 429 ? t("rateLimited") : t("unavailable"));
          return;
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setMsgs([...next, { role: "assistant", content: acc }]);
        }
        if (!acc.trim()) {
          setMsgs(next);
          setError(t("unavailable"));
        }
      } catch {
        setMsgs(next);
        setError(t("unavailable"));
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs, t],
  );

  if (!enabled) return null;
  const wa = waLink(company.whatsapp, t("whatsappMessage"));
  const chips = [t("chipProducts"), t("chipServices"), t("chipPricing")];

  return (
    <>
      {open ? (
        <section
          role="dialog"
          aria-label={t("title")}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-m-line bg-[var(--m-surface-elevated)] text-[var(--m-ink)] shadow-[0_30px_80px_-20px_rgba(16,24,40,0.55)] sm:inset-x-auto sm:bottom-40 sm:end-6 sm:h-[34rem] sm:max-h-[calc(100dvh-11rem)] sm:w-[23.5rem] sm:rounded-3xl print:hidden"
        >
          <header className="flex items-center gap-3 bg-[linear-gradient(120deg,#2952e3,#7657e8_60%,#16b8e8)] px-4 py-3 text-white">
            <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><MessageCircle className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold leading-tight">{t("title")}</p>
              <p className="text-[0.7rem] text-white/85">{t("subtitle")}</p>
            </div>
            {msgs.length ? (
              <button type="button" onClick={() => { setMsgs([]); setError(null); }} className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-white/90 hover:bg-white/15">{t("newChat")}</button>
            ) : null}
            <button type="button" onClick={close} aria-label={t("close")} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"><X className="h-4 w-4" /></button>
          </header>

          <div ref={log} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            <p className="max-w-[85%] rounded-2xl rounded-ss-md bg-[var(--m-surface)] px-3.5 py-2.5 leading-relaxed">{t("greeting")}</p>
            {msgs.map((m, i) => (
              <p key={i} className={m.role === "user" ? "ms-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-se-md bg-[var(--m-accent)] px-3.5 py-2.5 leading-relaxed text-white" : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-ss-md bg-[var(--m-surface)] px-3.5 py-2.5 leading-relaxed"}>
                {m.content || (busy && i === msgs.length - 1 ? <span className="opacity-60">{t("typing")}</span> : null)}
              </p>
            ))}
            {!msgs.length ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {chips.map((c) => (
                  <button key={c} type="button" onClick={() => void send(c)} className="rounded-full border border-m-line px-3 py-1.5 text-xs font-semibold hover:border-[var(--m-accent)] hover:text-[var(--m-accent)]">{c}</button>
                ))}
              </div>
            ) : null}
            {error ? <p role="alert" className="rounded-xl border border-red-300/60 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}
          </div>

          <div className="border-t border-m-line px-3 pb-3 pt-2">
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                rows={1}
                maxLength={600}
                aria-label={t("placeholder")}
                placeholder={t("placeholder")}
                className="m-field max-h-28 min-h-[2.6rem] flex-1 resize-none !py-2.5 text-sm"
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label={t("send")} className="flex h-[2.6rem] w-[2.6rem] shrink-0 items-center justify-center rounded-full bg-[var(--m-accent)] text-white disabled:opacity-50"><Send className="h-4 w-4 rtl:-scale-x-100" /></button>
            </form>
            <p className="mt-2 text-[0.68rem] leading-snug text-m-muted">
              {t("disclaimer")}{" "}
              <button type="button" onClick={() => { close(); demo.open(); }} className="m-link font-semibold">{t("bookDemo")}</button>
              {wa ? (
                <>
                  {" · "}
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="m-link font-semibold">WhatsApp</a>
                </>
              ) : null}
            </p>
          </div>
        </section>
      ) : null}

      <button
        ref={fab}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
        className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2952e3,#7657e8)] text-white shadow-[0_14px_30px_-10px_rgba(60,60,200,0.75)] outline-offset-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#2952e3] print:hidden md:bottom-[calc(1.5rem+4.25rem)] md:end-6"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
      </button>
    </>
  );
}
