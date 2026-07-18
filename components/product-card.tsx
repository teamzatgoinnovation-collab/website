"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { LocalizedProduct } from "@/content/products";
import { getProductImage } from "@/lib/product-images";

type ProductCardProps = {
  product: LocalizedProduct;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useTranslations("common");
  const imageSrc = getProductImage(product.slug);
  const isMobile = product.channels.length === 1 && product.channels[0] === "mobile";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("m-tile group flex flex-col overflow-hidden p-0", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[color-mix(in_oklch,var(--m-accent-soft)_55%,var(--m-surface))]">
        <Image
          src={imageSrc}
          alt=""
          fill
          unoptimized
          className={cn(
            "object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]",
            isMobile && "object-contain p-3",
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
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
