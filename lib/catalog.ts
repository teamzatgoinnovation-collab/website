import { getLocale } from "next-intl/server";

import { adaptProduct, type ApiProduct } from "./catalog-adapt";
import type { CatalogProduct } from "./catalog-types";
import { splitByDevice, type GalleryItem } from "./gallery-merge";

/**
 * The product catalog comes ONLY from website-api (edited in /admin). There is no built-in fallback copy or imagery.
 *
 * - Cached for 60 s (Next data cache, stale-while-revalidate): an admin edit shows up within about a minute and a short
 *   API outage keeps serving the last good data.
 * - Failures THROW instead of returning an empty list, so a page that was generated with good data is never replaced by an
 *   empty one (ISR keeps the previous page when regeneration fails).
 *
 * Server URL: CATALOG_API_URL (build machine / explicit) or LEADS_API_URL (internal address at runtime).
 * Image URLs are built from NEXT_PUBLIC_API_URL, the public origin the browser can reach.
 */
const REVALIDATE_S = 60;

export class CatalogUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("The product catalog is temporarily unavailable");
    this.cause = cause;
  }
}

/** Cache tag on every catalog fetch; the revalidate route drops it when the admin changes the catalog. */
export const CATALOG_TAG = "catalog";

function endpoints() {
  const server = (process.env.CATALOG_API_URL || process.env.LEADS_API_URL || "").trim().replace(/\/$/, "");
  const publicBase = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (!server || !publicBase) throw new CatalogUnavailableError("CATALOG_API_URL/LEADS_API_URL and NEXT_PUBLIC_API_URL must be set");
  return { server, publicBase };
}

async function request<T>(path: string): Promise<T | null> {
  const { server } = endpoints();
  // The build prerenders hundreds of pages in parallel and can trip the API's rate limit; back off and retry there only.
  const attempts = process.env.NEXT_PHASE === "phase-production-build" ? 8 : 1;
  let res: Response | undefined;
  for (let i = 0; i < attempts; i++) {
    try {
      res = await fetch(`${server}${path}`, { next: { revalidate: REVALIDATE_S, tags: [CATALOG_TAG] }, signal: AbortSignal.timeout(8000) });
    } catch (e) {
      if (i === attempts - 1) throw new CatalogUnavailableError(e);
      res = undefined;
    }
    if (res && res.status !== 429 && res.status < 500) break;
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 4000 * (i + 1) + Math.random() * 2000));
  }
  if (!res) throw new CatalogUnavailableError("no response");
  if (res.status === 404) return null;
  if (!res.ok) throw new CatalogUnavailableError(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function resolveLocale(locale?: string) {
  return locale ?? (await getLocale());
}

/** All published products in the admin's order, in the given (or current request) locale. */
export async function getCatalog(locale?: string): Promise<CatalogProduct[]> {
  const l = await resolveLocale(locale);
  const body = await request<{ items: ApiProduct[] }>(`/products?pageSize=100&locale=${encodeURIComponent(l)}`);
  const { publicBase } = endpoints();
  return (body?.items ?? []).map((p) => adaptProduct(p, publicBase));
}

/** Slugs of the published products: static content tied to a product is hidden when the product is disabled. */
export async function getActiveSlugs(locale?: string): Promise<Set<string>> {
  return new Set((await getCatalog(locale)).map((p) => p.slug));
}

/** One published product, or undefined when it does not exist (the page should 404). */
export async function getCatalogProduct(slug: string, locale?: string): Promise<CatalogProduct | undefined> {
  const l = await resolveLocale(locale);
  const body = await request<ApiProduct>(`/products/${encodeURIComponent(slug)}?locale=${encodeURIComponent(l)}`);
  if (!body) return undefined;
  return adaptProduct(body, endpoints().publicBase);
}

/**
 * For navigation chrome only (header menu, footer, sitemap): a short API outage should hide product links, not break
 * every page. Main content must use getCatalog(), which throws so ISR keeps the last good page.
 */
export async function getCatalogSafe(locale?: string): Promise<CatalogProduct[]> {
  try {
    return await getCatalog(locale);
  } catch {
    return [];
  }
}

/** Featured products first (admin order), as the home page shows them. */
export async function getFeaturedProducts(locale?: string): Promise<CatalogProduct[]> {
  return (await getCatalog(locale)).filter((p) => p.highlight);
}

/** Screenshots of one device kind, ready for the showcase components. */
export function screenshotsOf(p: CatalogProduct, device: "mobile" | "desktop" | "tablet"): string[] {
  return splitByDevice(p.gallery)[device];
}

/** What kind of device art a product can honestly show: only what the admin uploaded. */
export type DeviceLayout = "laptop" | "phones" | "none";
export function layoutOf(p: CatalogProduct): DeviceLayout {
  const s = splitByDevice(p.gallery);
  if (s.desktop.length || s.tablet.length) return "laptop";
  if (s.mobile.length) return "phones";
  return "none";
}

export type { GalleryItem };
