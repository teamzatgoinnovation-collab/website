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

test("videos come first, then the steps, and the step numbers are unchanged", async () => {
  const { isYouTubeId } = await import("./space-steps.ts");
  const withVideo = buildSteps((k) => ({ ...texts, spaceVideoTitle: "Watch", spaceVideoCaption: "How it works" })[k] ?? "", {}, [{ id: "3_ulD2r6rhg" }]);
  assert.deepEqual(withVideo.map((s) => s.kind), ["video", "step", "step"]);
  assert.equal(withVideo[0].video, "3_ulD2r6rhg");
  assert.deepEqual(withVideo.slice(1).map((s) => s.n), [1, 2]);
  assert.equal(new Set(withVideo.map((s) => s.kind + s.n)).size, withVideo.length);
  assert.equal(isYouTubeId("3_ulD2r6rhg"), true);
});

test("a malformed video id is never used", () => {
  assert.equal(buildSteps(t, {}, [{ id: "x" }, { id: "abc\"onload=" }, { id: "../../evil..." }]).filter((s) => s.kind === "video").length, 0);
});
