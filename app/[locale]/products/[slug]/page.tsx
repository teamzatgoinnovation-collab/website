import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Accordion } from "@/components/motion/accordion";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { getProductMedia } from "@/lib/product-media";
import { JsonLd } from "@/components/json-ld";
import { MotionReveal } from "@/components/motion-reveal";
import { ProductPricingCta } from "@/components/product-pricing-cta";
import { Section } from "@/components/section";
import { VanSalePricingSection } from "@/components/vansale-pricing-section";
import { VanSaleWorkflowSection } from "@/components/vansale-workflow-section";
import { getChangelogEntriesForProduct } from "@/content/product-extras";
import { products } from "@/content/products";
import { getDocsUrl } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { contactHref } from "@/lib/contact-href";
import { getLocalizedProductDetail } from "@/lib/localized-products";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return products.flatMap((p) =>
    routing.locales.map((locale) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getLocalizedProductDetail(slug);
  if (!product) return { title: "Product" };
  if (slug === "vansale") {
    const tPricing = await getTranslations({ locale, namespace: "vanSalePricing" });
    return buildPageMetadata({
      locale,
      path: `/products/${slug}`,
      title: tPricing("metaTitle"),
      description: tPricing("metaDescription"),
    });
  }
  return buildPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.name,
    description: product.tagline,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getLocalizedProductDetail(slug);
  if (!product) notFound();

  const t = await getTranslations("common");
  const tDetail = await getTranslations("productDetail");
  const tChangelog = await getTranslations("changelog");
  const tHome = await getTranslations("home2");
  const media = getProductMedia(slug);
  const docsHref = getDocsUrl(`/guides/${product.slug}`);
  const productUrl = absoluteUrl(locale, `/products/${slug}`);
  const changelogEntries = getChangelogEntriesForProduct(slug, 3);
  const demoHref = contactHref({ type: "demo", interest: product.name });
  const primaryChannel = product.channels[0] ?? "web";
  const outcomes = product.capabilities.slice(0, 3);

  const faqSchema = product.faq.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <Section>
      <JsonLd
        data={[
          softwareApplicationJsonLd({
            name: product.name,
            description: product.description,
            url: productUrl,
          }),
          breadcrumbJsonLd([
            { name: t("allProducts"), url: absoluteUrl(locale, "/products") },
            { name: product.name, url: productUrl },
          ]),
          ...(faqSchema.length ? [faqJsonLd(faqSchema)] : []),
        ]}
      />
      <div className="section-rule" />
      <p className="m-eyebrow">
        {product.status === "coming-soon" ? t("comingSoonLong") : t("product")}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-m-muted">
        {product.tagline}
      </p>
      <p className="mt-4 max-w-2xl leading-relaxed text-m-muted">
        {product.description}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={demoHref as "/contact"} className="m-btn m-btn-primary">
          {t("requestDemo")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <Link href="/downloads" className="m-btn m-btn-ghost">
          {t("downloads")}
        </Link>
        <a
          href={docsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="m-btn m-btn-ghost"
        >
          {t("documentation")}
        </a>
      </div>

      <MotionReveal className="mt-16 grid gap-10 border-t border-m-line pt-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {tDetail("audienceTitle")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-m-muted md:text-base">
            {tDetail(`audienceByChannel.${primaryChannel}`)}
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {tDetail("outcomesTitle")}
          </h2>
          <ul className="mt-4 space-y-3">
            {outcomes.map((item) => (
              <li
                key={item}
                className="border-l-2 border-[var(--m-accent)] pl-4 text-sm leading-relaxed text-m-muted md:text-base"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </MotionReveal>

      {product.slug === "vansale" ? <VanSaleWorkflowSection /> : null}

      <MotionReveal className="mt-16 border-t border-m-line pt-12">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {tDetail("screenshotTitle")}
        </h2>
        <p className="mt-2 mb-6 text-sm text-m-muted">{tDetail("screenshotNote")}</p>
        <ScreenshotGallery
          name={product.name}
          desktop={media.desktop}
          mobile={media.mobile}
          labels={{
            fullscreen: tHome("labelFullscreen"),
            close: tHome("labelClose"),
            prev: tHome("labelPrev"),
            next: tHome("labelNext"),
          }}
        />
      </MotionReveal>

      {product.slug !== "vansale" ? (
        <MotionReveal className="mt-16 border-t border-m-line pt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {tDetail("modulesTitle")}
          </h2>
          <p className="mt-2 text-sm text-m-muted">{tDetail("modulesHint")}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {product.modules.map((mod) => (
              <div key={mod.name} className="m-tile p-6">
                <CheckCircle2 className="h-5 w-5 text-[var(--m-accent)]" />
                <p className="mt-4 font-display text-base font-semibold tracking-tight text-[var(--m-ink)]">
                  {mod.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-m-muted">
                  {mod.summary}
                </p>
              </div>
            ))}
          </div>
        </MotionReveal>
      ) : null}

      <div className="mt-16 grid gap-12 border-t border-m-line pt-12 md:grid-cols-2">
        <MotionReveal>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {t("availableOn")}
          </h2>
          <p className="mt-5 text-sm text-m-muted">
            {product.channels.map((c) => t(c)).join(" · ")}
          </p>
        </MotionReveal>
        {changelogEntries.length > 0 ? (
          <MotionReveal delay={0.06}>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {tDetail("changelogTitle")}
            </h2>
            <ul className="mt-5 space-y-4">
              {changelogEntries.map((entry) => (
                <li key={entry.id}>
                  <p className="text-xs uppercase tracking-wider text-m-muted">
                    {entry.date} · v{entry.version}
                  </p>
                  <p className="mt-1 font-medium text-[var(--m-ink)]">
                    {tChangelog(`${entry.id}.title`)}
                  </p>
                  <p className="mt-1 text-sm text-m-muted">
                    {tChangelog(`${entry.id}.summary`)}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/updates" className="m-link mt-4 inline-block text-sm">
              {tDetail("changelogViewAll")}
            </Link>
          </MotionReveal>
        ) : null}
      </div>

      {product.faq.length > 0 ? (
        <MotionReveal className="mt-16 border-t border-m-line pt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {tDetail("faqTitle")}
          </h2>
          <div className="mt-6 max-w-3xl"><Accordion items={product.faq} /></div>
        </MotionReveal>
      ) : null}

      <MotionReveal className="mt-16 overflow-hidden rounded-[var(--m-radius)] border border-m-line bg-[var(--m-surface)] px-6 py-10 md:flex md:items-center md:justify-between md:gap-8 md:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {tDetail("ctaStripTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-m-muted md:text-base">
            {tDetail("ctaStripBody")}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
          <Link href={demoHref as "/contact"} className="m-btn m-btn-primary">
            {t("requestDemo")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <Link href="/pricing" className="m-btn m-btn-ghost">
            {tDetail("viewPricing")}
          </Link>
        </div>
      </MotionReveal>

      {product.slug === "vansale" ? (
        <VanSalePricingSection />
      ) : (
        <ProductPricingCta productName={product.name} />
      )}

      <p className="mt-14">
        <Link href="/products" className="m-link text-sm">
          ← {t("allProducts")}
        </Link>
      </p>
    </Section>
  );
}
