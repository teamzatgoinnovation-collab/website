"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { SpaceStep } from "@/lib/space-steps";

const SLIDE_MS = 6000;

export type SpaceSlideshowLabels = { prev: string; next: string; slide: string; step: string; video: string; note: string; host: string };

/**
 * A YouTube video shown as a thumbnail first; the player (youtube-nocookie, no third-party cookies before a click) is only
 * loaded when the visitor presses play, so the home page stays fast.
 */
function VideoSlide({ id, title, play }: { id: string; title: string; play: string }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  return (
    <button type="button" onClick={() => setOn(true)} aria-label={`${play}: ${title}`} className="group relative block h-full w-full overflow-hidden bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--m-accent)] text-white shadow-xl ring-4 ring-white/40 transition-transform group-hover:scale-110"><Play className="h-7 w-7 translate-x-0.5" aria-hidden /></span>
      </span>
    </button>
  );
}

/**
 * The steps to create a site, one slide each. A slide shows the screenshot uploaded in the admin, whole and uncropped;
 * without one it shows a numbered step card. Autoplay pauses on hover, focus and hidden tabs, and is off for reduced motion.
 */
export function SpaceStepsSlideshow({ steps, labels }: { steps: SpaceStep[]; labels: SpaceSlideshowLabels }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [hidden, setHidden] = useState(false);
  const count = steps.length;
  const autoplay = !reduce && count > 1;
  const stepTotal = steps.filter((x) => x.kind === "step").length;

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (count === 0) return null;
  const go = (d: number) => setI((cur) => (cur + d + count) % count);
  const step = steps[Math.min(i, count - 1)];

  return (
    <div className="relative" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)} aria-roledescription="carousel" aria-label={labels.slide}>
      <div className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_30px_60px_-28px_rgba(16,24,40,0.5)] dark:border-white/10 dark:bg-[var(--m-surface-elevated)]">
        <div className="flex items-center gap-2 border-b border-m-line bg-[var(--m-surface)] px-3 py-2">
          <span aria-hidden className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28C840]" /></span>
          <span className="mx-auto truncate rounded-full bg-white px-3 py-0.5 text-[0.7rem] text-m-muted dark:bg-white/10">{labels.host}</span>
        </div>
        <div className="relative aspect-[16/10] bg-[var(--m-surface)]" aria-live={hold ? "polite" : "off"}>
          <AnimatePresence mode="wait">
            <motion.div key={step.kind + step.n} className="absolute inset-0" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.35 }}>
              {step.kind === "video" && step.video ? (
                <VideoSlide id={step.video} title={step.title} play={labels.video} />
              ) : step.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={step.image} alt={step.title} loading={step.n === 1 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-contain object-top" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--m-accent)] font-display text-2xl font-bold text-white shadow-lg">{step.n}</span>
                  <p className="font-display text-xl font-semibold tracking-tight text-[var(--m-ink)]">{step.title}</p>
                  {step.caption ? <p className="max-w-sm text-sm leading-relaxed text-m-muted">{step.caption}</p> : null}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-sm backdrop-blur dark:bg-[var(--m-surface-elevated)]/85">
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--m-accent)]">{step.kind === "video" ? labels.video : `${labels.step} ${step.n} / ${stepTotal}`}</p>
          <p className="truncate font-display text-base font-semibold text-[var(--m-ink)]">{step.title}</p>
          {(step.image || step.kind === "video") && step.caption ? <p className="mt-0.5 text-sm text-m-muted">{step.caption}</p> : null}
        </div>
        <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-2 py-1.5 shadow-lg backdrop-blur dark:bg-[var(--m-surface-elevated)]/90" role="group" aria-label={labels.slide}>
          <button type="button" aria-label={labels.prev} onClick={() => go(-1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--m-accent)] ring-1 ring-[var(--m-accent)]/30 hover:bg-[var(--m-accent)] hover:text-white"><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
          {steps.map((s, n) => (
            <button key={s.kind + s.n} type="button" aria-label={`${labels.slide} ${n + 1}: ${s.title}`} aria-current={n === i} onClick={() => setI(n)} className={cn("relative h-2 overflow-hidden rounded-full transition-all", n === i ? "w-9 bg-[#C9D5F2]" : "w-2 bg-[#B7C3DD] hover:bg-[#8FA0C4]")}>
              {n === i ? (
                <span
                  key={`${step.kind}${step.n}-${hold || hidden}`}
                  className="absolute inset-0 origin-left rounded-full bg-[var(--m-accent)] rtl:origin-right"
                  style={autoplay && step.kind === "step" ? { animation: `dot-progress ${SLIDE_MS}ms linear forwards`, animationPlayState: hold || hidden ? "paused" : "running" } : undefined}
                  onAnimationEnd={() => go(1)}
                />
              ) : null}
            </button>
          ))}
          <button type="button" aria-label={labels.next} onClick={() => go(1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--m-accent)] ring-1 ring-[var(--m-accent)]/30 hover:bg-[var(--m-accent)] hover:text-white"><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
        </div>
      </div>
      <p className="mt-3 inline-block rounded-full bg-white/80 px-3 py-1 text-xs text-[color-mix(in_oklch,var(--m-ink)_70%,transparent)] backdrop-blur dark:bg-[var(--m-surface-elevated)]/80">{labels.note}</p>
    </div>
  );
}
