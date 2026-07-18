/**
 * Public download / app open URL resolution.
 *
 * Production never exposes localhost. Prefer:
 * 1. Per-product NEXT_PUBLIC_* overrides
 * 2. DOWNLOAD_BASE_URL / NEXT_PUBLIC_DOWNLOAD_BASE_URL + known paths
 * 3. Dev-only localhost fallbacks when NODE_ENV !== "production"
 */

const WEB_APP_PATHS = {
  "project-tracker": "apps/project-tracker",
  "customer-portal": "apps/customer-portal",
  "vendor-portal": "apps/vendor-portal",
  "admin-console": "apps/admin-console",
  "bi-dashboard": "apps/bi-dashboard",
  crm: "apps/crm",
  documentation: "docs",
} as const;

export type ProductWebSlug = keyof typeof WEB_APP_PATHS;

const DEV_FALLBACKS: Record<ProductWebSlug, string> = {
  "project-tracker": "http://localhost:3004",
  "customer-portal": "http://localhost:3002",
  "vendor-portal": "http://localhost:3003",
  "admin-console": "http://localhost:3001",
  "bi-dashboard": "http://localhost:3006",
  crm: "http://localhost:3005",
  documentation: "http://localhost:3007",
};

const PRODUCT_ENV_KEYS: Record<ProductWebSlug, string> = {
  "project-tracker": "NEXT_PUBLIC_PROJECT_TRACKER_WEB_URL",
  "customer-portal": "NEXT_PUBLIC_CUSTOMER_PORTAL_URL",
  "vendor-portal": "NEXT_PUBLIC_VENDOR_PORTAL_URL",
  "admin-console": "NEXT_PUBLIC_ADMIN_PORTAL_URL",
  "bi-dashboard": "NEXT_PUBLIC_BI_DASHBOARD_URL",
  crm: "NEXT_PUBLIC_CRM_PORTAL_URL",
  documentation: "NEXT_PUBLIC_DOCS_URL",
};

export function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.ZATGO_ENV === "production"
  );
}

export function isLocalhostUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "[::1]" ||
      u.hostname === "0.0.0.0"
    );
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

/** DOWNLOAD_BASE_URL or NEXT_PUBLIC_DOWNLOAD_BASE_URL (no trailing slash). */
export function getDownloadBaseUrl(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL?.trim() ||
    process.env.DOWNLOAD_BASE_URL?.trim() ||
    "";
  if (!raw) return undefined;
  const base = raw.replace(/\/$/, "");
  if (isProductionRuntime() && isLocalhostUrl(base)) return undefined;
  return base;
}

function readEnvUrl(key: string): string | undefined {
  const value = process.env[key]?.trim();
  if (!value) return undefined;
  if (isProductionRuntime() && isLocalhostUrl(value)) return undefined;
  return value.replace(/\/$/, "");
}

function joinBase(base: string, relativePath: string): string {
  return `${base}/${relativePath.replace(/^\//, "")}`;
}

/**
 * Resolve a public open/download URL for a product slug.
 * Returns undefined when no production-safe URL is configured.
 */
export function getProductWebUrl(slug: string): string | undefined {
  if (!(slug in WEB_APP_PATHS)) return undefined;
  const key = slug as ProductWebSlug;

  const explicit = readEnvUrl(PRODUCT_ENV_KEYS[key]);
  if (explicit) return explicit;

  const base = getDownloadBaseUrl();
  if (base) return joinBase(base, WEB_APP_PATHS[key]);

  if (!isProductionRuntime()) {
    return DEV_FALLBACKS[key];
  }

  return undefined;
}

/** Optional CDN / GitHub Releases base for installer binaries. */
export function getReleasesBaseUrl(): string | undefined {
  const explicit = readEnvUrl("NEXT_PUBLIC_RELEASES_BASE_URL");
  if (explicit) return explicit;

  const base = getDownloadBaseUrl();
  if (base) return joinBase(base, "releases");

  return undefined;
}

export function releaseAssetUrl(fileName: string): string | undefined {
  const base = getReleasesBaseUrl();
  if (!base) return undefined;
  return `${base.replace(/\/$/, "")}/${fileName.replace(/^\//, "")}`;
}

export function getDocsPublicUrl(path = "/"): string | undefined {
  const docs = getProductWebUrl("documentation");
  if (!docs) return undefined;
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${docs.replace(/\/$/, "")}${normalized}`;
}
