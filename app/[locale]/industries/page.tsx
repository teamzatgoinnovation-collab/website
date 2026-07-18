import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { getLocalizedIndustries } from "@/lib/localized-content";
import { getLocalizedProducts } from "@/lib/localized-products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industriesPage" });
  return buildPageMetadata({
    locale,
    path: "/industries",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industriesPage");
  const industries = await getLocalizedIndustries();
  const products = await getLocalizedProducts();
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <div className="grid gap-5 md:grid-cols-2">
        {industries.map((industry) => (
          <article key={industry.slug} className="m-tile p-7">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {industry.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-m-muted">
              {industry.description}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
              {industry.products.map((slug) => {
                const product = bySlug[slug];
                if (!product) return null;
                return (
                  <li key={slug}>
                    <Link href={`/products/${slug}`} className="m-link text-sm">
                      {product.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-12 text-sm text-m-muted">
        {t("preferSolutions")}{" "}
        <Link href="/solutions" className="m-link">
          {t("viewSolutions")}
        </Link>
      </p>
    </Section>
  );
}
