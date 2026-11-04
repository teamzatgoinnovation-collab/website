import assert from "node:assert/strict";
import { test } from "node:test";

import { waLink } from "./whatsapp.ts";

test("keeps digits only and encodes the message", () => {
  assert.equal(waLink("+91 90613 78100", "Hello ZatGo & team"), "https://wa.me/919061378100?text=Hello%20ZatGo%20%26%20team");
  assert.equal(waLink("+919061378100"), "https://wa.me/919061378100");
});

test("returns null for missing or implausible numbers", () => {
  assert.equal(waLink(""), null);
  assert.equal(waLink(undefined), null);
  assert.equal(waLink("12345"), null);
  assert.equal(waLink("1".repeat(16)), null);
});
