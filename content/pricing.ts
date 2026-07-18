export type PricingMeta = {
  id: string;
  highlighted?: boolean;
  ctaHref: string;
  /** Rows used in the comparison table. */
  comparison: {
    sites: string;
    fieldApps: boolean;
    desktopApps: boolean;
    portals: boolean;
    bi: boolean;
    sla: boolean;
    support: string;
  };
};

export const pricingTiers: PricingMeta[] = [
  {
    id: "starter",
    ctaHref: "/contact",
    comparison: {
      sites: "1",
      fieldApps: true,
      desktopApps: false,
      portals: false,
      bi: false,
      sla: false,
      support: "standard",
    },
  },
  {
    id: "business",
    highlighted: true,
    ctaHref: "/contact",
    comparison: {
      sites: "multi",
      fieldApps: true,
      desktopApps: true,
      portals: true,
      bi: false,
      sla: false,
      support: "priority",
    },
  },
  {
    id: "education",
    ctaHref: "/contact",
    comparison: {
      sites: "campus",
      fieldApps: true,
      desktopApps: true,
      portals: true,
      bi: false,
      sla: false,
      support: "education",
    },
  },
  {
    id: "government",
    ctaHref: "/contact",
    comparison: {
      sites: "agency",
      fieldApps: true,
      desktopApps: true,
      portals: true,
      bi: true,
      sla: true,
      support: "gov",
    },
  },
  {
    id: "enterprise",
    ctaHref: "/contact",
    comparison: {
      sites: "unlimited",
      fieldApps: true,
      desktopApps: true,
      portals: true,
      bi: true,
      sla: true,
      support: "dedicated",
    },
  },
];

export const pricingComparisonRows = [
  "sites",
  "fieldApps",
  "desktopApps",
  "portals",
  "bi",
  "sla",
  "support",
] as const;

export type PricingComparisonRow = (typeof pricingComparisonRows)[number];
