import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { getLocalizedSolutions } from "@/lib/localized-content";
import { getLocalizedProducts } from "@/lib/localized-products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solutionsPage" });
  return buildPageMetadata({
    locale,
    path: "/solutions",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutionsPage");
  const solutions = await getLocalizedSolutions();
  const products = await getLocalizedProducts();
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <div className="space-y-0">
        {solutions.map((solution) => (
          <article
            key={solution.slug}
            className="border-t border-m-line py-10 last:border-b"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {solution.name}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-m-muted">
              {solution.description}
            </p>
            <ul className="mt-5 space-y-2">
              {solution.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex gap-3 text-sm leading-relaxed text-m-muted"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--m-accent)]" />
                  {o}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
              {solution.products.map((slug) => {
                const product = bySlug[slug];
                if (!product) return null;
                return (
                  <Link
                    key={slug}
                    href={`/products/${slug}`}
                    className="m-link text-sm"
                  >
                    {product.name}
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-m-muted">
        <Link href="/contact" className="m-link">
          {t("mapSolution")}
        </Link>
      </p>
    </Section>
  );
}
