import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { Eye, FileText, KeyRound, Lock, Shield, ShieldCheck } from "lucide-react";
import { CompanyPageShell } from "@/components/company-page-shell";
import { MotionReveal } from "@/components/motion-reveal";

type Props = { params: Promise<{ locale: string }> };

type Section = { title: string; body: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return buildPageMetadata({
    locale,
    path: "/privacy",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const heroImage = (await getSiteContent("privacy")).images.heroImage;
  const t = await getTranslations("privacyPage");
  const sections = t.raw("sections") as Section[];

  return (
    <CompanyPageShell image={heroImage} eyebrow={t("eyebrow")} heading={t("heading")} tone="blue" icon={Shield} icons={[Shield, Lock, Eye, FileText, KeyRound, ShieldCheck]} cta={false}>
      <p className="text-sm text-[var(--m-muted)]">{t("updated")}</p>
      <div className="mt-8 max-w-3xl space-y-10">
        {sections.map((section, i) => (
          <MotionReveal key={section.title} delay={i * 0.04}>
            <h2 className="font-display text-xl font-bold text-[var(--m-ink)]">
              {section.title}
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--m-muted)]">{section.body}</p>
          </MotionReveal>
        ))}
      </div>
    </CompanyPageShell>
  );
}
