import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Section, SectionHeading } from "@/components/section";
import { industryPages } from "@/content/industry-pages";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { contactHref } from "@/lib/contact-href";
import { getLocalizedProducts } from "@/lib/localized-products";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return industryPages.flatMap((i) => routing.locales.map((locale) => ({ locale, slug: i.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!industryPages.some((i) => i.slug === slug)) return {};
  const t = await getTranslations({ locale, namespace: "industryPages" });
  return buildPageMetadata({
    locale,
    path: `/industries/${slug}`,
    title: t(`items.${slug}.name`),
    description: t(`items.${slug}.summary`),
  });
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((x) => (
          <li key={x} className="flex gap-2.5 text-sm leading-relaxed text-m-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--m-teal)]" aria-hidden />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function IndustryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const meta = industryPages.find((i) => i.slug === slug);
  if (!meta) notFound();

  const t = await getTranslations("industryPages");
  const all = await getLocalizedProducts();
  const products = meta.products.map((s) => all.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const raw = (k: string) => t.raw(`items.${slug}.${k}`) as string[];
  const name = t(`items.${slug}.name`);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: t("title"), url: absoluteUrl(locale, "/industries") }, { name, url: absoluteUrl(locale, `/industries/${slug}`) }])} />
      <Section>
        <Link href="/industries" className="m-link text-sm">← {t("all")}</Link>
        <div className="mt-6">
          <SectionHeading eyebrow={t("eyebrow")} title={name} description={t(`items.${slug}.summary`)} />
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <List title={t("challenges")} items={raw("challenges")} />
          <List title={t("features")} items={raw("features")} />
          <div>
            <h2 className="font-display text-lg font-semibold">{t("workflow")}</h2>
            <ol className="mt-4 space-y-3">
              {raw("workflow").map((step, n) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-m-muted">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--m-accent)] text-xs font-semibold text-[var(--m-accent-foreground)]">{n + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <List title={t("benefits")} items={raw("benefits")} />
        </div>

        <h2 className="mt-14 font-display text-lg font-semibold">{t("products")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}` as "/products"} className="rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-5 transition-colors hover:border-[var(--m-accent)]">
              <p className="font-display font-semibold">{p.name}</p>
              <p className="mt-1 text-sm text-m-muted">{p.tagline}</p>
              {p.status === "coming-soon" ? <span className="mt-3 inline-block rounded-full border border-m-line px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-m-muted">{t("comingSoon")}</span> : null}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-m-muted">{t("screenshotsNote")}</p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={contactHref({ type: "demo", interest: name }) as "/contact"} className="m-btn m-btn-primary">{t("ctaDemo")}</Link>
          <Link href={contactHref({ type: "sales", interest: name }) as "/contact"} className="m-btn m-btn-ghost">{t("cta")}</Link>
        </div>
      </Section>
    </>
  );
}
