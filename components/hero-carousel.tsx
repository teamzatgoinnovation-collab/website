"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AppleIPhoneFrame, MacBookFrame, ScreenshotSlot } from "@/components/devices";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type HeroSlide = {
  slug: string;
  name: string;
  tagline: string;
  desktop?: string;
  mobile?: string;
};

export function HeroCarousel({ slides, learnMore, slideLabel }: { slides: HeroSlide[]; learnMore: string; slideLabel: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [24, -48]);

  useEffect(() => {
    if (paused || reduce || slides.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [paused, reduce, slides.length]);

  const slide = slides[i];
  if (!slide) return null;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative mx-auto min-h-[19rem] sm:min-h-[24rem]" aria-live={paused ? "polite" : "off"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <MacBookFrame className="mx-auto max-w-[34rem]">
              <ScreenshotSlot src={slide.desktop} alt={`${slide.name} desktop`} label={slide.name} priority={i === 0} />
            </MacBookFrame>
            <motion.div style={reduce ? undefined : { y: parallaxY }} className="absolute -bottom-6 end-0 w-[26%] min-w-[5.5rem] sm:end-2">
              <motion.div animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                <AppleIPhoneFrame>
                  <ScreenshotSlot src={slide.mobile} alt={`${slide.name} mobile`} label={slide.name} />
                </AppleIPhoneFrame>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold">{slide.name}</p>
          <p className="text-sm text-m-muted">{slide.tagline}</p>
          <Link href={`/products/${slide.slug}` as "/products"} className="m-link mt-1 inline-block text-sm">{learnMore}</Link>
        </div>
        <div className="flex gap-2" role="group" aria-label={slideLabel}>
          {slides.map((s, n) => (
            <button
              key={s.slug}
              type="button"
              aria-label={`${slideLabel} ${n + 1}: ${s.name}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className={cn("h-2 rounded-full transition-all", n === i ? "w-7 bg-[var(--m-accent)]" : "w-2 bg-m-line hover:bg-m-muted")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
