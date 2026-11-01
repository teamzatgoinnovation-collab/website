/** Types for the product catalog served by website-api. No data lives here. */
import type { GalleryItem } from "./gallery-merge";

export type Channel = "mobile" | "desktop" | "web";
export type ProductStatus = "available" | "coming-soon";

export type ProductModule = { name: string; summary: string };
export type ProductFaq = { question: string; answer: string };

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  status: ProductStatus;
  highlight: boolean;
  sortOrder: number;
  channels: Channel[];
  /** Brand colour chosen in the admin (#RRGGBB) or null. */
  accent: string | null;
  /** Absolute URL of the logo uploaded in the admin, or null. */
  logoUrl: string | null;
  /** Feature titles, used on cards. */
  capabilities: string[];
  features: { id: string; title: string; body: string | null }[];
  modules: ProductModule[];
  faq: ProductFaq[];
  platforms: { platform: string; storeUrl: string | null }[];
  docsUrl: string | null;
  supportUrl: string | null;
  pricingNote: string | null;
  /** Screenshots uploaded in the admin, in the admin's order. Empty means "show no device pictures". */
  gallery: GalleryItem[];
};
