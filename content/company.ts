export type CareerRole = {
  id: string;
  location: string;
  type: string;
};

export type PartnerTier = {
  id: string;
};

export const careerRoles: CareerRole[] = [
  { id: "product-designer", location: "Remote", type: "Full-time" },
  { id: "mobile-engineer", location: "Remote", type: "Full-time" },
  { id: "customer-success", location: "Hybrid", type: "Full-time" },
];

export const partnerTiers: PartnerTier[] = [
  { id: "reseller" },
  { id: "implementation" },
  { id: "technology" },
];

export const inquiryTypes = [
  "demo",
  "sales",
  "support",
  "partnership",
  "careers",
  "other",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const company = {
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@zatgo.local",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  supportUrl: process.env.NEXT_PUBLIC_SUPPORT_URL ?? "/contact",
  downloadsUrl: process.env.NEXT_PUBLIC_DOWNLOADS_URL ?? "/downloads",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE ?? "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN ?? "",
  x: process.env.NEXT_PUBLIC_X ?? "",
} as const;

export function getSocialLinks() {
  return (
    [
      { id: "linkedin" as const, href: company.linkedin },
      { id: "x" as const, href: company.x },
      { id: "youtube" as const, href: company.youtube },
      { id: "facebook" as const, href: company.facebook },
    ] as const
  ).filter((item) => Boolean(item.href));
}
