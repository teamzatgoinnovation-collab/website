import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { DownloadCard } from "@/components/download-card";
import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import {
  downloadsByChannel,
  platformLabels,
  platformRequirements,
  type DownloadItem,
  type DownloadPlatform,
} from "@/content/downloads";
import type { Channel } from "@/content/products";
import { getLocalizedProducts } from "@/lib/localized-products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "downloadsPage" });
  return buildPageMetadata({
    locale,
    path: "/downloads",
    title: t("title"),
    description: t("metaDescription"),
  });
}

async function ChannelGroup({
  intro,
  items,
  title,
  names,
}: {
  channel: Channel;
  intro: string;
  items: DownloadItem[];
  title: string;
  names: Record<string, string>;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-14 first:mt-0">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-m-muted">{intro}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <DownloadCard
            key={item.id}
            item={item}
            productName={names[item.productSlug] ?? item.productSlug}
          />
        ))}
      </div>
    </div>
  );
}

export default async function DownloadsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("downloadsPage");
  const tc = await getTranslations("common");
  const localized = await getLocalizedProducts();
  const names = Object.fromEntries(localized.map((p) => [p.slug, p.name]));
  names.documentation = t("documentationName");

  const groups: { channel: Channel; intro: string }[] = [
    { channel: "mobile", intro: t("mobileIntro") },
    { channel: "desktop", intro: t("desktopIntro") },
    { channel: "web", intro: t("webIntro") },
  ];

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />

      <MotionReveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ["mobile", "ios", "android"],
            ["desktop", "windows", "macos", "linux"],
            ["web", "web", "docker"],
          ] as const
        ).map(([channel, ...platforms]) => (
          <div
            key={channel}
            className="border-t-2 border-[var(--m-accent)] pt-3"
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-m-muted">
              {tc(channel)}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--m-ink)]">
              {platforms.map((p) => platformLabels[p as DownloadPlatform]).join(" · ")}
            </p>
          </div>
        ))}
      </MotionReveal>

      {groups.map(({ channel, intro }) => (
        <ChannelGroup
          key={channel}
          channel={channel}
          intro={intro}
          title={tc(channel)}
          items={downloadsByChannel(channel)}
          names={names}
        />
      ))}

      <MotionReveal className="mt-16 border-t border-m-line pt-12">
        <h2 className="font-display text-2xl font-semibold">
          {t("requirementsTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-m-muted">
          {t("requirementsIntro")}
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platformRequirements.map((req) => (
            <div key={req.id}>
              <dt className="font-semibold text-[var(--m-ink)]">
                {platformLabels[req.id]}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-m-muted">
                {t(`requirements.${req.id}`)}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-xs text-m-muted">{t("checksumNote")}</p>
      </MotionReveal>

      <p className="mt-12 text-sm text-m-muted">
        {t("helpPrefix")}{" "}
        <Link href="/docs" className="m-link">
          {t("docsHub")}
        </Link>{" "}
        ·{" "}
        <Link href="/tutorials" className="m-link">
          {t("tutorials")}
        </Link>
      </p>
    </Section>
  );
}
