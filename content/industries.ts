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
    products: ["vansale", "delivery", "warehouse", "vendor-portal"],
  },
  {
    slug: "projects",
    products: ["tracker", "field-service", "hr"],
  },
  {
    slug: "hospitality",
    products: ["zatgo-pos", "warehouse", "accounting"],
  },
  {
    slug: "fleet-logistics",
    products: ["fleet", "delivery", "vansale"],
  },
];

export const solutions: SolutionMeta[] = [
  {
    slug: "business-management",
    products: ["erpnext", "space", "admin-console", "bi-dashboard"],
  },
  {
    slug: "field-ops",
    products: ["vansale", "delivery", "field-service", "crm"],
  },
  {
    slug: "retail-pos",
    products: ["zatgo-pos", "warehouse", "accounting"],
  },
  {
    slug: "project-delivery",
    products: ["tracker", "hr", "report-studio"],
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
