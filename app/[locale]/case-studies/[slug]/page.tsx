import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { MotionReveal } from "@/components/motion-reveal";
import { Section } from "@/components/section";
import { caseStudies, getCaseStudyMeta } from "@/content/case-studies";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getActiveSlugs, getCatalogProduct, getCatalogSafe } from "@/lib/catalog";
import { relatesToActive } from "@/lib/catalog-adapt";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { BookDemoLink } from "@/components/demo-dialog";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const active = new Set((await getCatalogSafe("en")).map((p) => p.slug));
  return caseStudies
    .filter((study) => relatesToActive(study.productSlugs, active))
    .flatMap((study) => routing.locales.map((locale) => ({ locale, slug: study.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const study = getCaseStudyMeta(slug);
  if (!study) return { title: "Case study" };
  const t = await getTranslations({ locale, namespace: "caseStudies" });
  return buildPageMetadata({
    locale,
    path: `/case-studies/${slug}`,
    title: t(`${study.id}.title`),
    description: t(`${study.id}.summary`),
    noIndex: true,
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const study = getCaseStudyMeta(slug);
  if (!study || !relatesToActive(study.productSlugs, await getActiveSlugs())) notFound();

  const t = await getTranslations("caseStudiesPage");
  const tCases = await getTranslations("caseStudies");
  const products = (
    await Promise.all(study.productSlugs.map((s) => getCatalogProduct(s)))
  ).filter(Boolean);

  return (
    <Section>
      <p role="note" className="mb-6 rounded-xl border border-dashed border-m-line bg-[var(--m-surface)] px-4 py-3 text-sm text-m-muted">{t("illustrativeNotice")}</p>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: tCases(`${study.id}.title`),
          description: tCases(`${study.id}.summary`),
          url: absoluteUrl(locale, `/case-studies/${study.slug}`),
        }}
      />
      <div className="section-rule" />
      <p className="m-eyebrow">{tCases(`${study.id}.industry`)}</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
        {tCases(`${study.id}.title`)}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-m-muted">
        {tCases(`${study.id}.summary`)}
      </p>

      <div className="mt-9 grid gap-8 border-t border-m-line pt-8 md:grid-cols-3">
        {(
          [
            ["challenge", t("challenge")],
            ["approach", t("approach")],
            ["outcome", t("outcome")],
          ] as const
        ).map(([key, label], i) => (
          <MotionReveal key={key} delay={i * 0.06}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--m-accent)]">
              {label}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-m-muted md:text-base">
              {tCases(`${study.id}.${key}`)}
            </p>
          </MotionReveal>
        ))}
      </div>

      {products.length > 0 ? (
        <MotionReveal className="mt-9 border-t border-m-line pt-8">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {t("productsUsed")}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {products.map((product) =>
              product ? (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex rounded-[var(--m-radius)] border border-m-line bg-[var(--m-surface-elevated)] px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--m-accent)] hover:text-[var(--m-accent)]"
                  >
                    {product.name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </MotionReveal>
      ) : null}

      <MotionReveal className="mt-10 overflow-hidden rounded-[var(--m-radius)] bg-[var(--m-ink)] px-6 py-12 text-[var(--color-background)] md:px-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {t("ctaTitle")}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-75 md:text-base">
          {t("ctaBody")}
        </p>
        <BookDemoLink interest={tCases(`${study.id}.title`)} className="m-btn mt-8 !bg-[var(--m-accent)] !text-[var(--m-accent-foreground)]">
          {t("ctaButton")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </BookDemoLink>
      </MotionReveal>

      <p className="mt-8">
        <Link href="/case-studies" className="m-link text-sm">
          ← {t("backToList")}
        </Link>
      </p>
    </Section>
  );
}
