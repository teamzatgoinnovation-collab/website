export type Channel = "mobile" | "desktop" | "web";

export type ProductStatus = "available" | "coming-soon";

export type ProductMeta = {
  slug: string;
  channels: Channel[];
  status: ProductStatus;
  highlight?: boolean;
};

export type LocalizedProduct = ProductMeta & {
  name: string;
  tagline: string;
  description: string;
  capabilities: string[];
};

export const products: ProductMeta[] = [
  {
    slug: "project-tracker",
    channels: ["web", "mobile", "desktop"],
    status: "available",
    highlight: true,
  },
  { slug: "go-van", channels: ["mobile"], status: "available" },
  { slug: "delivery", channels: ["mobile"], status: "available" },
  { slug: "warehouse", channels: ["mobile", "desktop"], status: "available" },
  { slug: "hr", channels: ["mobile"], status: "available" },
  { slug: "crm", channels: ["mobile", "web"], status: "available" },
  { slug: "field-service", channels: ["mobile"], status: "available" },
  { slug: "customer-portal", channels: ["web", "mobile"], status: "available" },
  { slug: "vendor-portal", channels: ["web", "mobile"], status: "available" },
  { slug: "zatgo-pos", channels: ["desktop"], status: "available" },
  { slug: "accounting", channels: ["desktop"], status: "available" },
  { slug: "fleet", channels: ["desktop"], status: "available" },
  { slug: "admin-console", channels: ["desktop", "web"], status: "available" },
  { slug: "report-studio", channels: ["desktop"], status: "available" },
  { slug: "bi-dashboard", channels: ["web"], status: "available" },
  { slug: "retail-pos", channels: ["mobile", "desktop"], status: "coming-soon" },
  { slug: "sales-executive", channels: ["mobile"], status: "coming-soon" },
];

export function getProductMeta(slug: string): ProductMeta | undefined {
  return products.find((p) => p.slug === slug);
}

export function getHighlightedProductMetas(): ProductMeta[] {
  return products
    .filter((p) => p.highlight || p.status === "available")
    .slice(0, 6);
}

export const channelKeys: Record<Channel, "mobile" | "desktop" | "web"> = {
  mobile: "mobile",
  desktop: "desktop",
  web: "web",
};
