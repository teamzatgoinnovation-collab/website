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
    slug: "space",
    channels: ["web"],
    status: "available",
    highlight: true,
  },
  {
    slug: "erpnext",
    channels: ["web"],
    status: "available",
    highlight: true,
  },
  {
    slug: "tracker",
    channels: ["web", "mobile", "desktop"],
    status: "available",
    highlight: true,
  },
  { slug: "vansale", channels: ["mobile"], status: "available" },
  { slug: "mybis", channels: ["mobile", "web"], status: "coming-soon" },
  { slug: "prayertimer", channels: ["mobile", "web"], status: "available" },
  { slug: "delivery", channels: ["mobile"], status: "available" },
  { slug: "accounting", channels: ["desktop"], status: "available" },
  { slug: "chat-ai", channels: ["mobile"], status: "available" },
  { slug: "warehouse", channels: ["mobile", "desktop"], status: "coming-soon" },
  { slug: "hr", channels: ["mobile"], status: "coming-soon" },
  { slug: "crm", channels: ["mobile", "web"], status: "coming-soon" },
  { slug: "field-service", channels: ["mobile"], status: "coming-soon" },
  { slug: "customer-portal", channels: ["web", "mobile"], status: "coming-soon" },
  { slug: "vendor-portal", channels: ["web", "mobile"], status: "coming-soon" },
  { slug: "zatgo-pos", channels: ["desktop"], status: "coming-soon" },
  { slug: "fleet", channels: ["desktop"], status: "coming-soon" },
  { slug: "admin-console", channels: ["desktop", "web"], status: "coming-soon" },
  { slug: "report-studio", channels: ["desktop"], status: "coming-soon" },
  { slug: "bi-dashboard", channels: ["web"], status: "coming-soon" },
];

export function getProductMeta(slug: string): ProductMeta | undefined {
  return products.find((p) => p.slug === slug);
}

export function getHighlightedProductMetas(): ProductMeta[] {
  return products
    .filter((p) => p.highlight || p.status === "available")
    .slice(0, 7);
}

export const channelKeys: Record<Channel, "mobile" | "desktop" | "web"> = {
  mobile: "mobile",
  desktop: "desktop",
  web: "web",
};
