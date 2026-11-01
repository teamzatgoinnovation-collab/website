"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Monitor, Smartphone } from "lucide-react";
import { useId, useState } from "react";

import { ApplicationLightbox, AppleIPhoneFrame, BrowserFrame, ScreenshotSlot } from "@/components/devices";
import type { LightboxLabels } from "@/components/devices/application-lightbox";
import { cn } from "@/lib/cn";

export type ShowcaseProduct = {
  slug: string;
  name: string;
  tagline: string;
  desktop: string[];
  mobile: string[];
};

export type ShowcaseLabels = LightboxLabels & { desktop: string; mobile: string };

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
        <ApplicationLightbox
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
