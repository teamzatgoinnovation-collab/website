import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { HubLinkCard } from "@/components/hub-link-card";
import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { tutorialHref } from "@/content/tutorials";
import { getLocalizedTutorials } from "@/lib/localized-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tutorialsPage" });
  return buildPageMetadata({
    locale,
    path: "/tutorials",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tutorialsPage");
  const items = await getLocalizedTutorials();

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tutorial) => (
          <HubLinkCard
            key={tutorial.slug}
            title={tutorial.title}
            description={tutorial.description}
            href={tutorialHref(tutorial)}
            meta={`${tutorial.audience} · ${tutorial.duration}`}
          />
        ))}
      </div>
      <p className="mt-12 text-sm text-m-muted">
        {t("needDocs")}{" "}
        <Link href="/docs" className="m-link">
          {t("docsHub")}
        </Link>
      </p>
    </Section>
  );
}
