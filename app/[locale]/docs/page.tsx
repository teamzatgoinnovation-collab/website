import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { HubLinkCard } from "@/components/hub-link-card";
import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { docsHubHref } from "@/content/docs-hub";
import { getLocalizedDocsHub } from "@/lib/localized-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docsPage" });
  return buildPageMetadata({
    locale,
    path: "/docs",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function DocsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("docsPage");
  const links = await getLocalizedDocsHub();

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <HubLinkCard
            key={link.id}
            title={link.title}
            description={link.description}
            href={docsHubHref(link)}
            meta={link.categoryLabel}
          />
        ))}
      </div>
      <p className="mt-12 text-sm text-m-muted">
        {t("preferTutorials")}{" "}
        <Link href="/tutorials" className="m-link">
          {t("browseTutorials")}
        </Link>
      </p>
    </Section>
  );
}
