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

export const primaryNav = [
  { href: "/products", key: "products" as const },
  { href: "/downloads", key: "downloads" as const },
  { href: "/docs", key: "docs" as const },
  { href: "/tutorials", key: "tutorials" as const },
  { href: "/updates", key: "updates" as const },
  { href: "/pricing", key: "pricing" as const },
];

export const footerNav = {
  products: [
    { href: "/products", key: "allProducts" as const },
    { href: "/products/project-tracker", productSlug: "project-tracker" },
    { href: "/products/go-van", productSlug: "go-van" },
    { href: "/products/delivery", productSlug: "delivery" },
    { href: "/downloads", key: "downloads" as const },
  ],
  resources: [
    { href: "/docs", key: "documentation" as const },
    { href: "/tutorials", key: "tutorials" as const },
    { href: "/case-studies", key: "caseStudies" as const },
    { href: "/updates", key: "changelog" as const },
    { href: "/industries", key: "industries" as const },
    { href: "/solutions", key: "solutions" as const },
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
