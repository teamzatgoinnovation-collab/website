"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { AppleIPhoneFrame, ScreenshotSlot } from "@/components/devices";
import { cn } from "@/lib/cn";

export type PhoneProduct = {
  slug: string;
  name: string;
  tagline: string;
  /** Capability names from the product data: one phone screen per capability. */
  features: string[];
  /** Mobile screenshots uploaded in the admin (never empty here: products without any are not listed). */
  mobile: string[];
  accent: string;
};

const STEP_MS = 5200;

export function IphoneShowcase({ products, ariaLabel }: { products: PhoneProduct[]; ariaLabel: string }) {
  const reduce = useReducedMotion();
  const [pi, setPi] = useState(0);
  const [fi, setFi] = useState(0);
  const [hold, setHold] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [fine, setFine] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const product = products[pi] ?? products[0];
  const features = product?.features.length ? product.features : [product?.tagline ?? ""];
  const safeFi = Math.min(fi, features.length - 1);

  const rx = useSpring(useMotionValue(0), { stiffness: 90, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 90, damping: 16 });
  const rotateY = useTransform(ry, (v) => v * 16);
  const rotateX = useTransform(rx, (v) => v * -11);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const upd = () => setFine(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { mq.removeEventListener("change", upd); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const tilt = fine && !reduce;
  const onMove = useCallback((e: React.PointerEvent) => {
    if (!tilt || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    ry.set((e.clientX - r.left) / r.width - 0.5);
    rx.set((e.clientY - r.top) / r.height - 0.5);
  }, [tilt, rx, ry]);
  const onLeave = useCallback(() => { rx.set(0); ry.set(0); setHold(false); }, [rx, ry]);

  if (!product) return null;
  const step = (d: number) => setFi((n) => (Math.min(n, features.length - 1) + d + features.length) % features.length);
  const pick = (n: number) => { setPi(n); setFi(0); };
  const autoplay = !reduce && features.length > 1;
  const shot = product.mobile[safeFi % product.mobile.length];

  return (
    <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto_1fr]" aria-label={ariaLabel}>
      {/* product tabs + feature list */}
      <div className="order-2 lg:order-1">
        <div role="tablist" aria-label="Products" className="mb-6 flex flex-wrap gap-2">
          {products.map((p, n) => (
            <button key={p.slug} role="tab" aria-selected={n === pi} onClick={() => pick(n)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", n === pi ? "text-white shadow-md" : "bg-white text-m-muted ring-1 ring-black/5 hover:text-[var(--m-ink)] dark:bg-white/10 dark:ring-white/10")} style={n === pi ? { background: p.accent } : undefined}>
              {p.name}
            </button>
          ))}
        </div>
        <ul className="space-y-1.5" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
          {features.map((f, n) => {
            const active = n === safeFi;
            return (
              <li key={`${product.slug}-${f}`}>
                <button type="button" onClick={() => setFi(n)} aria-current={active} className={cn("group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-start transition-colors", active ? "bg-white shadow-[0_14px_30px_-18px_rgba(16,24,40,0.5)] dark:bg-white/10" : "hover:bg-white/60 dark:hover:bg-white/5")}>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: active ? product.accent : "#B7C3DD" }}>{n + 1}</span>
                  <span className={cn("font-display text-base font-semibold", active ? "text-[var(--m-ink)]" : "text-m-muted")}>{f}</span>
                  {active && autoplay ? (
                    <span
                      key={`${product.slug}-${n}-${hold || hidden}`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left rtl:origin-right"
                      style={{ background: product.accent, animation: `dot-progress ${STEP_MS}ms linear forwards`, animationPlayState: hold || hidden ? "paused" : "running" }}
                      onAnimationEnd={() => step(1)}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* phone */}
      <div ref={stage} className="order-1 flex justify-center lg:order-2" onPointerMove={onMove} onPointerEnter={() => setHold(true)} onPointerLeave={onLeave}>
        <div className="relative w-[15.5rem] sm:w-[17rem]" style={{ perspective: 1100 }}>
          <div aria-hidden className="absolute -inset-10 -z-10 rounded-full opacity-60 blur-3xl" style={{ background: `radial-gradient(closest-side, ${product.accent}66, transparent)` }} />
          <motion.div
            style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
            drag={fine ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 50) step(info.offset.x < 0 ? 1 : -1); }}
          >
            <AppleIPhoneFrame>
              <AnimatePresence mode="wait">
                <motion.div key={`${product.slug}-${safeFi}`} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.35 }} aria-live="polite">
                  <ScreenshotSlot src={shot} alt={`${product.name}: ${features[safeFi]}`} />
                </motion.div>
              </AnimatePresence>
            </AppleIPhoneFrame>
          </motion.div>
        </div>
      </div>

      {/* product blurb */}
      <div className="order-3 hidden lg:block">
        <p className="font-display text-2xl font-bold tracking-tight">{product.name}</p>
        <p className="mt-2 text-sm leading-relaxed text-m-muted">{product.tagline}</p>
      </div>
    </div>
  );
}
