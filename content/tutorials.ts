import { getDocsUrl } from "./site";

export type TutorialMeta = {
  slug: string;
  docsPath: string;
};

export const tutorials: TutorialMeta[] = [
  {
    slug: "get-started-tracker",
    docsPath: "/tutorials/tracker/get-started",
  },
  {
    slug: "vansale-offline-orders",
    docsPath: "/tutorials/vansale/offline-orders",
  },
  {
    slug: "delivery-pod",
    docsPath: "/tutorials/delivery/proof-of-delivery",
  },
  {
    slug: "warehouse-picking",
    docsPath: "/tutorials/warehouse/picking",
  },
  {
    slug: "secure-sign-in",
    docsPath: "/tutorials/getting-started/sign-in",
  },
  {
    slug: "admin-roles",
    docsPath: "/tutorials/admin/roles",
  },
];

export function tutorialHref(tutorial: TutorialMeta): string {
  return getDocsUrl(tutorial.docsPath);
}
