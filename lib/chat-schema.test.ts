import assert from "node:assert/strict";
import { test } from "node:test";

import { validateChat } from "./chat-schema.ts";

const u = (content: string) => ({ role: "user", content });
const a = (content: string) => ({ role: "assistant", content });

test("accepts a normal conversation that ends with a user message", () => {
  const r = validateChat({ messages: [u("Hi"), a("Hello!"), u("What products?")] });
  assert.equal(r.ok, true);
});

test("rejects bad roles, empty lists, long messages and conversations not ending with the user", () => {
  assert.deepEqual(validateChat({ messages: [{ role: "system", content: "x" }] }), { ok: false, error: "invalid" });
  assert.deepEqual(validateChat({ messages: [] }), { ok: false, error: "invalid" });
  assert.deepEqual(validateChat({ messages: [u("Hi"), a("Hello")] }), { ok: false, error: "invalid" });
  assert.deepEqual(validateChat({ messages: [a("Hello"), u("Hi")] }), { ok: false, error: "invalid" });
  assert.deepEqual(validateChat({ messages: [u("x".repeat(601))] }), { ok: false, error: "too_long" });
  assert.equal(validateChat({ messages: Array.from({ length: 11 }, (_, i) => (i % 2 ? a("a") : u("u"))) }).ok, false);
  assert.equal(validateChat("nope").ok, false);
});
