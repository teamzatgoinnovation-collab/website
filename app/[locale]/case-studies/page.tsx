import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Award, Briefcase, MapPin, Target, TrendingUp, Users } from "lucide-react";

import { MotionReveal } from "@/components/motion-reveal";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { caseStudies } from "@/content/case-studies";
import { getActiveSlugs } from "@/lib/catalog";
import { relatesToActive } from "@/lib/catalog-adapt";
import { Link } from "@/i18n/navigation";
import { toneAt } from "@/lib/tone";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  return buildPageMetadata({
    locale,
    path: "/case-studies",
    title: t("title"),
    description: t("metaDescription"),
    noIndex: true,
  });
}

export default async function CaseStudiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const heroImage = (await getSiteContent("case-studies")).images.heroImage;
  const t = await getTranslations("caseStudiesPage");
  const tCases = await getTranslations("caseStudies");
  const active = await getActiveSlugs();
  const studies = caseStudies.filter((s) => relatesToActive(s.productSlugs, active));

  return (
    <>
      <PageHero image={heroImage} eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} tone="rose" icon={Briefcase} icons={[Briefcase, TrendingUp, Target, Users, Award, MapPin]} />
      <Section>
      <p role="note" className="mb-6 rounded-xl border border-dashed border-m-line bg-[var(--m-surface)] px-4 py-3 text-sm text-m-muted">{t("illustrativeNotice")}</p>
            <div className="space-y-0">
        {studies.map((study, i) => (
          <MotionReveal key={study.id} delay={i * 0.05}>
            <article className="grid gap-4 border-t border-m-line py-7 md:grid-cols-[10rem_1fr_auto] md:items-start md:gap-7">
              <p className={`tone-${toneAt(i + 4)} text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tone-ink)]`}>
                {tCases(`${study.id}.industry`)}
              </p>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="transition-colors hover:text-[var(--m-accent)]"
                  >
                    {tCases(`${study.id}.title`)}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-m-muted md:text-base">
                  {tCases(`${study.id}.summary`)}
                </p>
              </div>
              <Link
                href={`/case-studies/${study.slug}`}
                className="m-link inline-flex items-center gap-1 text-sm md:mt-1"
              >
                {t("readStudy")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </article>
          </MotionReveal>
        ))}
      </div>
    </Section>
      <CtaBand />
    </>
  );
}
