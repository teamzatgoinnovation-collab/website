/** Every integration is "planned" until its backend connection is built and tested. */
export type IntegrationStatus = "planned" | "available";
export const integrationPages: { slug: string; status: IntegrationStatus; products: string[] }[] = [
  { slug: "gmail", status: "planned", products: ["erpnext"] },
  { slug: "whatsapp-business", status: "planned", products: ["erpnext", "vansale"] },
  { slug: "google-maps", status: "planned", products: ["vansale", "delivery"] },
  { slug: "google-drive", status: "planned", products: ["erpnext"] },
  { slug: "google-calendar", status: "planned", products: ["tracker"] },
  { slug: "payment-gateways", status: "planned", products: ["erpnext", "zatgo-pos"] },
  { slug: "sms-services", status: "planned", products: ["erpnext", "delivery"] },
  { slug: "email-services", status: "planned", products: ["erpnext"] },
  { slug: "accounting-systems", status: "planned", products: ["accounting", "erpnext"] },
  { slug: "external-apis", status: "planned", products: ["erpnext"] },
];
