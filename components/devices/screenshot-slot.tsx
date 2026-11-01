import { ImageOff } from "lucide-react";

import { cn } from "@/lib/cn";

export type ScreenshotSlotProps = {
  /** Real application screenshot. When absent a clearly labelled placeholder renders. */
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  priority?: boolean;
};

/** Fills its parent. Never fakes product UI: no `src` means an explicit placeholder. */
export function ScreenshotSlot({ src, alt, label, className, priority }: ScreenshotSlotProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover object-top", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (screenshot coming soon)`}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-[var(--m-surface)] p-4 text-center",
        className,
      )}
    >
      <ImageOff className="h-6 w-6 text-m-muted" aria-hidden />
      <span className="text-xs font-semibold text-[var(--m-ink)]">{label ?? alt}</span>
      <span className="rounded-full border border-dashed border-m-line px-2 py-0.5 text-[0.55rem] uppercase tracking-wider text-m-muted sm:text-[0.65rem]">
        Screenshot coming soon
      </span>
    </div>
  );
}
