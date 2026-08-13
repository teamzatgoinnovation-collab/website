import { getDocsPublicUrl, isProductionRuntime } from "./product-urls";

export const site = {
  name: "ZatGo",
  legalName: "ZatGo Innovation",
  /**
   * Prefer NEXT_PUBLIC_DOCS_URL / DOWNLOAD_BASE_URL/docs.
   * Dev fallback only — never used as a public href in production builds
   * without an explicit env (see getDocsUrl).
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zatgo.local",
} as const;

export function getDocsUrl(path = "/"): string {
  const resolved = getDocsPublicUrl(path);
  if (resolved) return resolved;

  if (!isProductionRuntime()) {
    const base = "http://localhost:3007";
    const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
  }

  // Production without docs URL: relative marketing hub path (not localhost).
  const normalized = path === "/" ? "/docs" : path.startsWith("/") ? path : `/${path}`;
  return normalized.startsWith("/docs") ? normalized : `/docs${normalized}`;
}

export type NavLinkEntry = { type: "link"; href: string; key: string };
export type NavDropdownEntry = {
  type: "dropdown";
  key: string;
  items: { href: string; key: string }[];
};
export type NavEntry = NavLinkEntry | NavDropdownEntry;

export const primaryNav: NavEntry[] = [
  { type: "link", href: "/products", key: "products" },
  { type: "link", href: "/solutions", key: "solutions" },
  { type: "link", href: "/industries", key: "industries" },
  {
    type: "dropdown",
    key: "company",
    items: [
      { href: "/about", key: "about" },
      { href: "/careers", key: "careers" },
      { href: "/partners", key: "partners" },
      { href: "/pricing", key: "pricing" },
    ],
  },
  {
    type: "dropdown",
    key: "resources",
    items: [
      { href: "/downloads", key: "downloads" },
      { href: "/docs", key: "docs" },
      { href: "/tutorials", key: "tutorials" },
      { href: "/updates", key: "updates" },
      { href: "/case-studies", key: "caseStudies" },
    ],
  },
];

export const footerNav = {
  products: [
    { href: "/products", key: "allProducts" as const },
    { href: "/solutions", key: "solutions" as const },
    { href: "/industries", key: "industries" as const },
    { href: "/products/space", productSlug: "space" },
    { href: "/products/erpnext", productSlug: "erpnext" },
    { href: "/products/tracker", productSlug: "tracker" },
    { href: "/products/go-van", productSlug: "go-van" },
  ],
  resources: [
    { href: "/docs", key: "documentation" as const },
    { href: "/tutorials", key: "tutorials" as const },
    { href: "/case-studies", key: "caseStudies" as const },
    { href: "/updates", key: "changelog" as const },
    { href: "/downloads", key: "downloads" as const },
  ],
  company: [
    { href: "/about", key: "about" as const },
    { href: "/careers", key: "careers" as const },
    { href: "/partners", key: "partners" as const },
    { href: "/pricing", key: "pricing" as const },
    { href: "/contact", key: "contact" as const },
    { href: "/contact", key: "requestDemo" as const },
    { href: "/privacy", key: "privacy" as const },
    { href: "/terms", key: "terms" as const },
  ],
} as const;
