export type ChangelogMeta = {
  id: string;
  date: string;
  version: string;
  tags: string[];
  /** Product slugs this entry relates to (empty = platform-wide). */
  products?: string[];
};

export const changelog: ChangelogMeta[] = [
  {
    id: "2026-07-foundation",
    date: "2026-07-15",
    version: "0.1.0",
    tags: ["Platform", "Marketing"],
    products: ["project-tracker", "go-van", "delivery", "admin-console"],
  },
  {
    id: "2026-06-stack",
    date: "2026-06-01",
    version: "0.0.2",
    tags: ["Web", "Desktop"],
    products: ["project-tracker", "accounting", "fleet", "admin-console", "report-studio"],
  },
  {
    id: "2026-05-roadmap",
    date: "2026-05-12",
    version: "0.0.1",
    tags: ["Roadmap"],
    products: [
      "project-tracker",
      "go-van",
      "delivery",
      "warehouse",
      "crm",
      "retail-pos",
      "sales-executive",
    ],
  },
];
