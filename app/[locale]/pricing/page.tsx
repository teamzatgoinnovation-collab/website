import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";

import { JsonLd } from "@/components/json-ld";
import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import {
  pricingComparisonRows,
  type PricingComparisonRow,
} from "@/content/pricing";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/contact-href";
import { getLocalizedPricing } from "@/lib/localized-content";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

type FaqItem = { question: string; answer: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricingPage" });
  return buildPageMetadata({
    locale,
    path: "/pricing",
    title: t("title"),
    description: t("metaDescription"),
  });
}

function cellValue(
  row: PricingComparisonRow,
  tier: Awaited<ReturnType<typeof getLocalizedPricing>>[number],
  t: Awaited<ReturnType<typeof getTranslations<"pricingPage">>>,
): string {
  const value = tier.comparison[row];
  if (typeof value === "boolean") {
    return value ? t("yes") : t("no");
  }
  if (row === "sites") {
    return t(`sites.${value}`);
  }
  if (row === "support") {
    return t(`support.${value}`);
  }
  return String(value);
}

function tierContactHref(tierId: string): "/contact" {
  const inquiryType =
    tierId === "education" || tierId === "government" ? "sales" : "demo";
  return contactHref({ tier: tierId, type: inquiryType }) as "/contact";
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricingPage");
  const tiers = await getLocalizedPricing();
  const faq = t.raw("faq") as FaqItem[];

  return (
    <Section>
      <JsonLd data={faqJsonLd(faq)} />
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "m-tile relative flex flex-col p-7",
              tier.highlighted &&
                "!border-[var(--m-accent)] bg-[color-mix(in_oklch,var(--m-accent-soft)_55%,var(--m-surface-elevated))]",
            )}
          >
            {tier.highlighted ? (
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--m-accent)]">
                {t("recommendedBadge")}
              </p>
            ) : null}
            <p className="m-eyebrow">{tier.name}</p>
            <p className="mt-4 font-display text-4xl font-semibold tracking-tight">
              {tier.priceLabel}
            </p>
            <p className="mt-1 text-sm text-m-muted">{tier.periodLabel}</p>
            <p className="mt-4 text-sm leading-relaxed text-m-muted">
              {tier.description}
            </p>
            {tier.highlighted ? (
              <p className="mt-3 text-sm font-medium text-[var(--m-ink)]">
                {t("recommendedNote")}
              </p>
            ) : null}
            <ul className="mt-7 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="flex gap-2.5 text-sm leading-relaxed text-m-muted"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--m-accent)]" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={tierContactHref(tier.id)}
              className={cn(
                "m-btn mt-8 w-full",
                tier.highlighted ? "m-btn-primary" : "m-btn-ghost",
              )}
            >
              {tier.ctaLabel}
            </Link>
          </div>
        ))}
      </div>

      <MotionReveal className="mt-20">
        <h2 className="font-display text-2xl font-semibold">
          {t("comparisonTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-m-muted">
          {t("comparisonIntro")}
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-m-line">
                <th className="py-3 pr-4 font-medium text-m-muted" />
                {tiers.map((tier) => (
                  <th
                    key={tier.id}
                    className="px-3 py-3 font-display font-semibold text-[var(--m-ink)]"
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingComparisonRows.map((row) => (
                <tr key={row} className="border-b border-m-line/70">
                  <th className="py-3 pr-4 text-left font-medium text-m-muted">
                    {t(`rows.${row}`)}
                  </th>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="px-3 py-3 text-[var(--m-ink)]">
                      {cellValue(row, tier, t)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MotionReveal>

      <MotionReveal className="mt-16 overflow-hidden rounded-[var(--m-radius)] bg-[var(--m-ink)] px-8 py-12 text-[var(--color-background)] md:flex md:items-center md:justify-between md:gap-8 md:px-12">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {t("ctaBandTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed opacity-75 md:text-base">
            {t("ctaBandBody")}
          </p>
        </div>
        <Link
          href={contactHref({ type: "sales", tier: "business" }) as "/contact"}
          className="m-btn mt-6 shrink-0 !bg-[var(--m-accent)] !text-[var(--m-accent-foreground)] md:mt-0"
        >
          {t("ctaBandButton")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </MotionReveal>

      <MotionReveal className="mt-20">
        <h2 className="font-display text-2xl font-semibold">{t("faqTitle")}</h2>
        <dl className="mt-8 max-w-3xl space-y-6">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold text-[var(--m-ink)]">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-m-muted">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </MotionReveal>
    </Section>
  );
}
