"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ProductMark } from "@/components/product-mark";
import type { CatalogProduct } from "@/lib/catalog-types";

type ProductCardProps = {
  product: CatalogProduct;
  /** Admin-chosen cover picture (Content > Cards); wins over the screenshot. */
  cover?: string;
  className?: string;
};

export function ProductCard({ product, cover, className }: ProductCardProps) {
  const t = useTranslations("common");
  const shot = product.gallery[0];
  const isMobile = shot?.device === "MOBILE";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("m-tile group flex flex-col overflow-hidden p-0", className)}
    >
      <div
        className="relative flex aspect-[16/10] items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, color-mix(in oklch, ${product.accent ?? "var(--m-accent)"} 22%, white), color-mix(in oklch, ${product.accent ?? "var(--m-accent)"} 6%, white))` }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : shot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shot.src}
            alt={shot.alt ?? ""}
            loading="lazy"
            decoding="async"
            className={cn("h-full w-full transition-transform duration-500 group-hover:scale-[1.03]", isMobile ? "object-contain p-3" : "object-cover object-top")}
          />
        ) : (
          <ProductMark name={product.name} accent={product.accent} logoUrl={product.logoUrl} className="h-20 w-20 text-2xl transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {product.name}
          </h3>
          {product.status === "coming-soon" ? (
            <span className="shrink-0 rounded-full bg-[var(--m-accent-soft)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--m-accent)]">
              {t("comingSoon")}
            </span>
          ) : null}
        </div>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-m-muted">
          {product.tagline}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
          {product.channels.map((c) => (
            <span
              key={c}
              className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--m-accent)]"
            >
              {t(c)}
            </span>
          ))}
        </div>
        <span className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--m-ink)] transition-colors group-hover:text-[var(--m-accent)]">
          {t("learnMore")}
          <ArrowRight className="ms-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
