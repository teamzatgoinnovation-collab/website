import assert from "node:assert/strict";
import { test } from "node:test";

import { SPACE_STEP_COUNT, buildSteps } from "./space-steps.ts";

const texts: Record<string, string> = { spaceStep1Title: "Create your account", spaceStep1Caption: "Name and email.", spaceStep2Title: "Name your site", spaceStep2Caption: "" };
const t = (k: string) => texts[k] ?? "";

test("builds a slide for each step that has a title, in order", () => {
  const steps = buildSteps(t, {});
  assert.deepEqual(steps.map((s) => s.n), [1, 2]);
  assert.equal(steps[0].title, "Create your account");
  assert.equal(steps[1].caption, "");
});

test("uses an uploaded screenshot when there is one and never invents one", () => {
  const steps = buildSteps(t, { spaceStep2Image: "https://api.example.com/api/v1/media/x/file" });
  assert.equal(steps[0].image, null);
  assert.equal(steps[1].image, "https://api.example.com/api/v1/media/x/file");
});

test("ignores images for steps without a title and caps at the step count", () => {
  assert.equal(buildSteps(t, { spaceStep4Image: "https://a/b" }).length, 2);
  assert.equal(buildSteps(() => "x", {}).length, SPACE_STEP_COUNT);
});
