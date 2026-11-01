"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Cloud, HardDrive, Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AppleIPhoneFrame, MacBookFrame, ScreenshotSlot } from "@/components/devices";
import { ProductMark } from "@/components/product-mark";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type HeroSlide = {
  slug: string;
  name: string;
  tagline: string;
  /** First desktop screenshot uploaded in the admin, if any. */
  desktop?: string;
  /** Mobile screenshots uploaded in the admin (possibly none). */
  mobile: string[];
  accent: string | null;
  logoUrl: string | null;
};

/** Decorative tiles around the devices. Generic icons (not partner brand marks): these integrations are planned. */
const TILES: { Icon: LucideIcon; className: string; tone: string; delay: number }[] = [
  { Icon: Mail, className: "absolute start-[2%] top-[8%]", tone: "text-rose-500", delay: 0 },
  { Icon: MessageCircle, className: "absolute start-[-4%] top-[34%]", tone: "text-emerald-500", delay: 0.6 },
  { Icon: MapPin, className: "absolute start-[4%] top-[60%]", tone: "text-blue-500", delay: 1.2 },
  { Icon: HardDrive, className: "absolute end-[-2%] top-[6%]", tone: "text-amber-500", delay: 0.9 },
  { Icon: Cloud, className: "absolute end-[-3%] top-[62%]", tone: "text-sky-500", delay: 0.3 },
];

function FloatTile({ Icon, className, tone, delay }: (typeof TILES)[number]) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_12px_30px_-10px_rgba(16,24,40,0.35)]", className)}
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Icon className={cn("h-7 w-7", tone)} />
    </motion.span>
  );
}

