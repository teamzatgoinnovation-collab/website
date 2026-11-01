"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { industryPages } from "@/content/industry-pages";
import { integrationPages } from "@/content/integration-pages";
import { useNavProducts } from "@/components/catalog-context";
import { Link } from "@/i18n/navigation";
import type { NavMegaEntry } from "@/content/site";

type Item = { href: string; label: string; hint?: string };

/** Builds the columns for a mega panel from the same content the pages use. */
export function useMegaColumns(panel: NavMegaEntry["panel"]): { title?: string; items: Item[] }[] {
  const ti = useTranslations("industryPages");
  const tg = useTranslations("integrationsPage");
  const th = useTranslations("home2");
  const catalog = useNavProducts();

  if (panel === "products") {
    const featured = catalog.filter((p) => p.highlight);
    const more = catalog.filter((p) => !p.highlight && !p.comingSoon).slice(0, 6);
    const item = (p: (typeof catalog)[number]) => ({ href: `/products/${p.slug}`, label: p.name, hint: p.tagline });
    return [
      ...(featured.length ? [{ title: th("featuredEyebrow"), items: featured.map(item) }] : []),
      ...(more.length ? [{ title: th("moreProducts"), items: more.map(item) }] : []),
    ];
  }
  if (panel === "industries") {
    const items = industryPages.map((i) => ({ href: `/industries/${i.slug}`, label: ti(`items.${i.slug}.name`) }));
    return [{ items: items.slice(0, 5) }, { items: items.slice(5) }];
  }
  const items = integrationPages.map((i) => ({ href: `/integrations/${i.slug}`, label: tg(`items.${i.slug}.name`), hint: tg("statusPlanned") }));
  return [{ items: items.slice(0, 5) }, { items: items.slice(5) }];
}

export function MegaPanel({ entry, allLabel, onNavigate }: { entry: NavMegaEntry; allLabel: string; onNavigate: () => void }) {
  const columns = useMegaColumns(entry.panel);
  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        {columns.map((col, n) => (
          <div key={n}>
            {col.title ? <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-m-muted">{col.title}</p> : null}
            <ul className="space-y-0.5">
              {col.items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href as "/products"}
                    onClick={onNavigate}
                    className="flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-[var(--m-surface)]"
                  >
                    <span className="text-sm font-medium text-[var(--m-ink)]">{it.label}</span>
                    {it.hint ? <span className="text-xs text-m-muted">{it.hint}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link
        href={entry.href as "/products"}
        onClick={onNavigate}
        className="m-link mt-5 inline-flex items-center gap-1 border-t border-m-line pt-4 text-sm"
      >
        {allLabel}
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>
  );
}
