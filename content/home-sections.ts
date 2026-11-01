/**
 * Homepage section data. English copy; other locales fall back to it until translated.
 */
export type Accent = "primary" | "cyan" | "teal" | "purple";

export const featuredSlugs = ["erpnext", "vansale", "mybis", "prayertimer"] as const;

export const solutionTiles: { icon: string; title: string; body: string; accent: Accent }[] = [
  { icon: "Boxes", title: "ERP Management", body: "One system of record across finance, stock, sales and HR.", accent: "primary" },
  { icon: "Calculator", title: "Accounting", body: "General ledger, VAT-aware invoicing and audit trails.", accent: "teal" },
  { icon: "Warehouse", title: "Inventory", body: "Multi-warehouse stock with full movement history.", accent: "cyan" },
  { icon: "ShoppingBag", title: "Sales Management", body: "Quotes, orders, invoices and collections in one flow.", accent: "purple" },
  { icon: "Truck", title: "Procurement", body: "Purchase orders, supplier bills and receiving.", accent: "primary" },
  { icon: "Users", title: "CRM", body: "Customers, visits and follow-ups tied to real transactions.", accent: "teal" },
  { icon: "BarChart3", title: "Business Intelligence", body: "Reporting and forecasting for management.", accent: "cyan" },
  { icon: "Smartphone", title: "Mobile Business Apps", body: "Field sales and operations apps that work on the road.", accent: "purple" },
  { icon: "Workflow", title: "Workflow Automation", body: "Approvals and rules that remove manual hand-offs.", accent: "primary" },
];

export const industryTiles: { slug: string; title: string; body: string }[] = [
  { slug: "retail", title: "Retail", body: "Point of sale, stock and loyalty-ready customer records." },
  { slug: "wholesale", title: "Wholesale", body: "Bulk pricing, credit control and route-based delivery." },
  { slug: "supermarkets", title: "Supermarkets", body: "Fast-moving stock, multi-store and barcode workflows." },
  { slug: "manufacturing", title: "Manufacturing", body: "Bills of materials, production and quality tracking." },
  { slug: "restaurants", title: "Restaurants", body: "Tables, orders and kitchen flow with stock deduction." },
  { slug: "jewellery", title: "Jewellery", body: "Weight-based stock and per-item valuation." },
  { slug: "textile", title: "Textile", body: "Variants by size and colour with batch tracking." },
  { slug: "distribution", title: "Distribution", body: "Van sales, route plans and collections." },
  { slug: "healthcare", title: "Healthcare", body: "Supplies, assets and service billing." },
  { slug: "service-businesses", title: "Service Businesses", body: "Projects, timesheets and recurring invoicing." },
];

export const whyTiles: { icon: string; title: string; body: string }[] = [
  { icon: "Layers", title: "Cross-platform software", body: "Web, desktop and mobile clients on one backend." },
  { icon: "Download", title: "Downloadable applications", body: "Installers and APKs from our download center." },
  { icon: "Cloud", title: "Cloud or on-premise", body: "Host it with us or run it on your own servers." },
  { icon: "WifiOff", title: "Offline where supported", body: "Selected mobile apps keep working without a connection." },
  { icon: "Workflow", title: "Business automation", body: "Rules and approvals instead of manual steps." },
  { icon: "Plug", title: "API integrations", body: "A documented API for connecting other systems." },
  { icon: "ShieldCheck", title: "Enterprise security", body: "Role-based access and server-side validation." },
  { icon: "SlidersHorizontal", title: "Flexible customization", body: "Extend by configuration and custom apps." },
  { icon: "LayoutDashboard", title: "Centralized management", body: "Users, sites and settings managed in one place." },
];
