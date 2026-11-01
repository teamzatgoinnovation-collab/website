/**
 * Pure email rendering for lead notifications. No framework or mailer imports so it can be tested with `node --test`.
 * Everything a visitor typed is treated as hostile: control characters (incl. CR/LF, which enable header injection) are
 * removed and HTML output is escaped. Visitor-supplied text never appears in a SUBJECT of the visitor-facing email.
 */
export type LeadForEmail = {
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  interest: string;
  message: string;
  tier?: string;
  locale?: string;
  preferredDate?: string;
  productSlug?: string;
};

const CONTROL = /[\u0000-\u001f\u007f\u2028\u2029]+/g;

/** One safe line: no control characters, collapsed spaces, capped length. */
export function oneLine(value: string, max = 120): string {
  return value.replace(CONTROL, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const multiline = (value: string, max = 4000) => value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);

export function renderTeamEmail(lead: LeadForEmail) {
  const subject = `New ${oneLine(lead.inquiryType, 30)} request - ${oneLine(lead.company, 60)}`;
  const text = [
    `Name: ${oneLine(lead.name)}`,
    `Email: ${oneLine(lead.email, 200)}`,
    `Company: ${oneLine(lead.company, 160)}`,
    `Request type: ${oneLine(lead.inquiryType, 30)}`,
    `Interest: ${oneLine(lead.interest, 240)}`,
    lead.productSlug ? `Product: ${oneLine(lead.productSlug, 80)}` : null,
    lead.preferredDate ? `Preferred date: ${oneLine(lead.preferredDate, 20)}` : null,
    lead.tier ? `Plan: ${oneLine(lead.tier, 80)}` : null,
    lead.locale ? `Language: ${oneLine(lead.locale, 12)}` : null,
    "",
    multiline(lead.message),
  ].filter((l) => l !== null).join("\n");
  return { subject, text };
}

export function renderVisitorEmail(lead: LeadForEmail, siteUrl: string, teamEmail: string) {
  const demo = lead.inquiryType === "demo";
  const name = oneLine(lead.name, 80);
  const subject = demo ? "We received your demo request - ZatGo Innovation" : "We received your message - ZatGo Innovation";
  const lines = [
    `Hello ${name},`,
    "",
    demo
      ? "Thank you for asking for a demo of ZatGo. We have received your request and a member of our team will contact you by email to arrange it."
      : "Thank you for contacting ZatGo. We have received your message and a member of our team will reply by email.",
    "",
    "What you sent us:",
    `- Company: ${oneLine(lead.company, 160)}`,
    `- Interest: ${oneLine(lead.interest, 240)}`,
    lead.preferredDate ? `- Preferred date: ${oneLine(lead.preferredDate, 20)}` : null,
    "",
    `If you did not make this request, you can ignore this email. To add details, just reply to ${teamEmail}.`,
    "",
    "ZatGo Innovation",
    siteUrl,
  ].filter((l) => l !== null) as string[];
  const text = lines.join("\n");
  const html = [
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#101828;max-width:560px">`,
    `<p style="margin:0 0 14px">Hello ${escapeHtml(name)},</p>`,
    `<p style="margin:0 0 14px">${escapeHtml(lines[3])}</p>`,
    `<p style="margin:0 0 6px"><strong>What you sent us</strong></p>`,
    `<ul style="margin:0 0 14px;padding-left:20px">`,
    `<li>Company: ${escapeHtml(oneLine(lead.company, 160))}</li>`,
    `<li>Interest: ${escapeHtml(oneLine(lead.interest, 240))}</li>`,
    lead.preferredDate ? `<li>Preferred date: ${escapeHtml(oneLine(lead.preferredDate, 20))}</li>` : "",
    `</ul>`,
    `<p style="margin:0 0 14px;color:#475467">If you did not make this request, you can ignore this email. To add details, just reply to ${escapeHtml(teamEmail)}.</p>`,
    `<p style="margin:0"><strong>ZatGo Innovation</strong><br><a href="${escapeHtml(siteUrl)}" style="color:#2952e3">${escapeHtml(siteUrl)}</a></p>`,
    `</div>`,
  ].join("");
  return { subject, text, html };
}
