"use client";

import { Maximize2 } from "lucide-react";
import { useState } from "react";

import { ApplicationLightbox, ProductDesktopPreview, ProductMobilePreview, type LightboxLabels } from "@/components/devices";
import { cn } from "@/lib/cn";

type Props = { name: string; desktop: string[]; mobile: string[]; labels: LightboxLabels };

/** Real screenshots in device frames with thumbnails and a fullscreen lightbox. Placeholder when none exist. */
export function ScreenshotGallery({ name, desktop, mobile, labels }: Props) {
  const all = [...desktop, ...mobile];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const current = all[index];
  const isMobile = index >= desktop.length;
  const show = (i: number) => setIndex(i);

  return (
    <div>
      <div className="relative flex justify-center rounded-3xl border border-m-line bg-[var(--m-surface)] p-5 sm:p-8">
        {all.length === 0 || !isMobile ? (
          <ProductDesktopPreview src={all.length ? current : undefined} name={name} className="max-w-3xl" />
        ) : (
          <ProductMobilePreview src={current} name={name} />
        )}
        {all.length === 0 ? (
          <div className="absolute bottom-6 end-6 hidden w-24 sm:block">
            <ProductMobilePreview name={name} />
          </div>
        ) : (
          <button type="button" aria-label={labels.fullscreen} onClick={() => setOpen(true)} className="absolute bottom-4 end-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80">
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {all.length > 1 ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Screenshots">
          {all.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`${i + 1}`}
                aria-current={i === index}
                onClick={() => show(i)}
                className={cn("h-14 w-20 overflow-hidden rounded-lg border-2 bg-[var(--m-surface)]", i === index ? "border-[var(--m-accent)]" : "border-m-line")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && all.length ? (
        <ApplicationLightbox items={all} index={index} onIndex={show} onClose={() => setOpen(false)} alt={name} labels={labels} />
      ) : null}
    </div>
  );
}
