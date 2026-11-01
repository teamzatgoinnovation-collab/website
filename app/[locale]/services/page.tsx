import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Code2, Cloud, Database, Headset, Smartphone, Wrench } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Timeline } from "@/components/motion/timeline";
import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import { toneAt } from "@/lib/tone";
import { serviceSlugs } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/contact-href";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  return buildPageMetadata({ locale, path: "/services", title: t("title"), description: t("metaDescription") });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicesPage");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} tone="amber" icon={Wrench} icons={[Code2, Wrench, Cloud, Smartphone, Database, Headset]}>
        <Link href={contactHref({ type: "quotation" }) as "/contact"} className="m-btn m-btn-primary">{t("requestQuote")}</Link>
      </PageHero>
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceSlugs.map((slug, i) => (
            <MotionReveal key={slug} delay={(i % 3) * 0.05}>
              <div className={`tone-card tone-${toneAt(i)} flex h-full flex-col p-5`}>
                <span aria-hidden className="tone-rule" />
                <h2 className="font-display text-base font-semibold">{t(`items.${slug}.title`)}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-m-muted">{t(`items.${slug}.body`)}</p>
                <Link href={contactHref({ type: "quotation", interest: t(`items.${slug}.title`) }) as "/contact"} className="m-link mt-4 text-sm">{t("enquire")}</Link>
              </div>
            </MotionReveal>
          ))}
        </div>
      </Section>
      <Section surface>
        <SectionHeading title={t("processTitle")} />
        <div className="max-w-xl"><Timeline steps={steps} /></div>
      </Section>
      <CtaBand />
    </>
  );
}
