import { getDocsUrl } from "./site";

export type DocsHubLink = {
  id: string;
  docsPath: string;
  category: "guides" | "api" | "help" | "integrations";
  /** Shown only while this product is published. */
  productSlug?: string;
};

export const docsHubLinks: DocsHubLink[] = [
  { id: "guides", docsPath: "/guides", category: "guides" },
  { id: "tracker", docsPath: "/guides/tracker", category: "guides", productSlug: "tracker" },
  { id: "vansale", docsPath: "/guides/vansale", category: "guides", productSlug: "vansale" },
  { id: "delivery", docsPath: "/guides/delivery", category: "guides", productSlug: "delivery" },
  { id: "integrations", docsPath: "/integrations", category: "integrations" },
  { id: "developers", docsPath: "/developers", category: "api" },
  { id: "help", docsPath: "/help", category: "help" },
  { id: "getting-started", docsPath: "/getting-started", category: "guides" },
];

export function docsHubHref(link: DocsHubLink): string {
  return getDocsUrl(link.docsPath);
}
