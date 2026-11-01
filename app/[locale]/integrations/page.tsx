import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import { integrationPages } from "@/content/integration-pages";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "integrationsPage" });
  return buildPageMetadata({ locale, path: "/integrations", title: t("title"), description: t("metaDescription") });
}

export default async function IntegrationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("integrationsPage");
  const groups = new Map<string, typeof integrationPages>();
  for (const i of integrationPages) {
    const c = t(`items.${i.slug}.category`);
    groups.set(c, [...(groups.get(c) ?? []), i]);
  }

  return (
    <Section>
      <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} />
      <div className="space-y-12">
        {[...groups.entries()].map(([category, list]) => (
          <div key={category}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-m-muted">{category}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => (
                <MotionReveal key={i.slug}>
                  <Link href={`/integrations/${i.slug}` as "/integrations"} className="flex h-full flex-col rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-5 transition-colors hover:border-[var(--m-accent)]">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold">{t(`items.${i.slug}.name`)}</h3>
                      <span className="rounded-full bg-[color-mix(in_oklch,var(--m-purple)_14%,transparent)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--m-purple)]">{t("statusPlanned")}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-m-muted">{t(`items.${i.slug}.description`)}</p>
                  </Link>
                </MotionReveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
