import type { Metadata } from "next";

import { locales, routing, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://zatgo.local"
  );
}

export function localizedPath(locale: string, path = "/"): string {
  const normalized =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: string, path = "/"): string {
  return `${getSiteUrl()}${localizedPath(locale, path)}`;
}

export function languageAlternates(path = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return languages;
}

export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}/opengraph-image`;
}

export function getSocialImages(): string[] {
  const custom = process.env.NEXT_PUBLIC_OG_IMAGE_URL?.trim();
  if (custom) return [custom];
  return [getDefaultOgImageUrl()];
}

type PageMetaInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  image?: string;
};

export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  ogType = "website",
  noIndex = false,
  image,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(locale, path);
  const siteName = site.name;
  const images = image ? [image] : getSocialImages();

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: ogType,
      locale,
      url,
      siteName,
      title,
      description,
      images: images.map((src) => ({
        url: src,
        width: 1200,
        height: 630,
        alt: title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: getSiteUrl(),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl(locale, "/"),
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: site.legalName,
    },
  };
}

export function softwareApplicationJsonLd(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android, Windows, macOS, Linux",
    url: input.url,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
      description: "Contact for pricing",
      url: input.url,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Paths included in sitemap (without locale prefix). */
export const sitemapPaths = [
  "/",
  "/products",
  "/downloads",
  "/docs",
  "/tutorials",
  "/case-studies",
  "/updates",
  "/pricing",
  "/contact",
  "/industries",
  "/solutions",
  "/about",
  "/careers",
  "/partners",
  "/privacy",
  "/terms",
] as const;
