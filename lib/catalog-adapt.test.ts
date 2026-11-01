import assert from "node:assert/strict";
import { test } from "node:test";

import { adaptProduct, type ApiProduct } from "./catalog-adapt.ts";

const ID = "3d808aed-c59d-45d2-89eb-f3ec4fc5534f";
const api = (over: Partial<ApiProduct> = {}): ApiProduct => ({
  id: "p1", slug: "vansale", name: "VanSale", tagline: "T", summary: "S", description: "D", availability: "AVAILABLE", isFeatured: true, sortOrder: 20,
  channels: ["mobile", "fax"], accent: "#16B8E8", logoUrl: `/api/v1/media/${ID}/file`, docsUrl: null, supportUrl: null, pricingNote: null,
  features: [{ id: "f", title: "Offline orders", body: null }], modules: [], faq: [], platforms: [],
  screenshots: [{ device: "MOBILE", caption: null, media: { url: `/api/v1/media/${ID}/file`, alt: null, width: 1, height: 2 } }],
  ...over,
});

test("maps the API view to the shape the site components use", () => {
  const p = adaptProduct(api(), "https://api.example.com");
  assert.equal(p.status, "available");
  assert.equal(p.highlight, true);
  assert.deepEqual(p.channels, ["mobile"]);
  assert.deepEqual(p.capabilities, ["Offline orders"]);
  assert.equal(p.logoUrl, `https://api.example.com/api/v1/media/${ID}/file`);
  assert.equal(p.gallery.length, 1);
  assert.equal(p.gallery[0].src, `https://api.example.com/api/v1/media/${ID}/file`);
});

test("treats COMING_SOON as coming-soon and ignores unsafe accent, logo and screenshot values", () => {
  const p = adaptProduct(api({ availability: "COMING_SOON", accent: "red; background:url(x)", logoUrl: "https://evil.example/x.png", screenshots: [{ device: "MOBILE", media: { url: "https://evil.example/x.png" } }] }), "https://api.example.com");
  assert.equal(p.status, "coming-soon");
  assert.equal(p.accent, null);
  assert.equal(p.logoUrl, null);
  assert.deepEqual(p.gallery, []);
});

test("tolerates missing optional arrays", () => {
  const p = adaptProduct(api({ features: undefined as never, modules: undefined as never, faq: undefined as never, platforms: undefined as never, channels: undefined as never }), "https://a.test");
  assert.deepEqual([p.capabilities, p.modules, p.faq, p.channels], [[], [], [], []]);
});

import { relatesToActive } from "./catalog-adapt.ts";

test("content tied to products shows only while one of them is published", () => {
  const active = new Set(["vansale"]);
  assert.equal(relatesToActive(["tracker", "vansale"], active), true);
  assert.equal(relatesToActive(["tracker"], active), false);
  assert.equal(relatesToActive(undefined, active), true);
  assert.equal(relatesToActive([], new Set()), true);
});
