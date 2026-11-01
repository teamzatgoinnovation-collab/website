import assert from "node:assert/strict";
import { test } from "node:test";

import { fromApi, splitByDevice } from "./gallery-merge.ts";

const ID = "3d808aed-c59d-45d2-89eb-f3ec4fc5534f";
const shot = (over: object = {}) => ({ device: "DESKTOP", caption: "Dash", media: { url: `/api/v1/media/${ID}/file`, alt: "A", width: 320, height: 200 }, ...over });

test("maps API screenshots to absolute URLs on our API origin", () => {
  const [item] = fromApi([shot()], "https://api.example.com/");
  assert.equal(item.src, `https://api.example.com/api/v1/media/${ID}/file`);
  assert.deepEqual([item.device, item.caption, item.width], ["DESKTOP", "Dash", 320]);
});

test("drops anything that is not a media URL on our API or has an unknown device", () => {
  const bad = [
    shot({ media: { url: "https://evil.example/x.png" } }),
    shot({ media: { url: "/api/v1/media/not-a-uuid/file" } }),
    shot({ media: { url: `/api/v1/media/${ID}/file/../../etc` } }),
    shot({ device: "WATCH" }),
    shot({ media: undefined }),
    null,
  ];
  assert.deepEqual(fromApi(bad, "https://api.example.com"), []);
});

test("returns nothing without a public base or a non-array response", () => {
  assert.deepEqual(fromApi([shot()], ""), []);
  assert.deepEqual(fromApi({ error: "x" }, "https://api.example.com"), []);
});

test("splits by device", () => {
  const items = fromApi([shot(), shot({ device: "MOBILE", media: { url: "/api/v1/media/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/file" } })], "https://a.test");
  const s = splitByDevice(items);
  assert.equal(s.desktop.length, 1);
  assert.equal(s.mobile.length, 1);
  assert.equal(s.tablet.length, 0);
});