/** Real screenshots only. With none, the product's own mark is shown instead of any device. */
function Devices({ slide, first }: { slide: HeroSlide; first: boolean }) {
  if (slide.desktop) {
    return (
      <div className="relative mx-auto w-full max-w-[34rem]">
        <div className="-rotate-2">
          <MacBookFrame><ScreenshotSlot src={slide.desktop} alt={`${slide.name} desktop`} priority={first} /></MacBookFrame>
        </div>
        {slide.mobile[0] ? (
          <div className="absolute -bottom-6 end-[-2%] w-[26%] min-w-[5.5rem] rotate-[6deg]">
            <AppleIPhoneFrame><ScreenshotSlot src={slide.mobile[0]} alt={`${slide.name} mobile`} /></AppleIPhoneFrame>
          </div>
        ) : null}
      </div>
    );
  }
  if (slide.mobile.length) {
    const [a, b] = slide.mobile;
    return (
      <div className="relative mx-auto h-[26rem] w-full max-w-[30rem] sm:h-[31rem]">
        <div className={b ? "absolute start-[2%] top-[10%] w-[44%] rotate-[-9deg]" : "absolute start-1/2 top-[4%] w-[48%] -translate-x-1/2 rotate-[-4deg]"}>
          <AppleIPhoneFrame><ScreenshotSlot src={a} alt={`${slide.name} mobile`} priority={first} /></AppleIPhoneFrame>
        </div>
        {b ? (
          <div className="absolute end-[4%] top-0 w-[48%] rotate-[7deg]">
            <AppleIPhoneFrame><ScreenshotSlot src={b} alt={`${slide.name} mobile`} /></AppleIPhoneFrame>
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <div className="relative mx-auto flex h-[22rem] w-full max-w-[30rem] items-center justify-center sm:h-[28rem]">
      <span aria-hidden className="absolute h-72 w-72 rounded-full border border-white/50 sm:h-96 sm:w-96" />
      <span aria-hidden className="absolute h-52 w-52 rounded-full border border-white/70 bg-white/20 backdrop-blur-sm sm:h-72 sm:w-72" />
      <ProductMark name={slide.name} accent={slide.accent} logoUrl={slide.logoUrl} className="relative h-32 w-32 text-4xl shadow-[0_24px_50px_-18px_rgba(16,24,40,0.55)] sm:h-40 sm:w-40 sm:text-5xl" />
    </div>
  );
}

/** Fine pointers (mouse/trackpad) only: touch devices and reduced-motion users get no parallax. */
function useParallaxEnabled() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine && !reduce;
}

const SLIDE_MS = 7000;

export function HeroCarousel({ slides, learnMore, slideLabel, prevLabel, nextLabel }: { slides: HeroSlide[]; learnMore: string; slideLabel: string; prevLabel: string; nextLabel: string }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const parallax = useParallaxEnabled();
  const stageRef = useRef<HTMLDivElement>(null);

  // pointer position inside the stage, -0.5..0.5, smoothed
  const px = useSpring(useMotionValue(0), { stiffness: 70, damping: 18, mass: 0.6 });
  const py = useSpring(useMotionValue(0), { stiffness: 70, damping: 18, mass: 0.6 });
  const devX = useTransform(px, (v) => v * 22);
  const devY = useTransform(py, (v) => v * 14);
  const tileX = useTransform(px, (v) => v * -34);
  const tileY = useTransform(py, (v) => v * -22);
  const ringX = useTransform(px, (v) => v * -10);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!parallax || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }, [parallax, px, py]);
  const onLeave = useCallback(() => { px.set(0); py.set(0); setHold(false); }, [px, py]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const slide = slides[i];
  // No published products yet: show the brand composition only (orbit, tiles, ZatGo mark).
  if (!slide) {
    return (
      <div className="relative mx-auto flex min-h-[22rem] w-full max-w-[30rem] items-center justify-center sm:min-h-[28rem]">
        <span aria-hidden className="absolute h-72 w-72 rounded-full border border-white/50 sm:h-96 sm:w-96" />
        <span aria-hidden className="absolute h-52 w-52 rounded-full border border-white/70 bg-white/20 backdrop-blur-sm sm:h-72 sm:w-72" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/branding/zg-mark.svg" alt="" className="relative h-20 w-auto drop-shadow-lg sm:h-24" />
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">{TILES.map((t) => <FloatTile key={t.delay} {...t} />)}</div>
      </div>
    );
  }
  const go = (d: number) => setI((n) => (n + d + slides.length) % slides.length);
  const autoplay = !reduce && slides.length > 1;

  return (
    <div className="relative" onPointerMove={onMove} onPointerEnter={() => setHold(true)} onPointerLeave={onLeave} onFocus={() => setHold(true)} onBlur={() => setHold(false)} aria-roledescription="carousel">
      <div ref={stageRef} className="relative min-h-[26rem] sm:min-h-[31rem]">
        {/* orbit ring behind the devices */}
        <motion.svg aria-hidden viewBox="0 0 600 420" style={parallax ? { x: ringX } : undefined} className="pointer-events-none absolute inset-x-[-8%] top-[12%] h-[78%] w-[116%] opacity-90">
          <defs>
            <linearGradient id="orbit" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <ellipse cx="300" cy="210" rx="285" ry="120" fill="none" stroke="url(#orbit)" strokeWidth="2.5" transform="rotate(-14 300 210)" />
          <ellipse cx="300" cy="210" rx="250" ry="96" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 9" transform="rotate(-14 300 210)" className="zg-flow" />
        </motion.svg>
        <motion.div aria-hidden style={parallax ? { x: tileX, y: tileY } : undefined} className="pointer-events-none absolute inset-0 z-20 hidden sm:block">
          {TILES.map((t) => <FloatTile key={t.delay} {...t} />)}
        </motion.div>
        <motion.div style={parallax ? { x: devX, y: devY } : undefined} className="relative z-10 pt-4">
          <AnimatePresence mode="wait">
            <motion.div key={slide.slug} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }} aria-live={hold ? "polite" : "off"}>
              <Devices slide={slide} first={i === 0} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative z-20 mt-8 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-2 py-1.5 shadow-lg backdrop-blur dark:bg-[var(--m-surface-elevated)]/90" role="group" aria-label={slideLabel}>
          <button type="button" aria-label={prevLabel} onClick={() => go(-1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--m-accent)] ring-1 ring-[var(--m-accent)]/30 hover:bg-[var(--m-accent)] hover:text-white"><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
          {slides.map((s, n) => (
            <button key={s.slug} type="button" aria-label={`${slideLabel} ${n + 1}: ${s.name}`} aria-current={n === i} onClick={() => setI(n)} className={cn("relative h-2 overflow-hidden rounded-full transition-all", n === i ? "w-9 bg-[#C9D5F2]" : "w-2 bg-[#B7C3DD] hover:bg-[#8FA0C4]")}>
              {n === i ? (
                <span
                  key={`${slide.slug}-${hold || hidden}`}
                  className="absolute inset-0 origin-left rounded-full bg-[var(--m-accent)] rtl:origin-right"
                  style={autoplay ? { animation: `dot-progress ${SLIDE_MS}ms linear forwards`, animationPlayState: hold || hidden ? "paused" : "running" } : undefined}
                  onAnimationEnd={() => go(1)}
                />
              ) : null}
            </button>
          ))}
          <button type="button" aria-label={nextLabel} onClick={() => go(1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--m-accent)] ring-1 ring-[var(--m-accent)]/30 hover:bg-[var(--m-accent)] hover:text-white"><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
        </div>
        <p className="max-w-full rounded-full bg-white/90 px-4 py-1.5 text-center text-sm font-semibold text-[var(--m-ink)] shadow backdrop-blur dark:bg-[var(--m-surface-elevated)]/90">
          {slide.name} <span className="font-normal text-[color-mix(in_oklch,var(--m-ink)_65%,transparent)]">· {slide.tagline}</span>{" "}
          <Link href={`/products/${slide.slug}` as "/products"} className="m-link ms-1 whitespace-nowrap">{learnMore}</Link>
        </p>
      </div>
    </div>
  );
}
