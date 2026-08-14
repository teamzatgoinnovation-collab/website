export type VanSalePlanId = "starter" | "professional" | "business";

export type VanSaleFeatureKey =
  | "offlineOrders"
  | "vanStock"
  | "customerVisits"
  | "collections"
  | "gpsRouteTracking"
  | "multipleVans"
  | "erpnextIntegration"
  | "prioritySupport";

export type VanSalePricingPlan = {
  id: VanSalePlanId;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: "SAR";
  vatIncluded: boolean;
  popular?: boolean;
  features: VanSaleFeatureKey[];
};

/**
 * Source of truth for VanSale pricing. Change a number here once —
 * every card, the comparison table, and the annual-savings badge derive from it.
 */
export const vanSalePricingPlans: VanSalePricingPlan[] = [
  {
    id: "starter",
    monthlyPrice: 99,
    yearlyPrice: 990,
    currency: "SAR",
    vatIncluded: false,
    features: ["offlineOrders", "vanStock", "customerVisits", "collections"],
  },
  {
    id: "professional",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    currency: "SAR",
    vatIncluded: false,
    popular: true,
    features: [
      "offlineOrders",
      "vanStock",
      "customerVisits",
      "collections",
      "gpsRouteTracking",
      "multipleVans",
    ],
  },
  {
    id: "business",
    monthlyPrice: 399,
    yearlyPrice: 3990,
    currency: "SAR",
    vatIncluded: false,
    features: [
      "offlineOrders",
      "vanStock",
      "customerVisits",
      "collections",
      "gpsRouteTracking",
      "multipleVans",
      "erpnextIntegration",
      "prioritySupport",
    ],
  },
];

export const vanSaleFeatureRows: VanSaleFeatureKey[] = [
  "offlineOrders",
  "vanStock",
  "customerVisits",
  "collections",
  "gpsRouteTracking",
  "multipleVans",
  "erpnextIntegration",
  "prioritySupport",
];

/** Whole-percent savings of yearly vs. 12x monthly, derived from real prices — never hardcoded. */
export function yearlySavingsPercent(plan: VanSalePricingPlan): number {
  const monthlyTotal = plan.monthlyPrice * 12;
  return Math.round((1 - plan.yearlyPrice / monthlyTotal) * 100);
}
