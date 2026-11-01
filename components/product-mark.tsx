import { cn } from "@/lib/cn";

/** Initials of a product name: "ZatGo VanSale" -> "VS", "MyBis" -> "MB", "PrayerTimer" -> "PT". */
export function initialsOf(name: string): string {
  const words = name.replace(/^zatgo\s+/i, "").trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const w = words[0] ?? name;
  const caps = w.match(/[A-Z]/g);
  return (caps && caps.length > 1 ? caps.slice(0, 2).join("") : w.slice(0, 2)).toUpperCase();
}

/**
 * The product's logo uploaded in the admin, or its initials on its brand colour. No stock imagery.
 * The accent colour is validated upstream (#RRGGBB) before it reaches a style attribute.
 */
export function ProductMark({ name, accent, logoUrl, className }: { name: string; accent?: string | null; logoUrl?: string | null; className?: string }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt="" loading="lazy" decoding="async" className={cn("rounded-xl bg-white object-contain p-1 shadow-sm", className)} />
    );
  }
  return (
    <span aria-hidden className={cn("inline-flex items-center justify-center rounded-xl font-display font-bold text-white shadow-md", className)} style={{ background: accent ?? "var(--m-accent)" }}>
      {initialsOf(name)}
    </span>
  );
}
