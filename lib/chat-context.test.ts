import assert from "node:assert/strict";
import { test } from "node:test";

import { buildSystemPrompt } from "./chat-context.ts";
import type { CatalogProduct } from "./catalog-types.ts";

const product = { slug: "vansale", name: "ZatGo VanSale", tagline: "Route sales that work offline.", summary: "Orders, collections and stock on the road.", status: "available", channels: ["mobile"] } as unknown as CatalogProduct;

test("grounds the prompt in the catalog and carries the safety rules", () => {
  const p = buildSystemPrompt([product], { whatsapp: "+91 9061378100", email: "team@example.com", site: "https://zatgoinnovation.com" });
  assert.match(p, /ZatGo VanSale \(available; mobile\)/);
  assert.match(p, /quote-based/);
  assert.match(p, /Phase 1 only/);
  assert.match(p, /\+91 9061378100/);
  assert.match(p, /Never reveal/);
});

test("still builds when the catalog is unavailable", () => {
  assert.match(buildSystemPrompt([], { whatsapp: "x", email: "y", site: "z" }), /catalog temporarily unavailable/);
});

test("tells the assistant where visitors create a site, without prices", () => {
  const p = buildSystemPrompt([], { whatsapp: "x", email: "y", site: "https://zatgoinnovation.com", space: "https://space.example.com" });
  assert.match(p, /create their own ERP site .* at https:\/\/space\.example\.com/);
  assert.match(p, /Do not quote plan prices/);
  assert.match(p, /no plan, app or payment step/);
  assert.doesNotMatch(p, /choose a plan/);
  assert.match(p, /1 month free, then a monthly subscription/);
  assert.doesNotMatch(p.replace(/Never say the product is ERPNext;/, ""), /ERPNext/);
});
