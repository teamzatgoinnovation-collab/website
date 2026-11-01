import { industryPages } from "@/content/industry-pages";
import { serviceSlugs } from "@/content/services";

/**
 * Image slots the admin can fill (Media library -> /admin/content). Pictures are optional everywhere: an empty slot keeps the built-in look,
 * so the site never shows a placeholder. Keys are stable; renaming one orphans the saved choice.
 */
export type ImageSlot = { slot: string; label: string; hint?: string };

export const PAGE_LABELS: { page: string; label: string }[] = [
  { page: "home", label: "Home" },
  { page: "products", label: "Products" },
  { page: "solutions", label: "Solutions" },
  { page: "industries", label: "Industries" },
  { page: "integrations", label: "Integrations" },
  { page: "services", label: "Services" },
  { page: "pricing", label: "Pricing" },
  { page: "downloads", label: "Downloads" },
  { page: "docs", label: "Docs" },
  { page: "tutorials", label: "Tutorials" },
  { page: "updates", label: "Updates" },
  { page: "case-studies", label: "Case studies" },
  { page: "about", label: "About" },
  { page: "partners", label: "Partners" },
  { page: "careers", label: "Careers" },
  { page: "contact", label: "Contact" },
  { page: "privacy", label: "Privacy" },
  { page: "terms", label: "Terms" },
  { page: "cards", label: "Cards (industries, services, products)" },
];

const HERO: ImageSlot = { slot: "heroImage", label: "Page header picture", hint: "Shown at the right of the page header instead of the icon tiles. Landscape (4:3) works best." };

const HOME: ImageSlot[] = [
  { slot: "heroBackground", label: "Hero background", hint: "Replaces the decorative skyline behind the headline. A wide, light image works best." },
  { slot: "solutionsBanner", label: "Solutions banner", hint: "Wide picture under the Solutions heading (about 21:6)." },
  { slot: "industriesBanner", label: "Industries banner", hint: "Wide picture under the Industries heading." },
  { slot: "whyBanner", label: "Why ZatGo banner", hint: "Wide picture under the Why heading." },
  { slot: "integrationsBanner", label: "Integrations banner", hint: "Wide picture under the Integrations heading." },
  { slot: "channelMobileImage", label: "Channel: Mobile", hint: "Replaces the icon panel of the Mobile channel (16:8)." },
  { slot: "channelDesktopImage", label: "Channel: Desktop", hint: "Replaces the icon panel of the Desktop channel." },
  { slot: "channelWebImage", label: "Channel: Web", hint: "Replaces the icon panel of the Web channel." },
  { slot: "storyFieldImage", label: "Story step 1 image", hint: "Shown above the first step of the story section." },
  { slot: "storyDeskImage", label: "Story step 2 image", hint: "Shown above the second step." },
  { slot: "storyPortalImage", label: "Story step 3 image", hint: "Shown above the third step." },
];

export function slotsFor(page: string): ImageSlot[] {
  if (page === "home") return HOME;
  if (page === "cards") {
    return [
      ...industryPages.map((i) => ({ slot: `industry-${i.slug}`, label: `Industry: ${i.slug.replace(/-/g, " ")}`, hint: "Cover picture on its card (16:9)." })),
      ...serviceSlugs.map((s) => ({ slot: `service-${s}`, label: `Service: ${s.replace(/-/g, " ")}`, hint: "Cover picture on its card (16:9)." })),
    ];
  }
  return [HERO];
}
