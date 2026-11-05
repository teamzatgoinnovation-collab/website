import assert from "node:assert/strict";
import { test } from "node:test";

import { PHONE_RATIO_DEFAULT, PHONE_RATIO_MAX, PHONE_RATIO_MIN, needsContain, phoneRatio } from "./device-ratio.ts";

test("uses the screenshot's own shape inside the phone limits", () => {
  assert.equal(phoneRatio(1080, 2400), 0.45);
  assert.equal(phoneRatio(1080, 2340), 1080 / 2340);
});

test("clamps extreme shapes and falls back when the size is unknown", () => {
  assert.equal(phoneRatio(1920, 1080), PHONE_RATIO_MAX);
  assert.equal(phoneRatio(100, 1000), PHONE_RATIO_MIN);
  for (const bad of [[undefined, undefined], [0, 100], [100, 0], [NaN, 5], [null, 5]] as const) assert.equal(phoneRatio(bad[0], bad[1]), PHONE_RATIO_DEFAULT);
});

test("only shows the whole image when covering would crop it noticeably", () => {
  assert.equal(needsContain(0.45, 0.45), false);
  assert.equal(needsContain(0.45, 0.455), false);
  assert.equal(needsContain(0.45, 0.6), true);
  assert.equal(needsContain(0.5625, 0.5625 * 1.5), true);
});
