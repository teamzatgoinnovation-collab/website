import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { Section, SectionHeading } from "@/components/section";
import { getLocalizedChangelog } from "@/lib/localized-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "updatesPage" });
  return buildPageMetadata({
    locale,
    path: "/updates",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function UpdatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("updatesPage");
  const entries = await getLocalizedChangelog();

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <ol className="space-y-0">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="grid gap-3 border-t border-m-line py-10 last:border-b md:grid-cols-[9rem_1fr] md:gap-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-m-muted">
              {entry.date}
              <span className="mt-1 block font-medium normal-case tracking-normal text-[var(--m-accent)]">
                v{entry.version}
              </span>
            </p>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {entry.title}
              </h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-m-muted">
                {entry.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                {entry.tags.map((tag) => (
                  <span key={tag} className="m-eyebrow !normal-case !tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
