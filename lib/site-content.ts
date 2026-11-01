import { getLocale, getTranslations } from "next-intl/server";

import { CATALOG_TAG } from "@/lib/catalog";

/**
 * Text and images the admin has customised for a public page. Built-in copy (messages/*.json) is the default; an override
 * wins only when the admin set one. If the API cannot be reached the page renders with its built-in copy.
 */
export type SiteContent = { texts: Record<string, string>; images: Record<string, string> };

const EMPTY: SiteContent = { texts: {}, images: {} };
const IMAGE_PATH = /^\/api\/v1\/media\/[0-9a-f-]{36}\/file$/i;

export async function getSiteContent(page: string, locale?: string): Promise<SiteContent> {
  const server = (process.env.CATALOG_API_URL || process.env.LEADS_API_URL || "").trim().replace(/\/$/, "");
  const publicBase = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (!server || !publicBase) return EMPTY;
  const l = locale ?? (await getLocale());
  try {
    const res = await fetch(`${server}/content/${encodeURIComponent(page)}?locale=${encodeURIComponent(l)}`, {
      next: { revalidate: 60, tags: [CATALOG_TAG] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return EMPTY;
    const body = (await res.json()) as { texts?: Record<string, unknown>; images?: Record<string, unknown> };
    const texts: Record<string, string> = {};
    for (const [k, v] of Object.entries(body.texts ?? {})) if (typeof v === "string" && v) texts[k] = v;
    const images: Record<string, string> = {};
    for (const [k, v] of Object.entries(body.images ?? {})) if (typeof v === "string" && IMAGE_PATH.test(v)) images[k] = `${publicBase}${v}`;
    return { texts, images };
  } catch {
    return EMPTY;
  }
}

export type SiteT = (key: string) => string;

/** Like getTranslations(namespace), but an admin override for `<namespace>.<key>` wins over the built-in text. */
export async function getSiteT(page: string, namespace: string): Promise<{ t: SiteT; images: Record<string, string>; texts: Record<string, string> }> {
  const locale = await getLocale();
  const [base, content] = await Promise.all([getTranslations({ locale, namespace }), getSiteContent(page, locale)]);
  const t: SiteT = (key) => content.texts[`${namespace}.${key}`] ?? (base as unknown as (k: string) => string)(key);
  return { t, images: content.images, texts: content.texts };
}
