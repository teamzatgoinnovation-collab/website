import type { MetadataRoute } from "next";

import { caseStudies } from "@/content/case-studies";
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
    for (const study of caseStudies) {
      entries.push({
        url: absoluteUrl(locale, `/case-studies/${study.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  return entries;
}
