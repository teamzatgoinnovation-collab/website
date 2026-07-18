import { getTranslations } from "next-intl/server";

import {
  getHighlightedProductMetas,
  getProductMeta,
  products,
  type LocalizedProduct,
  type ProductMeta,
} from "@/content/products";
import type { ProductFaq, ProductModule } from "@/content/product-extras";

type ProductTranslator = Awaited<ReturnType<typeof getTranslations<"products">>>;

export type LocalizedProductDetail = LocalizedProduct & {
  modules: ProductModule[];
  faq: ProductFaq[];
};

function localizeMeta(
  meta: ProductMeta,
  t: ProductTranslator,
): LocalizedProduct {
  return {
    ...meta,
    name: t(`${meta.slug}.name`),
    tagline: t(`${meta.slug}.tagline`),
    description: t(`${meta.slug}.description`),
    capabilities: t.raw(`${meta.slug}.capabilities`) as string[],
  };
}

function localizeDetail(
  meta: ProductMeta,
  t: ProductTranslator,
): LocalizedProductDetail {
  const base = localizeMeta(meta, t);
  const modules = (t.raw(`${meta.slug}.modules`) as ProductModule[] | undefined) ??
    base.capabilities.map((name) => ({
      name,
      summary: name,
    }));
  const faq = (t.raw(`${meta.slug}.faq`) as ProductFaq[] | undefined) ?? [];
  return { ...base, modules, faq };
}

export async function getLocalizedProducts(): Promise<LocalizedProduct[]> {
  const t = await getTranslations("products");
  return products.map((p) => localizeMeta(p, t));
}

export async function getLocalizedProduct(
  slug: string,
): Promise<LocalizedProduct | undefined> {
  const meta = getProductMeta(slug);
  if (!meta) return undefined;
  const t = await getTranslations("products");
  return localizeMeta(meta, t);
}

export async function getLocalizedProductDetail(
  slug: string,
): Promise<LocalizedProductDetail | undefined> {
  const meta = getProductMeta(slug);
  if (!meta) return undefined;
  const t = await getTranslations("products");
  return localizeDetail(meta, t);
}

export async function getLocalizedHighlightedProducts(): Promise<
  LocalizedProduct[]
> {
  const t = await getTranslations("products");
  return getHighlightedProductMetas().map((p) => localizeMeta(p, t));
}
