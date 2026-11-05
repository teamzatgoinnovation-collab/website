"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { needsContain } from "@/lib/device-ratio";
import { PhoneScreenContext } from "./phone-screen-context";

export type ScreenshotSlotProps = {
  /** A screenshot uploaded in the admin. There is deliberately no placeholder: callers render no device when there is none. */
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Fills its parent with a real, admin-uploaded screenshot. Inside a phone it reports its own shape so the screen matches it;
 * if the shape is outside what a phone can show, the whole image is kept visible instead of being cropped.
 */
export function ScreenshotSlot({ src, alt, className, priority }: ScreenshotSlotProps) {
  const phone = useContext(PhoneScreenContext);
  const ref = useRef<HTMLImageElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  const measure = useCallback(() => {
    const img = ref.current;
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const r = img.naturalWidth / img.naturalHeight;
    setRatio(r);
    phone?.report(r);
  }, [phone]);

  useEffect(() => { measure(); }, [src, measure]); // already-cached images never fire onLoad again

  const contain = phone !== null && ratio !== null && needsContain(phone.screenRatio, ratio);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={measure}
      className={cn("h-full w-full", contain ? "object-contain" : "object-cover object-top", className)}
    />
  );
}
