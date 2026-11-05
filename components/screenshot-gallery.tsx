"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { OppoPhoneFrame, ApplicationLightbox, BrowserFrame, ScreenshotSlot, TabletFrame, type LightboxLabels } from "@/components/devices";
import type { Device, GalleryItem } from "@/lib/gallery-merge";
import { cn } from "@/lib/cn";

export type GalleryLabels = LightboxLabels & { desktop: string; mobile: string; tablet: string; of: string };
type Props = { name: string; items: GalleryItem[]; labels: GalleryLabels };

const DEVICE_ICON = { DESKTOP: Monitor, MOBILE: Smartphone, TABLET: Tablet } as const;
const ORDER: Device[] = ["DESKTOP", "MOBILE", "TABLET"];

/** Real screenshots (admin uploads or folder files) in device frames. With none, labelled illustrations are shown. */
export function ScreenshotGallery({ name, items, labels }: Props) {
  const reduce = useReducedMotion();
  const devices = useMemo(() => ORDER.filter((d) => items.some((i) => i.device === d)), [items]);
  const [device, setDevice] = useState<Device | null>(devices[0] ?? null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const strip = useRef<HTMLUListElement>(null);

  const active = device && devices.includes(device) ? device : (devices[0] ?? null);
  const list = useMemo(() => (active ? items.filter((i) => i.device === active) : []), [items, active]);
  const safe = Math.min(index, Math.max(list.length - 1, 0));
  const current = list[safe];

  useEffect(() => {
    strip.current?.children[safe]?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
  }, [safe, reduce, active]);

  const go = (d: number) => list.length && setIndex((safe + d + list.length) % list.length);
  const label = (d: Device) => (d === "DESKTOP" ? labels.desktop : d === "MOBILE" ? labels.mobile : labels.tablet);
  const alt = current?.alt || `${name} ${active?.toLowerCase() ?? ""} ${safe + 1}`;

  // Nothing uploaded in the admin: render nothing (the caller also omits the section heading).
  if (!current) return null;

  const img = <ScreenshotSlot src={current.src} alt={alt} />;

  return (
    <div>
      {devices.length > 1 ? (
        <div role="tablist" aria-label="Device" className="mb-4 inline-flex rounded-full border border-m-line p-0.5">
          {devices.map((d) => {
            const Icon = DEVICE_ICON[d];
            return (
              <button key={d} role="tab" aria-selected={d === active} onClick={() => { setDevice(d); setIndex(0); }} className={cn("inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold", d === active ? "bg-[var(--m-ink)] text-[var(--color-background)]" : "text-m-muted")}>
                <Icon className="h-3.5 w-3.5" aria-hidden />{label(d)}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${name} screenshots`}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
        className="relative rounded-3xl border border-m-line bg-gradient-to-b from-[var(--m-surface)] to-[var(--m-surface-elevated)] p-5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-accent)] sm:p-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${current.src}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28 }}
            drag={list.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) go(info.offset.x < 0 ? 1 : -1); }}
            className="flex justify-center"
          >
            {active === "MOBILE" ? (
              <div className="w-56 sm:w-64"><OppoPhoneFrame>{img}</OppoPhoneFrame></div>
            ) : active === "TABLET" ? (
              <TabletFrame className="max-w-xl">{img}</TabletFrame>
            ) : (
              <BrowserFrame url="zatgoinnovation.com" className="max-w-3xl">{img}</BrowserFrame>
            )}
          </motion.div>
        </AnimatePresence>

        {list.length > 1 ? (
          <>
            <button type="button" aria-label={labels.prev} onClick={() => go(-1)} className="absolute start-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--m-ink)] shadow-lg ring-1 ring-black/5 hover:bg-white dark:bg-[var(--m-surface-elevated)]"><ChevronLeft className="h-5 w-5 rtl:rotate-180" /></button>
            <button type="button" aria-label={labels.next} onClick={() => go(1)} className="absolute end-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--m-ink)] shadow-lg ring-1 ring-black/5 hover:bg-white dark:bg-[var(--m-surface-elevated)]"><ChevronRight className="h-5 w-5 rtl:rotate-180" /></button>
          </>
        ) : null}
        <button type="button" aria-label={labels.fullscreen} onClick={() => setOpen(true)} className="absolute bottom-4 end-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"><Maximize2 className="h-4 w-4" /></button>
        <p className="mt-4 text-center text-xs text-m-muted" aria-live="polite">
          {current.caption ? <span className="font-medium text-[var(--m-ink)]">{current.caption} · </span> : null}
          {safe + 1} {labels.of} {list.length}
        </p>
      </div>

      {list.length > 1 ? (
        <ul ref={strip} aria-label="Screenshots" className="mt-4 flex snap-x gap-2 overflow-x-auto pb-2">
          {list.map((it, n) => (
            <li key={it.src} className="snap-center">
              <button type="button" aria-label={`${n + 1}`} aria-current={n === safe} onClick={() => setIndex(n)} className={cn("block h-16 w-24 overflow-hidden rounded-lg border-2 bg-[var(--m-surface)] transition-opacity", n === safe ? "border-[var(--m-accent)]" : "border-m-line opacity-70 hover:opacity-100")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <ApplicationLightbox items={list.map((i) => i.src)} captions={list.map((i) => i.caption)} index={safe} onIndex={setIndex} onClose={() => setOpen(false)} alt={`${name} ${active ?? ""}`} labels={labels} ofLabel={labels.of} />
      ) : null}
    </div>
  );
}
