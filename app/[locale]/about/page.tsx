import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { CompanyPageShell } from "@/components/company-page-shell";
import { MotionReveal } from "@/components/motion-reveal";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const tNav = await getTranslations("nav");
  const values = t.raw("values") as string[];

  return (
    <CompanyPageShell
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      description={t("intro")}
    >
      <div className="grid gap-10 md:grid-cols-2">
        <MotionReveal>
          <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
            {t("missionTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--m-muted)]">{t("missionBody")}</p>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
            {t("valuesTitle")}
          </h2>
          <ul className="mt-3 space-y-2.5">
            {values.map((value) => (
              <li key={value} className="flex gap-3 text-[var(--m-muted)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--m-accent)]" />
                {value}
              </li>
            ))}
          </ul>
        </MotionReveal>
      </div>
      <p className="mt-12">
        <Link
          href="/contact"
          className="inline-flex rounded-md bg-[var(--m-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--m-accent-foreground)] transition-opacity hover:opacity-90"
        >
          {tNav("contact")}
        </Link>
      </p>
    </CompanyPageShell>
  );
}
