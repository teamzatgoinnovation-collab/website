import assert from "node:assert/strict";
import { test } from "node:test";

import { escapeHtml, oneLine, renderTeamEmail, renderVisitorEmail, type LeadForEmail } from "./lead-email-templates.ts";

const lead = (over: Partial<LeadForEmail> = {}): LeadForEmail => ({ name: "Aisha Khan", email: "aisha@example.com", company: "Acme Trading", inquiryType: "demo", interest: "VanSale", message: "Please call.", ...over });

test("oneLine strips CR/LF and control characters (header injection) and caps length", () => {
  assert.equal(oneLine("Acme\r\nBcc: evil@example.com\u0000"), "Acme Bcc: evil@example.com");
  assert.equal(oneLine("x".repeat(500), 10).length, 10);
});

test("escapeHtml neutralises markup and quotes", () => {
  assert.equal(escapeHtml(`<img src=x onerror="a()">&'`), "&lt;img src=x onerror=&quot;a()&quot;&gt;&amp;&#39;");
});

test("team email subject is single-line even with a hostile company name", () => {
  const { subject } = renderTeamEmail(lead({ company: "Acme\r\nBcc: evil@example.com", inquiryType: "demo" }));
  assert.ok(!/[\r\n]/.test(subject));
  assert.match(subject, /^New demo request - Acme Bcc/);
});

test("visitor email: neutral fixed subject, no visitor text in it, hostile fields escaped in the HTML", () => {
  const v = renderVisitorEmail(lead({ name: '<script>alert(1)</script>', company: '"><img src=x onerror=1>', interest: "<b>x</b>" }), "https://zatgoinnovation.com", "team@example.com");
  assert.equal(v.subject, "We received your demo request - ZatGo Innovation");
  assert.ok(!v.html.includes("<script>") && !v.html.includes("<img") && !v.html.includes("<b>x"));
  assert.ok(v.html.includes("&lt;script&gt;"));
  assert.ok(v.text.includes("team@example.com"));
});

test("visitor email wording differs for demo requests and general messages, and shows the preferred date only when given", () => {
  const demo = renderVisitorEmail(lead({ preferredDate: "2026-12-01" }), "https://x.test", "t@x.test");
  const other = renderVisitorEmail(lead({ inquiryType: "sales" }), "https://x.test", "t@x.test");
  assert.match(demo.text, /demo of ZatGo/);
  assert.match(demo.text, /Preferred date: 2026-12-01/);
  assert.match(other.subject, /received your message/);
  assert.ok(!other.text.includes("Preferred date"));
});
