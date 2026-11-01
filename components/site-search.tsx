"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { industryPages } from "@/content/industry-pages";
import { integrationPages } from "@/content/integration-pages";
import { products } from "@/content/products";
import { serviceSlugs } from "@/content/services";
import { Link } from "@/i18n/navigation";

type Entry = { href: string; label: string; group: string };

export function SiteSearch() {
  const t = useTranslations("nav");
  const tp = useTranslations("products");
  const ti = useTranslations("industryPages");
  const tg = useTranslations("integrationsPage");
  const ts = useTranslations("servicesPage");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo<Entry[]>(
    () => [
      ...products.map((p) => ({ href: `/products/${p.slug}`, label: tp(`${p.slug}.name`), group: t("products") })),
      ...serviceSlugs.map((s) => ({ href: "/services", label: ts(`items.${s}.title`), group: t("services") })),
      ...industryPages.map((i) => ({ href: `/industries/${i.slug}`, label: ti(`items.${i.slug}.name`), group: t("industries") })),
      ...integrationPages.map((i) => ({ href: `/integrations/${i.slug}`, label: tg(`items.${i.slug}.name`), group: t("integrations") })),
      ...(["downloads", "docs", "tutorials", "updates", "pricing", "about", "contact"] as const).map((k) => ({ href: `/${k}`, label: t(k), group: t("search") })),
    ],
    [t, tp, ti, tg, ts],
  );

  const results = q.trim()
    ? index.filter((e) => e.label.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t("search")}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-m-muted hover:text-[var(--m-ink)]"
      >
        <Search className="h-4 w-4" />
      </button>
      {open ? (
        <div role="dialog" aria-modal="true" aria-label={t("search")} className="fixed inset-0 z-[90] flex items-start justify-center bg-black/50 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-m-line px-4">
              <Search className="h-4 w-4 text-m-muted" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search")}
                aria-label={t("search")}
                className="h-12 flex-1 bg-transparent text-sm outline-none"
              />
              <button type="button" aria-label={t("closeSearch")} onClick={() => setOpen(false)} className="p-1 text-m-muted"><X className="h-4 w-4" /></button>
            </div>
            <ul className="max-h-80 overflow-auto p-2">
              {results.map((r) => (
                <li key={`${r.group}-${r.label}`}>
                  <Link href={r.href as "/products"} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-[var(--m-surface)]">
                    <span>{r.label}</span>
                    <span className="text-xs text-m-muted">{r.group}</span>
                  </Link>
                </li>
              ))}
              {q.trim() && results.length === 0 ? <li className="px-3 py-4 text-sm text-m-muted">{t("noResults")}</li> : null}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
