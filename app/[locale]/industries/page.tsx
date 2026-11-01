import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import { industryPages } from "@/content/industry-pages";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industryPages" });
  return buildPageMetadata({ locale, path: "/industries", title: t("title"), description: t("metaDescription") });
}

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industryPages");
  const accents = ["bg-[var(--m-accent)]", "bg-[var(--m-cyan)]", "bg-[var(--m-teal)]", "bg-[var(--m-purple)]"];

  return (
    <Section>
      <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industryPages.map((ind, i) => (
          <MotionReveal key={ind.slug} delay={(i % 3) * 0.05}>
            <Link
              href={`/industries/${ind.slug}` as "/industries"}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-6 transition-colors hover:border-[var(--m-accent)]"
            >
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${accents[i % 4]}`} />
              <h2 className="font-display text-lg font-semibold tracking-tight">{t(`items.${ind.slug}.name`)}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-m-muted">{t(`items.${ind.slug}.summary`)}</p>
            </Link>
          </MotionReveal>
        ))}
      </div>
    </Section>
  );
}
