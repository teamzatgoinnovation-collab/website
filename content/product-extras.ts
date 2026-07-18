import { changelog } from "@/content/changelog";

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductModule = {
  name: string;
  summary: string;
};

export function getChangelogEntriesForProduct(slug: string, limit = 3) {
  const matched = changelog.filter(
    (entry) => !entry.products || entry.products.includes(slug),
  );
  return matched.slice(0, limit);
}
