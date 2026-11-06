import { SPACE_STEP_COUNT } from "@/lib/space-steps";
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

const HERO: ImageSlot = { slot: "heroImage", label: "Page header picture", hint: "Shown at the right of the page header instead of the icon tiles. Landscape (16:10) works best." };

const HOME: ImageSlot[] = [
  { slot: "heroBackground", label: "Hero background", hint: "Replaces the decorative skyline behind the headline. A wide, light image works best." },
  ...Array.from({ length: SPACE_STEP_COUNT }, (_, i): ImageSlot => ({ slot: `spaceStep${i + 1}Image`, label: `Create-a-site step ${i + 1}`, hint: "Screenshot of this step of creating a site at the Space website (landscape, about 16:10). Shown whole, never cropped." })),
  { slot: "whyBanner", label: "Why ZatGo banner", hint: "Picture shown in full under the Why heading (landscape)." },
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
