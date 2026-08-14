import { getTranslations } from "next-intl/server";

import { changelog } from "@/content/changelog";
import { site } from "@/content/site";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "changelog" });
  const siteUrl = getSiteUrl();
  const feedUrl = `${siteUrl}/feed.xml`;
  const updatesUrl = absoluteUrl(locale, "/updates");

  const items = changelog
    .map((entry) => {
      const title = t(`${entry.id}.title`);
      const summary = t(`${entry.id}.summary`);
      const link = `${updatesUrl}#${entry.id}`;
      const pubDate = new Date(`${entry.date}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${escapeXml(`${title} (v${entry.version})`)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(`${site.name}-${entry.id}`)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(summary)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${site.legalName} — Updates`)}</title>
    <link>${escapeXml(updatesUrl)}</link>
    <description>${escapeXml("Product and platform updates from ZatGo Innovation.")}</description>
    <language>${locale}</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
