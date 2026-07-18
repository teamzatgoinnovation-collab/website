import { getTranslations, getMessages } from "next-intl/server";

import { changelog as changelogMeta } from "@/content/changelog";
import { docsHubLinks as docsMeta } from "@/content/docs-hub";
import {
  industries as industryMeta,
  solutions as solutionMeta,
} from "@/content/industries";
import { pricingTiers as pricingMeta } from "@/content/pricing";
import { tutorials as tutorialMeta } from "@/content/tutorials";

export async function getLocalizedChangelog() {
  const t = await getTranslations("changelog");
  return changelogMeta.map((entry) => ({
    ...entry,
    title: t(`${entry.id}.title`),
    summary: t(`${entry.id}.summary`),
  }));
}

export async function getLocalizedDocsHub() {
  const t = await getTranslations("docsHub");
  const cat = await getTranslations("docsPage.categories");
  return docsMeta.map((link) => ({
    ...link,
    title: t(`${link.id}.title`),
    description: t(`${link.id}.description`),
    categoryLabel: cat(link.category),
  }));
}

export async function getLocalizedTutorials() {
  const t = await getTranslations("tutorials");
  return tutorialMeta.map((item) => ({
    ...item,
    title: t(`${item.slug}.title`),
    description: t(`${item.slug}.description`),
    audience: t(`${item.slug}.audience`),
    duration: t(`${item.slug}.duration`),
  }));
}

export async function getLocalizedPricing() {
  const t = await getTranslations("pricing");
  const page = await getTranslations("pricingPage");
  return pricingMeta.map((tier) => ({
    ...tier,
    name: t(`${tier.id}.name`),
    description: t(`${tier.id}.description`),
    features: t.raw(`${tier.id}.features`) as string[],
    ctaLabel: t(`${tier.id}.cta`),
    priceLabel: page("custom"),
    periodLabel:
      tier.id === "enterprise" || tier.id === "government"
        ? page("periodOrg")
        : page("periodSite"),
  }));
}

export async function getLocalizedIndustries() {
  const t = await getTranslations("industries");
  return industryMeta.map((item) => ({
    ...item,
    name: t(`${item.slug}.name`),
    description: t(`${item.slug}.description`),
  }));
}

export async function getLocalizedSolutions() {
  const t = await getTranslations("solutions");
  return solutionMeta.map((item) => ({
    ...item,
    name: t(`${item.slug}.name`),
    description: t(`${item.slug}.description`),
    outcomes: t.raw(`${item.slug}.outcomes`) as string[],
  }));
}

/** Access raw nested messages when needed (e.g. client components). */
export async function getMessagesTree() {
  return getMessages();
}
