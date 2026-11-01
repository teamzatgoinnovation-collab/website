"use client";

import { createContext, useContext, type ReactNode } from "react";

/** The few catalog fields the client-side navigation (mega menu, search) needs. */
export type NavProduct = { slug: string; name: string; tagline: string; comingSoon: boolean; highlight: boolean; accent: string | null; logoUrl: string | null };

const Ctx = createContext<NavProduct[]>([]);

export function CatalogProvider({ products, children }: { products: NavProduct[]; children: ReactNode }) {
  return <Ctx.Provider value={products}>{children}</Ctx.Provider>;
}

export const useNavProducts = () => useContext(Ctx);
