import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";

type Messages = Record<string, unknown>;

function deepMerge(base: Messages, overlay: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const existing = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing)
    ) {
      out[key] = deepMerge(existing as Messages, value as Messages);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const en = (await import("../messages/en.json")).default as Messages;
  const localized =
    locale === "en"
      ? en
      : deepMerge(
          en,
          (await import(`../messages/${locale}.json`)).default as Messages,
        );

  return {
    locale,
    messages: localized,
    // Missing keys fall back to English via deepMerge; this is a last resort.
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter(Boolean).join(".");
      return path || key;
    },
    onError(error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[i18n]", error.message);
      }
    },
  };
});
