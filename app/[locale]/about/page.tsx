import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { Building2, Globe, Heart, Lightbulb, Target, Users } from "lucide-react";
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
  const whatWeBuildItems = t.raw("whatWeBuildItems") as string[];
  const values = t.raw("values") as string[];
  const technologyItems = t.raw("technologyItems") as string[];
  const whyItems = t.raw("whyItems") as string[];

  return (
    <CompanyPageShell
      tone="violet"
      icon={Building2}
      icons={[Building2, Users, Target, Heart, Globe, Lightbulb]}
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      description={t("intro")}
    >
      <MotionReveal className="m-tile flex flex-col gap-1.5 p-5 sm:flex-row sm:items-center sm:gap-5">
        <div
          aria-hidden
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--m-accent-soft)] font-display text-lg font-semibold text-[var(--m-accent)]"
        >
          {t("founderName")
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--m-accent)]">
            {t("leadershipTitle")}
          </p>
          <p className="mt-1 font-display text-lg font-semibold tracking-tight text-[var(--m-ink)]">
            {t("founderName")} <span className="font-normal text-[var(--m-muted)]">— {t("founderRole")}</span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--m-muted)]">{t("founderBio")}</p>
        </div>
      </MotionReveal>

      <MotionReveal className="mt-9">
        <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
          {t("whatWeBuildTitle")}
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-[var(--m-muted)]">
          {t("whatWeBuildBody")}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {whatWeBuildItems.map((item) => (
            <li
              key={item}
              className="border-l-2 border-[var(--m-accent)] pl-4 text-sm leading-relaxed text-[var(--m-muted)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </MotionReveal>

      <div className="mt-9 grid gap-7 border-t border-m-line pt-8 md:grid-cols-2">
        <MotionReveal>
          <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
            {t("approachTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--m-muted)]">{t("approachBody")}</p>
          <ul className="mt-4 space-y-2.5">
            {values.map((value) => (
              <li key={value} className="flex gap-3 text-[var(--m-muted)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--m-accent)]" />
                {value}
              </li>
            ))}
          </ul>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
            {t("technologyTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--m-muted)]">
            {t("technologyBody")}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {technologyItems.map((item) => (
              <li
                key={item}
                className="rounded-full border border-m-line bg-[var(--m-surface)] px-3 py-1.5 text-xs font-medium text-[var(--m-ink)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </MotionReveal>
      </div>

      <div className="mt-9 grid gap-7 border-t border-m-line pt-8 md:grid-cols-2">
        <MotionReveal>
          <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
            {t("missionTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--m-muted)]">{t("missionBody")}</p>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
            {t("visionTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--m-muted)]">{t("visionBody")}</p>
        </MotionReveal>
      </div>

      <MotionReveal className="mt-9 border-t border-m-line pt-8">
        <h2 className="font-display text-2xl font-bold text-[var(--m-ink)]">
          {t("whyTitle")}
        </h2>
        <ul className="mt-4 space-y-2.5">
          {whyItems.map((item) => (
            <li key={item} className="flex gap-3 text-[var(--m-muted)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--m-accent)]" />
              {item}
            </li>
          ))}
        </ul>
      </MotionReveal>

      <p className="mt-8">
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
