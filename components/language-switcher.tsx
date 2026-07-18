"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

import { cn } from "@/lib/cn";

import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="appearance-none rounded-[var(--m-radius)] border border-m-line bg-transparent py-1.5 pe-7 ps-2 text-xs font-semibold text-[var(--m-ink)] outline-none transition-colors hover:border-[var(--m-accent)]"
        value={locale}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          startTransition(() => {
            router.replace(pathname, { locale: next });
          });
        }}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute end-2 text-[0.65rem] text-m-muted"
      >
        ▾
      </span>
    </label>
  );
}
