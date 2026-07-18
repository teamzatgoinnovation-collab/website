import { defineRouting } from "next-intl/routing";

export const locales = [
  "en",
  "hi",
  "ur",
  "ar",
  "ml",
  "es",
  "zh",
  "ja",
  "tr",
] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  ur: "اردو",
  ar: "العربية",
  ml: "മലയാളം",
  es: "Español",
  zh: "中文",
  ja: "日本語",
  tr: "Türkçe",
};

/** Right-to-left locales */
export const rtlLocales: ReadonlySet<Locale> = new Set(["ar", "ur"]);

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.has(locale as Locale);
}

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "always",
});
