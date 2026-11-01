"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

export type LightboxLabels = { fullscreen: string; close: string; prev: string; next: string };

export function ApplicationLightbox({
  items,
  index,
  onIndex,
  onClose,
  alt,
  labels,
  captions,
  ofLabel = "of",
}: {
  items: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  alt: string;
  labels: LightboxLabels;
  captions?: (string | undefined)[];
  ofLabel?: string;
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
        className="max-h-[84vh] max-w-[92vw] rounded-lg object-contain"
      />
      <p className="pointer-events-none absolute bottom-4 start-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white">
        {captions?.[index] ? `${captions[index]} · ` : ""}{index + 1} {ofLabel} {items.length}
      </p>
    </div>
  );
}
