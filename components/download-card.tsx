"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import {
  platformLabels,
  type DownloadItem,
} from "@/content/downloads";
import { getProductImage } from "@/lib/product-images";

type DownloadCardProps = {
  item: DownloadItem;
  productName: string;
  className?: string;
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

export function DownloadCard({ item, productName, className }: DownloadCardProps) {
  const t = useTranslations("common");
  const td = useTranslations("downloadsPage");
  const disabled = item.status === "coming-soon" || !item.href;
  const thumb = getProductImage(item.productSlug);
  const inner = (
    <>
      <div className="mb-4 aspect-[16/9] overflow-hidden border border-m-line/60 bg-[color-mix(in_oklch,var(--m-accent-soft)_40%,var(--m-surface))]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt=""
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold tracking-tight">
            {productName}
          </p>
          <p className="mt-1.5 text-sm text-m-muted">
            {platformLabels[item.platform]} · {item.label}
          </p>
          {item.fileName ? (
            <p className="mt-1 font-mono text-[0.7rem] text-m-muted/80">
              {item.fileName}
            </p>
          ) : null}
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--m-radius)] bg-[var(--m-accent-soft)] text-[var(--m-accent)]">
          <Download className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-5 space-y-1.5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-m-muted">
          {item.status === "coming-soon"
            ? t("comingSoonLong")
            : item.version ?? t("available")}
        </p>
        {item.checksum && item.status === "coming-soon" ? (
          <p className="truncate font-mono text-[0.65rem] text-m-muted" title={item.checksum}>
            {td("checksum")}: {item.checksum}
          </p>
        ) : null}
        {item.status === "available" && item.platform === "web" ? (
          <p className="text-[0.65rem] font-medium text-[var(--m-accent)]">
            {td("openApp")}
          </p>
        ) : null}
      </div>
    </>
  );

  if (disabled) {
    return (
      <div className={cn("m-tile p-5 opacity-70", className)}>{inner}</div>
    );
  }

  const href = item.href!;
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("m-tile block p-5", className)}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href as "/downloads"} className={cn("m-tile block p-5", className)}>
      {inner}
    </Link>
  );
}
