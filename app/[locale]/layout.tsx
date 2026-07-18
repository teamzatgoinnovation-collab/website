import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Poppins,
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Sans_Malayalam,
  Noto_Sans_SC,
  Noto_Sans_JP,
} from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { isRtlLocale, routing, type Locale } from "@/i18n/routing";
import {
  absoluteUrl,
  getSiteUrl,
  languageAlternates,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

import { Providers } from "../providers";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-noto-malayalam",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoSc = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
  display: "swap",
  weight: ["400", "500", "700"],
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
  weight: ["400", "500", "700"],
});

const scriptClass: Partial<Record<Locale, string>> = {
  ar: "font-arabic",
  ur: "font-arabic",
  hi: "font-devanagari",
  ml: "font-malayalam",
  zh: "font-cjk-sc",
  ja: "font-cjk-jp",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("titleDefault");
  const description = t("description");
  const url = absoluteUrl(locale, "/");
  const images = [
    process.env.NEXT_PUBLIC_OG_IMAGE_URL?.trim() || `${getSiteUrl()}/opengraph-image`,
  ];

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: t("titleTemplate"),
    },
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      locale,
      url,
      siteName: site.name,
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
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  const bodyScript = scriptClass[locale as Locale] ?? "";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={[
        poppins.variable,
        notoArabic.variable,
        notoDevanagari.variable,
        notoMalayalam.variable,
        notoSc.variable,
        notoJp.variable,
      ].join(" ")}
    >
      <body
        className={[
          "min-h-screen antialiased",
          poppins.className,
          bodyScript,
        ].join(" ")}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale as Locale)]} />
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
