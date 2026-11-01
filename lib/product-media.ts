import { readdirSync } from "node:fs";
import path from "node:path";

export type ProductMedia = { desktop: string[]; mobile: string[] };

const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;

/**
 * Real screenshots live in public/images/products/<slug>/ and are named
 * `desktop-*.ext` / `mobile-*.ext`. Nothing is invented: an empty folder yields empty arrays,
 * and the UI then shows an explicit "screenshot coming soon" placeholder.
 */
export function getProductMedia(slug: string): ProductMedia {
  const dir = path.join(process.cwd(), "public", "images", "products", slug);
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => IMAGE_EXT.test(f)).sort();
  } catch {
    return { desktop: [], mobile: [] };
  }
  const url = (f: string) => `/images/products/${slug}/${f}`;
  return {
    desktop: files.filter((f) => f.startsWith("desktop")).map(url),
    mobile: files.filter((f) => f.startsWith("mobile")).map(url),
  };
}
