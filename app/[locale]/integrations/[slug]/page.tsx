import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Section, SectionHeading } from "@/components/section";
import { integrationPages } from "@/content/integration-pages";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { contactHref } from "@/lib/contact-href";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return integrationPages.flatMap((i) => routing.locales.map((locale) => ({ locale, slug: i.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!integrationPages.some((i) => i.slug === slug)) return {};
  const t = await getTranslations({ locale, namespace: "integrationsPage" });
  return buildPageMetadata({
    locale,
    path: `/integrations/${slug}`,
    title: t(`items.${slug}.name`),
    description: t(`items.${slug}.description`),
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

export default async function IntegrationPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const meta = integrationPages.find((i) => i.slug === slug);
  if (!meta) notFound();

  const t = await getTranslations("integrationsPage");
  const all = await getCatalog();
  const products = meta.products.map((s) => all.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const raw = (k: string) => t.raw(`items.${slug}.${k}`) as string[];
  const name = t(`items.${slug}.name`);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: t("title"), url: absoluteUrl(locale, "/integrations") }, { name, url: absoluteUrl(locale, `/integrations/${slug}`) }])} />
      <Section>
        <Link href="/integrations" className="m-link text-sm">← {t("all")}</Link>
        <div className="mt-6">
          <SectionHeading eyebrow={t(`items.${slug}.category`)} title={name} description={t(`items.${slug}.description`)} />
        </div>
        <p className="-mt-6 mb-10 inline-flex items-center gap-2 rounded-full border border-dashed border-m-line px-3 py-1 text-xs text-m-muted">
          <span className="font-semibold uppercase tracking-wider text-[var(--m-purple)]">{t("statusPlanned")}</span>
          · {t("statusNote")}
        </p>
        <div className="grid gap-7 md:grid-cols-2">
          <List title={t("benefits")} items={raw("benefits")} />
          <List title={t("features")} items={raw("features")} />
          <List title={t("permissions")} items={raw("permissions")} />
          <div>
            <h2 className="font-display text-lg font-semibold">{t("setup")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-m-muted">{t("setupBody")}</p>
            <h2 className="mt-8 font-display text-lg font-semibold">{t("connected")}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {products.map((p) => (
                <li key={p.slug}><Link href={`/products/${p.slug}` as "/products"} className="m-link text-sm">{p.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <Link href={contactHref({ type: "sales", interest: name }) as "/contact"} className="m-btn m-btn-primary">{t("interest")}</Link>
        </div>
      </Section>
    </>
  );
}
