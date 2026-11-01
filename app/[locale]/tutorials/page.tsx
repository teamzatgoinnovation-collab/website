import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { HubLinkCard } from "@/components/hub-link-card";
import { BookOpen, GraduationCap, Lightbulb, ListChecks, PlayCircle, Video } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { toneAt } from "@/lib/tone";
import { tutorialHref } from "@/content/tutorials";
import { getLocalizedTutorials } from "@/lib/localized-content";

const TUT_ICONS = [GraduationCap, PlayCircle, ListChecks, Lightbulb, BookOpen, Video].map((I, n) => <I key={n} className="h-5 w-5" />);

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
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} tone="amber" icon={GraduationCap} icons={[GraduationCap, PlayCircle, ListChecks, Lightbulb, BookOpen, Video]} />
      <Section>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tutorial, i) => (
          <HubLinkCard
            key={tutorial.slug}
            title={tutorial.title}
            description={tutorial.description}
            href={tutorialHref(tutorial)}
            meta={`${tutorial.audience} · ${tutorial.duration}`}
            tone={toneAt(i)}
            icon={TUT_ICONS[i % 6]}
          />
        ))}
      </div>
      <p className="mt-8 text-sm text-m-muted">
        {t("needDocs")}{" "}
        <Link href="/docs" className="m-link">
          {t("docsHub")}
        </Link>
      </p>
    </Section>
      <CtaBand />
    </>
  );
}
