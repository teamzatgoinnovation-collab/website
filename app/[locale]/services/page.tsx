import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
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
      <Section>
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} />
        <div className="-mt-6 mb-10">
          <Link href={contactHref({ type: "quotation" }) as "/contact"} className="m-btn m-btn-primary">{t("requestQuote")}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceSlugs.map((slug, i) => (
            <MotionReveal key={slug} delay={(i % 3) * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-6">
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
        <ol className="grid gap-8 md:grid-cols-4">
          {steps.map((s, n) => (
            <li key={s.title} className="border-t border-m-line pt-5">
              <p className="font-display text-sm font-semibold text-[var(--m-accent)]">0{n + 1}</p>
              <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-m-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
