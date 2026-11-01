import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MotionReveal } from "@/components/motion-reveal";
import { Building2, Factory, Shirt, Store, Truck, Warehouse } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { toneAt } from "@/lib/tone";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
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
  const heroImage = (await getSiteContent("industries")).images.heroImage;
  const covers = (await getSiteContent("cards")).images;
  const t = await getTranslations("industryPages");
  
  return (
    <>
      <PageHero image={heroImage} eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} tone="teal" icon={Factory} icons={[Factory, Store, Truck, Warehouse, Building2, Shirt]} />
      <Section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industryPages.map((ind, i) => (
          <MotionReveal key={ind.slug} delay={(i % 3) * 0.05}>
            <Link
              href={`/industries/${ind.slug}` as "/industries"}
              className={`tone-card tone-${toneAt(i)} group flex h-full flex-col p-5`}
            >
              <span aria-hidden className="tone-rule" />
              {covers[`industry-${ind.slug}`] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={covers[`industry-${ind.slug}`]} alt="" loading="lazy" decoding="async" className="-mx-5 -mt-5 mb-4 aspect-[16/9] max-w-none object-cover" style={{ width: "calc(100% + 2.5rem)" }} />
              ) : null}
              <h2 className="font-display text-lg font-semibold tracking-tight">{t(`items.${ind.slug}.name`)}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-m-muted">{t(`items.${ind.slug}.summary`)}</p>
            </Link>
          </MotionReveal>
        ))}
      </div>
    </Section>
      <CtaBand />
    </>
  );
}
