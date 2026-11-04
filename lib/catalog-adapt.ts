import type { CatalogProduct, Channel, ProductDownload } from "./catalog-types.ts";
import { fromApi } from "./gallery-merge.ts";

export type ApiProduct = {
  id: string; slug: string; name: string; tagline: string; summary: string; description: string;
  availability: string; isFeatured: boolean; sortOrder: number; channels: string[]; accent: string | null; logoUrl: string | null;
  docsUrl: string | null; supportUrl: string | null; pricingNote: string | null;
  features: { id: string; title: string; body: string | null }[];
  modules: { name: string; summary: string }[]; faq: { question: string; answer: string }[];
  platforms: { platform: string; storeUrl: string | null }[];
  screenshots: unknown;
  downloads?: { id: string; platform: string; architecture: string; version: string; fileName: string; sizeBytes: number; sha256: string | null; url: string }[];
};

const DOWNLOAD_PLATFORMS = new Set<string>(["ANDROID", "WINDOWS", "MACOS", "LINUX"]);
const DOWNLOAD_URL = /^\/api\/v1\/downloads\/[0-9a-f-]{36}\/file$/;

/** Only well-formed entries whose URL is the API's own download route survive; the URL is made absolute here. */
function adaptDownloads(list: ApiProduct["downloads"], publicBase: string): ProductDownload[] {
  return (Array.isArray(list) ? list : []).flatMap((d) =>
    d && DOWNLOAD_PLATFORMS.has(d.platform) && typeof d.url === "string" && DOWNLOAD_URL.test(d.url) && typeof d.fileName === "string" && typeof d.version === "string"
      ? [{ id: d.id, platform: d.platform as ProductDownload["platform"], architecture: d.architecture, version: d.version, fileName: d.fileName, sizeBytes: Number(d.sizeBytes) || 0, sha256: typeof d.sha256 === "string" && /^[0-9a-f]{64}$/.test(d.sha256) ? d.sha256 : null, url: `${publicBase}${d.url}` }]
      : [],
  );
}

const CHANNELS = new Set<string>(["mobile", "desktop", "web"]);

export function adaptProduct(p: ApiProduct, publicBase: string): CatalogProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    summary: p.summary,
    description: p.description,
    status: p.availability === "AVAILABLE" ? "available" : "coming-soon",
    highlight: p.isFeatured,
    sortOrder: p.sortOrder,
    channels: (p.channels ?? []).filter((c): c is Channel => CHANNELS.has(c)),
    accent: p.accent && /^#[0-9a-fA-F]{6}$/.test(p.accent) ? p.accent : null,
    logoUrl: p.logoUrl && /^\/api\/v1\/media\/[0-9a-f-]{36}\/file$/.test(p.logoUrl) ? `${publicBase}${p.logoUrl}` : null,
    capabilities: (p.features ?? []).map((f) => f.title),
    features: p.features ?? [],
    modules: p.modules ?? [],
    faq: p.faq ?? [],
    platforms: p.platforms ?? [],
    docsUrl: p.docsUrl,
    supportUrl: p.supportUrl,
    pricingNote: p.pricingNote,
    gallery: fromApi(p.screenshots, publicBase),
    downloads: adaptDownloads(p.downloads, publicBase),
  };
}

/**
 * Static content (downloads, docs links, tutorials, changelog, case studies) that is tied to products stays visible only while at
 * least one of those products is published. Content tied to no product is platform-wide and always stays.
 */
export function relatesToActive(slugs: readonly string[] | undefined, active: ReadonlySet<string>): boolean {
  return !slugs || slugs.length === 0 || slugs.some((s) => active.has(s));
}
