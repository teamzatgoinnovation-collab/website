import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { ProductCard } from "@/components/product-card";
import { Section, SectionHeading } from "@/components/section";
import { getLocalizedProducts } from "@/lib/localized-products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });
  return buildPageMetadata({
    locale,
    path: "/products",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("productsPage");
  const all = await getLocalizedProducts();
  const available = all.filter((p) => p.status === "available");
  const soon = all.filter((p) => p.status === "coming-soon");

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {available.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {soon.length > 0 ? (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold">
            {t("comingSoonHeading")}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {soon.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
