import { getDocsUrl } from "./site";

export type TutorialMeta = {
  slug: string;
  docsPath: string;
};

export const tutorials: TutorialMeta[] = [
  {
    slug: "get-started-project-tracker",
    docsPath: "/tutorials/project-tracker/get-started",
  },
  {
    slug: "go-van-offline-orders",
    docsPath: "/tutorials/go-van/offline-orders",
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
