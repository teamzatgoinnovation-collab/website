import type { MetadataRoute } from "next";

import { industryPages } from "@/content/industry-pages";
import { integrationPages } from "@/content/integration-pages";
import { products } from "@/content/products";
import { locales } from "@/i18n/routing";
import { absoluteUrl, sitemapPaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of sitemapPaths) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/products" ? 0.9 : 0.7,
      });
    }
    for (const product of products) {
      entries.push({
        url: absoluteUrl(locale, `/products/${product.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const i of industryPages) {
      entries.push({ url: absoluteUrl(locale, `/industries/${i.slug}`), lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
    for (const i of integrationPages) {
      entries.push({ url: absoluteUrl(locale, `/integrations/${i.slug}`), lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    }
  }

  return entries;
}
