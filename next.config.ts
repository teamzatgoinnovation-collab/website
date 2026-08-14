import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const downloadBase =
  process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL?.trim() ||
  process.env.DOWNLOAD_BASE_URL?.trim() ||
  "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep tracing rooted at this app when a parent monorepo lockfile exists locally.
  outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url))),
  env: {
    // Allow server-only DOWNLOAD_BASE_URL to feed public download resolution.
    NEXT_PUBLIC_DOWNLOAD_BASE_URL:
      process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL?.trim() || downloadBase,
  },
  async redirects() {
    return [
      {
        // The go-van product slug was renamed to vansale.
        source: "/:locale/products/go-van",
        destination: "/:locale/products/vansale",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
