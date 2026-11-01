"use client";

import {
  Boxes,
  Calculator,
  ClipboardList,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { useTranslations } from "next-intl";

const categories = [
  { key: "Erp", icon: Boxes },
  { key: "Finance", icon: Calculator },
  { key: "Field", icon: Truck },
  { key: "Crm", icon: Users },
  { key: "Inventory", icon: Warehouse },
  { key: "Ops", icon: ClipboardList },
] as const;

export function EcosystemDiagram({ labels }: { labels: Record<string, string> }) {
  const tBrand = useTranslations("brand");

  return (
    <div className="relative">
      <div className="mx-auto mb-6 flex w-fit items-center gap-2.5 rounded-full border border-m-line bg-[var(--m-surface-elevated)] px-5 py-2.5 shadow-[var(--m-shadow-soft)]">
        <span
          aria-hidden
          className="inline-flex h-6 w-6 items-center justify-center rounded-[0.3rem] bg-[var(--m-accent)] text-[0.55rem] font-bold text-[var(--m-accent-foreground)]"
        >
          ZG
        </span>
        <span className="font-display text-sm font-semibold tracking-tight">
          {tBrand("legalName")}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="m-tile flex flex-col gap-2.5 p-5"
          >
            <Icon className="h-5 w-5 text-[var(--m-accent)]" />
            <p className="font-display text-base font-semibold tracking-tight text-[var(--m-ink)]">
              {labels[`${key}Title`]}
            </p>
            <p className="text-sm leading-relaxed text-m-muted">
              {labels[`${key}Body`]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
