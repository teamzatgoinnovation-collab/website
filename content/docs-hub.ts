import { getDocsUrl } from "./site";

export type DocsHubLink = {
  id: string;
  docsPath: string;
  category: "guides" | "api" | "help" | "integrations";
};

export const docsHubLinks: DocsHubLink[] = [
  { id: "guides", docsPath: "/guides", category: "guides" },
  { id: "project-tracker", docsPath: "/guides/project-tracker", category: "guides" },
  { id: "go-van", docsPath: "/guides/go-van", category: "guides" },
  { id: "delivery", docsPath: "/guides/delivery", category: "guides" },
  { id: "integrations", docsPath: "/integrations", category: "integrations" },
  { id: "developers", docsPath: "/developers", category: "api" },
  { id: "help", docsPath: "/help", category: "help" },
  { id: "getting-started", docsPath: "/getting-started", category: "guides" },
];

export function docsHubHref(link: DocsHubLink): string {
  return getDocsUrl(link.docsPath);
}
