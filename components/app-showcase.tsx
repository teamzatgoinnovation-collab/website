"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Monitor, Smartphone, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { AppleIPhoneFrame, BrowserFrame, ScreenshotSlot } from "@/components/devices";
import { cn } from "@/lib/cn";

export type ShowcaseProduct = {
  slug: string;
  name: string;
  tagline: string;
  desktop: string[];
  mobile: string[];
};

export type ShowcaseLabels = {
  desktop: string;
  mobile: string;
  fullscreen: string;
  close: string;
  prev: string;
  next: string;
};

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  alt,
  labels,
}: {
  items: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  alt: string;
  labels: ShowcaseLabels;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = useCallback(
    (d: number) => onIndex((index + d + items.length) % items.length),
    [index, items.length, onIndex],
  );

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        aria-label={labels.close}
        onClick={onClose}
        className="absolute end-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      {items.length > 1 ? (
        <>
          <button
            type="button"
            aria-label={labels.prev}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute start-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute end-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6 rtl:rotate-180" />
          </button>
        </>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={items[index]}
        alt={`${alt} ${index + 1}/${items.length}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
      />
    </div>
  );
}

export function AppShowcase({
  products,
  labels,
}: {
  products: ShowcaseProduct[];
  labels: ShowcaseLabels;
}) {
  const uid = useId();
  const [slug, setSlug] = useState(products[0]?.slug);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [shot, setShot] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const product = products.find((p) => p.slug === slug) ?? products[0];
  if (!product) return null;
  const items = product[device];
  const safeShot = Math.min(shot, Math.max(items.length - 1, 0));
  const current = items[safeShot];
  const alt = `${product.name} ${device}`;

  const pick = (s: string) => {
    setSlug(s);
    setShot(0);
  };

  return (
    <div>
      <div role="tablist" aria-label="Products" className="mb-6 flex flex-wrap gap-2">
        {products.map((p) => (
          <button
            key={p.slug}
            role="tab"
            id={`${uid}-${p.slug}`}
            aria-selected={p.slug === product.slug}
            onClick={() => pick(p.slug)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              p.slug === product.slug
                ? "border-transparent bg-[var(--m-accent)] text-[var(--m-accent-foreground)]"
                : "border-m-line text-m-muted hover:text-[var(--m-ink)]",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div
        className="rounded-3xl border border-m-line bg-[var(--m-surface)] p-5 sm:p-8"
        role="tabpanel"
        aria-labelledby={`${uid}-${product.slug}`}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-m-muted">{product.tagline}</p>
          <div className="inline-flex rounded-full border border-m-line p-0.5" role="group">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={device === d}
                onClick={() => {
                  setDevice(d);
                  setShot(0);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  device === d
                    ? "bg-[var(--m-ink)] text-[var(--color-background)]"
                    : "text-m-muted",
                )}
              >
                {d === "desktop" ? (
                  <Monitor className="h-3.5 w-3.5" />
                ) : (
                  <Smartphone className="h-3.5 w-3.5" />
                )}
                {labels[d]}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${product.slug}-${device}-${safeShot}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative flex justify-center"
          >
            {device === "desktop" ? (
              <BrowserFrame url="zatgoinnovation.com" className="max-w-3xl">
                <ScreenshotSlot src={current} alt={alt} label={product.name} />
              </BrowserFrame>
            ) : (
              <AppleIPhoneFrame>
                <ScreenshotSlot src={current} alt={alt} label={product.name} />
              </AppleIPhoneFrame>
            )}
            {current ? (
              <button
                type="button"
                aria-label={labels.fullscreen}
                onClick={() => setLightbox(true)}
                className="absolute bottom-3 end-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {items.length > 1 ? (
          <div className="mt-5 flex justify-center gap-2" role="group" aria-label="Screenshots">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}`}
                aria-current={i === safeShot}
                onClick={() => setShot(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === safeShot ? "w-6 bg-[var(--m-accent)]" : "w-2 bg-m-line",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {lightbox && items.length ? (
        <Lightbox
          items={items}
          index={safeShot}
          onIndex={setShot}
          onClose={() => setLightbox(false)}
          alt={alt}
          labels={labels}
        />
      ) : null}
    </div>
  );
}
