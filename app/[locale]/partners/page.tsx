import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { CompanyPageShell } from "@/components/company-page-shell";
import { MotionReveal } from "@/components/motion-reveal";
import { partnerTiers } from "@/content/company";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnersPage" });
  return buildPageMetadata({
    locale,
    path: "/partners",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partnersPage");

  return (
    <CompanyPageShell
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      description={t("description")}
    >
      <h2 className="font-display text-xl font-bold text-[var(--m-ink)]">
        {t("tiersTitle")}
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {partnerTiers.map((tier, i) => (
          <MotionReveal key={tier.id} delay={i * 0.06}>
            <div className="border-t-2 border-[var(--m-accent)] pt-4">
              <h3 className="font-display text-lg font-bold text-[var(--m-ink)]">
                {t(`tiers.${tier.id}.name`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--m-muted)]">
                {t(`tiers.${tier.id}.body`)}
              </p>
            </div>
          </MotionReveal>
        ))}
      </div>
      <p className="mt-12">
        <Link
          href="/contact"
          className="inline-flex rounded-md bg-[var(--m-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--m-accent-foreground)] transition-opacity hover:opacity-90"
        >
          {t("cta")}
        </Link>
      </p>
    </CompanyPageShell>
  );
}
