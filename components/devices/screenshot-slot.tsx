import { cn } from "@/lib/cn";

export type ScreenshotSlotProps = {
  /** A screenshot uploaded in the admin. There is deliberately no placeholder: callers render no device when there is none. */
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/** Fills its parent with a real, admin-uploaded screenshot. */
export function ScreenshotSlot({ src, alt, className, priority }: ScreenshotSlotProps) {
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
