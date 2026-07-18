export type CaseStudyMeta = {
  id: string;
  slug: string;
  productSlugs: string[];
};

export const caseStudies: CaseStudyMeta[] = [
  {
    id: "regional-distribution",
    slug: "regional-distribution",
    productSlugs: ["go-van", "delivery", "project-tracker", "customer-portal"],
  },
  {
    id: "campus-projects",
    slug: "campus-projects",
    productSlugs: ["project-tracker", "vendor-portal"],
  },
  {
    id: "field-service-fleet",
    slug: "field-service-fleet",
    productSlugs: ["field-service", "delivery", "fleet", "bi-dashboard"],
  },
  {
    id: "multi-site-ops",
    slug: "multi-site-ops",
    productSlugs: ["warehouse", "zatgo-pos", "hr", "admin-console"],
  },
];

export function getCaseStudyMeta(slug: string): CaseStudyMeta | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
