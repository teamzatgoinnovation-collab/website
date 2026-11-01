import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { HubLinkCard } from "@/components/hub-link-card";
import { BookOpen, Code2, FileText, Library, LifeBuoy, Search } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { toneAt } from "@/lib/tone";
import { docsHubHref } from "@/content/docs-hub";
import { getLocalizedDocsHub } from "@/lib/localized-content";

const DOC_ICONS = [BookOpen, FileText, Code2, LifeBuoy, Search, Library].map((I, n) => <I key={n} className="h-5 w-5" />);

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
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} tone="teal" icon={BookOpen} icons={[BookOpen, FileText, Code2, LifeBuoy, Search, Library]} />
      <Section>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link, i) => (
          <HubLinkCard
            key={link.id}
            title={link.title}
            description={link.description}
            href={docsHubHref(link)}
            meta={link.categoryLabel}
            tone={toneAt(i)}
            icon={DOC_ICONS[i % 6]}
          />
        ))}
      </div>
      <p className="mt-8 text-sm text-m-muted">
        {t("preferTutorials")}{" "}
        <Link href="/tutorials" className="m-link">
          {t("browseTutorials")}
        </Link>
      </p>
    </Section>
      <CtaBand />
    </>
  );
}
