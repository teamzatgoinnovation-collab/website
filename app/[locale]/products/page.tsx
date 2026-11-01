import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { ProductCard } from "@/components/product-card";
import { Boxes, Globe, Layers, Monitor, Package, Smartphone } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { getCatalog } from "@/lib/catalog";

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
  const heroImage = (await getSiteContent("products")).images.heroImage;
  const covers = (await getSiteContent("cards")).images;
  const t = await getTranslations("productsPage");
  const all = await getCatalog();
  const available = all.filter((p) => p.status === "available");
  const soon = all.filter((p) => p.status === "coming-soon");

  return (
    <>
      <PageHero image={heroImage} eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} tone="blue" icon={Package} icons={[Package, Smartphone, Monitor, Globe, Boxes, Layers]} />
      <Section>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {available.map((product) => (
          <ProductCard key={product.slug} product={product} cover={covers[`product-${product.slug}`]} />
        ))}
      </div>
      {soon.length > 0 ? (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold">
            {t("comingSoonHeading")}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {soon.map((product) => (
              <ProductCard key={product.slug} product={product} cover={covers[`product-${product.slug}`]} />
            ))}
          </div>
        </div>
      ) : null}
    </Section>
      <CtaBand />
    </>
  );
}
