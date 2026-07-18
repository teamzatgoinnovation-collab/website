import { products, type Channel, type ProductStatus } from "./products";
import {
  getDocsPublicUrl,
  getProductWebUrl,
  releaseAssetUrl,
} from "./product-urls";

export type DownloadPlatform =
  | "ios"
  | "android"
  | "windows"
  | "macos"
  | "linux"
  | "web"
  | "docker";

export type DownloadItem = {
  id: string;
  productSlug: string;
  channel: Channel;
  platform: DownloadPlatform;
  label: string;
  status: ProductStatus;
  href?: string;
  version?: string;
  /** SHA-256 digest when a published binary exists. */
  checksum?: string;
  fileName?: string;
};

const comingSoon = (
  partial: Omit<DownloadItem, "status" | "href"> & { status?: ProductStatus },
): DownloadItem => ({
  ...partial,
  status: partial.status ?? "coming-soon",
  href: undefined,
  checksum: partial.checksum ?? "sha256:pending",
});

/** Desktop/installer entry — available when a releases base URL resolves. */
function installer(partial: {
  id: string;
  productSlug: string;
  channel: Channel;
  platform: DownloadPlatform;
  label: string;
  fileName: string;
  version?: string;
}): DownloadItem {
  const href = releaseAssetUrl(partial.fileName);
  if (href) {
    return {
      ...partial,
      status: "available",
      href,
      version: partial.version ?? "latest",
      checksum: "sha256:see-release-notes",
    };
  }
  return comingSoon({
    ...partial,
    version: partial.version ?? "—",
  });
}

function webOpen(partial: {
  id: string;
  productSlug: string;
  label?: string;
}): DownloadItem {
  const href = getProductWebUrl(partial.productSlug);
  if (!href) {
    return comingSoon({
      id: partial.id,
      productSlug: partial.productSlug,
      channel: "web",
      platform: "web",
      label: partial.label ?? "Open app",
      version: "Web",
    });
  }
  return {
    id: partial.id,
    productSlug: partial.productSlug,
    channel: "web",
    platform: "web",
    label: partial.label ?? "Open app",
    status: "available",
    href,
    version: "Web",
  };
}

export const downloads: DownloadItem[] = [
  comingSoon({
    id: "project-tracker-ios",
    productSlug: "project-tracker",
    channel: "mobile",
    platform: "ios",
    label: "App Store",
    version: "—",
  }),
  comingSoon({
    id: "project-tracker-android",
    productSlug: "project-tracker",
    channel: "mobile",
    platform: "android",
    label: "Google Play",
    version: "—",
  }),
  webOpen({
    id: "project-tracker-web",
    productSlug: "project-tracker",
  }),
  installer({
    id: "project-tracker-win",
    productSlug: "project-tracker",
    channel: "desktop",
    platform: "windows",
    label: "Windows",
    fileName: "ZatGo-ProjectTracker-Setup.exe",
  }),
  installer({
    id: "project-tracker-mac",
    productSlug: "project-tracker",
    channel: "desktop",
    platform: "macos",
    label: "macOS",
    fileName: "ZatGo-ProjectTracker.dmg",
  }),
  installer({
    id: "project-tracker-linux",
    productSlug: "project-tracker",
    channel: "desktop",
    platform: "linux",
    label: "Linux",
    fileName: "zatgo-project-tracker.AppImage",
  }),
  comingSoon({
    id: "go-van-android",
    productSlug: "go-van",
    channel: "mobile",
    platform: "android",
    label: "Google Play",
    version: "—",
  }),
  comingSoon({
    id: "delivery-android",
    productSlug: "delivery",
    channel: "mobile",
    platform: "android",
    label: "Google Play",
    version: "—",
  }),
  comingSoon({
    id: "warehouse-android",
    productSlug: "warehouse",
    channel: "mobile",
    platform: "android",
    label: "Google Play",
    version: "—",
  }),
  installer({
    id: "warehouse-win",
    productSlug: "warehouse",
    channel: "desktop",
    platform: "windows",
    label: "Windows",
    fileName: "ZatGo-Warehouse-Setup.exe",
  }),
  installer({
    id: "zatgo-pos-win",
    productSlug: "zatgo-pos",
    channel: "desktop",
    platform: "windows",
    label: "Windows",
    fileName: "ZatGo-POS-Setup.exe",
  }),
  installer({
    id: "accounting-win",
    productSlug: "accounting",
    channel: "desktop",
    platform: "windows",
    label: "Windows",
    fileName: "ZatGo-Accounting-Setup.exe",
  }),
  installer({
    id: "fleet-win",
    productSlug: "fleet",
    channel: "desktop",
    platform: "windows",
    label: "Windows",
    fileName: "ZatGo-Fleet-Setup.exe",
  }),
  (() => {
    const image =
      process.env.NEXT_PUBLIC_DOCKER_PLATFORM_IMAGE ??
      "ghcr.io/zatgo/platform:latest";
    const href = process.env.NEXT_PUBLIC_DOCKER_PLATFORM_URL?.trim();
    if (href && !(process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/i.test(href))) {
      return {
        id: "platform-docker",
        productSlug: "admin-console",
        channel: "web" as const,
        platform: "docker" as const,
        label: "Docker",
        status: "available" as const,
        href,
        version: "latest",
        fileName: image,
      };
    }
    return comingSoon({
      id: "platform-docker",
      productSlug: "admin-console",
      channel: "web",
      platform: "docker",
      label: "Docker",
      version: "—",
      fileName: image,
    });
  })(),
  webOpen({
    id: "customer-portal-web",
    productSlug: "customer-portal",
  }),
  webOpen({
    id: "vendor-portal-web",
    productSlug: "vendor-portal",
  }),
  webOpen({
    id: "admin-portal-web",
    productSlug: "admin-console",
  }),
  webOpen({
    id: "bi-dashboard-web",
    productSlug: "bi-dashboard",
  }),
  webOpen({
    id: "crm-portal-web",
    productSlug: "crm",
    label: "Open CRM",
  }),
  (() => {
    const href = getDocsPublicUrl("/");
    if (!href) {
      return comingSoon({
        id: "documentation-web",
        productSlug: "documentation",
        channel: "web",
        platform: "web",
        label: "Open docs",
        version: "Docs",
      });
    }
    return {
      id: "documentation-web",
      productSlug: "documentation",
      channel: "web" as const,
      platform: "web" as const,
      label: "Open docs",
      status: "available" as const,
      href,
      version: "Docs",
    };
  })(),
];

export type PlatformRequirement = {
  id: DownloadPlatform;
  channel: Channel;
};

export const platformRequirements: PlatformRequirement[] = [
  { id: "ios", channel: "mobile" },
  { id: "android", channel: "mobile" },
  { id: "windows", channel: "desktop" },
  { id: "macos", channel: "desktop" },
  { id: "linux", channel: "desktop" },
  { id: "web", channel: "web" },
  { id: "docker", channel: "web" },
];

export function downloadsByChannel(channel: Channel): DownloadItem[] {
  return downloads.filter((d) => d.channel === channel);
}

export function productHasDownloads(slug: string): boolean {
  return downloads.some((d) => d.productSlug === slug);
}

export function downloadProductSlugs(): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const d of downloads) {
    if (!seen.has(d.productSlug)) {
      seen.add(d.productSlug);
      slugs.push(d.productSlug);
    }
  }
  return slugs.filter((s) => products.some((p) => p.slug === s));
}

export const platformLabels: Record<DownloadPlatform, string> = {
  ios: "iOS",
  android: "Android",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  web: "Web",
  docker: "Docker",
};
