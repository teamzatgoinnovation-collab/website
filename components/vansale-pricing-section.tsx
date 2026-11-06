"use client";

import { Check, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { JsonLd } from "@/components/json-ld";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeading } from "@/components/section";
import {
  vanSaleFeatureRows,
  vanSalePricingPlans,
  yearlySavingsPercent,
  type VanSaleFeatureKey,
  type VanSalePricingPlan,
} from "@/content/vansale-pricing";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { contactHref } from "@/lib/contact-href";
import { faqJsonLd } from "@/lib/seo";
import { BookDemoLink } from "@/components/demo-dialog";

type Billing = "monthly" | "yearly";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount);
}

function PricingCard({
  plan,
  billing,
  t,
}: {
  plan: VanSalePricingPlan;
  billing: Billing;
  t: ReturnType<typeof useTranslations<"vanSalePricing">>;
}) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const savings = yearlySavingsPercent(plan);
  const ctaHref = contactHref({
    type: plan.id === "business" ? "sales" : "demo",
    tier: plan.id,
    interest: "ZatGo VanSale",
  }) as "/contact";

  return (
    <div
      className={cn(
        "m-tile relative flex flex-col p-5",
        plan.popular &&
          "!border-[var(--m-accent)] bg-[color-mix(in_oklch,var(--m-accent-soft)_55%,var(--m-surface-elevated))]",
      )}
    >
      {plan.popular ? (
        <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--m-accent)]">
          {t("popularBadge")}
        </p>
      ) : null}
      <p className="m-eyebrow">{t(`plans.${plan.id}.name`)}</p>
      <p className="mt-2 text-sm leading-relaxed text-m-muted">
        {t(`plans.${plan.id}.description`)}
      </p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-semibold tracking-tight">
          {plan.currency} {formatPrice(price)}
        </span>
        <span className="text-sm text-m-muted">
          {billing === "monthly" ? t("perMonth") : t("perYear")}
        </span>
      </div>
      {billing === "yearly" ? (
        <p className="mt-1.5 text-xs font-medium text-[var(--m-accent)]">
          {t("savePrefix")} {savings}%
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-m-muted">&nbsp;</p>
      )}
      <p className="mt-2 text-sm font-medium text-[var(--m-ink)]">
        {t(`plans.${plan.id}.basis`)}
      </p>

      <ul className="mt-7 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2.5 text-sm leading-relaxed text-m-muted"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--m-accent)]" />
            {t(`featureRows.${feature}`)}
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={cn(
          "m-btn mt-8 w-full",
          plan.popular ? "m-btn-primary" : "m-btn-ghost",
        )}
      >
        {t(`plans.${plan.id}.cta`)}
      </Link>
    </div>
  );
}

function BillingToggle({
  billing,
  onChange,
  t,
}: {
  billing: Billing;
  onChange: (value: Billing) => void;
  t: ReturnType<typeof useTranslations<"vanSalePricing">>;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={`${t("billingMonthly")} / ${t("billingYearly")}`}
      className="mx-auto flex w-fit items-center gap-1 rounded-full border border-m-line bg-[var(--m-surface)] p-1"
    >
      {(["monthly", "yearly"] as const).map((value) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={billing === value}
          onClick={() => onChange(value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--m-accent)]",
            billing === value
              ? "bg-[var(--m-accent)] text-[var(--m-accent-foreground)]"
              : "text-m-muted hover:text-[var(--m-ink)]",
          )}
        >
          {value === "monthly" ? t("billingMonthly") : t("billingYearly")}
        </button>
      ))}
    </div>
  );
}

export function VanSalePricingSection() {
  const t = useTranslations("vanSalePricing");
  const [billing, setBilling] = useState<Billing>("monthly");
  const faq = t.raw("faq") as { question: string; answer: string }[];
  const whyItems = t.raw("whyItems") as { title: string; body: string }[];
  const vatKey = vanSalePricingPlans[0]?.vatIncluded ? "vatIncluded" : "vatExcluded";

  return (
    <div id="vansale-pricing-print" className="mt-10 border-t border-m-line pt-16">
      <JsonLd data={faqJsonLd(faq)} />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          description={t("description")}
        />
        <button
          type="button"
          onClick={() => window.print()}
          data-print-hide
          className="m-btn m-btn-ghost mb-1 shrink-0 self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          {t("downloadPdf")}
        </button>
      </div>

      <MotionReveal className="mt-2 flex flex-col items-center gap-3" data-print-hide>
        <BillingToggle billing={billing} onChange={setBilling} t={t} />
        <p className="text-sm font-medium text-[var(--m-accent)]">{t("trialNote")}</p>
      </MotionReveal>
      <p className="mt-4 text-center text-xs text-m-muted">{t(vatKey)}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {vanSalePricingPlans.map((plan) => (
          <MotionReveal key={plan.id} delay={0.05}>
            <PricingCard plan={plan} billing={billing} t={t} />
          </MotionReveal>
        ))}
      </div>

      <MotionReveal className="mt-12">
        <h2 className="font-display text-2xl font-semibold">{t("comparisonTitle")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-m-muted">{t("comparisonIntro")}</p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-m-line">
                <th className="py-3 pr-4 font-medium text-m-muted" />
                {vanSalePricingPlans.map((plan) => (
                  <th
                    key={plan.id}
                    className="px-3 py-3 font-display font-semibold text-[var(--m-ink)]"
                  >
                    {t(`plans.${plan.id}.name`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vanSaleFeatureRows.map((row: VanSaleFeatureKey) => (
                <tr key={row} className="border-b border-m-line/70">
                  <th className="py-3 pr-4 text-left font-medium text-m-muted">
                    {t(`featureRows.${row}`)}
                  </th>
                  {vanSalePricingPlans.map((plan) => (
                    <td key={plan.id} className="px-3 py-3 text-[var(--m-ink)]">
                      {plan.features.includes(row) ? (
                        <Check
                          className="h-4 w-4 text-[var(--m-accent)]"
                          aria-label={t("featureRows." + row)}
                        />
                      ) : (
                        <span aria-hidden>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MotionReveal>

      <MotionReveal className="mt-12" data-print-hide>
        <h2 className="font-display text-2xl font-semibold">{t("whyTitle")}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyItems.map((item) => (
            <div key={item.title} className="m-tile p-5">
              <p className="font-display text-base font-semibold tracking-tight text-[var(--m-ink)]">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-m-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </MotionReveal>

      <MotionReveal
        className="mt-10 overflow-hidden rounded-[var(--m-radius)] bg-[var(--m-ink)] px-6 py-12 text-[var(--color-background)] md:flex md:items-center md:justify-between md:gap-6 md:px-8"
        data-print-hide
      >
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed opacity-75 md:text-base">
            {t("ctaBody")}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
          <BookDemoLink interest="ZatGo VanSale" productSlug="vansale" className="m-btn !bg-[var(--m-accent)] !text-[var(--m-accent-foreground)]">
            {t("ctaPrimary")}
          </BookDemoLink>
          <Link
            href={contactHref({ type: "sales", interest: "ZatGo VanSale" }) as "/contact"}
            className="m-btn border border-white/25 bg-transparent text-[var(--color-background)] hover:bg-white/10"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </MotionReveal>

      <MotionReveal className="mt-12" data-print-hide>
        <h2 className="font-display text-2xl font-semibold">{t("faqTitle")}</h2>
        <dl className="mt-8 max-w-3xl space-y-6">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold text-[var(--m-ink)]">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-m-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </MotionReveal>
    </div>
  );
}
