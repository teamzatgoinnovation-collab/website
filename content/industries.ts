export type IndustryMeta = {
  slug: string;
  products: string[];
};

export type SolutionMeta = {
  slug: string;
  products: string[];
};

export const industries: IndustryMeta[] = [
  {
    slug: "distribution",
    products: ["go-van", "delivery", "warehouse", "vendor-portal"],
  },
  {
    slug: "projects",
    products: ["project-tracker", "field-service", "hr"],
  },
  {
    slug: "hospitality",
    products: ["zatgo-pos", "warehouse", "accounting"],
  },
  {
    slug: "fleet-logistics",
    products: ["fleet", "delivery", "go-van"],
  },
];

export const solutions: SolutionMeta[] = [
  {
    slug: "field-ops",
    products: ["go-van", "delivery", "field-service", "crm"],
  },
  {
    slug: "retail-pos",
    products: ["zatgo-pos", "retail-pos", "warehouse", "accounting"],
  },
  {
    slug: "project-delivery",
    products: ["project-tracker", "hr", "report-studio"],
  },
  {
    slug: "back-office",
    products: [
      "accounting",
      "admin-console",
      "bi-dashboard",
      "customer-portal",
      "vendor-portal",
    ],
  },
];
