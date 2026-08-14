import nodemailer from "nodemailer";

import type { LeadRecord } from "./leads-store";

function getTransport() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user, pass },
  });
}

function getNotifyEmail(): string | null {
  return process.env.LEADS_NOTIFY_EMAIL?.trim() || "team.zatgoinnovation@gmail.com";
}

/** Sends a lead notification email. No-op (never throws) when SMTP isn't configured. */
export async function sendLeadEmail(lead: LeadRecord): Promise<void> {
  const transport = getTransport();
  if (!transport) return;

  const to = getNotifyEmail();
  if (!to) return;

  const from = process.env.SMTP_USER!.trim();

  await transport.sendMail({
    from: `"ZatGo Website" <${from}>`,
    to,
    replyTo: lead.email,
    subject: `New ${lead.inquiryType} inquiry — ${lead.company}`,
    text: [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company}`,
      `Inquiry type: ${lead.inquiryType}`,
      `Interest: ${lead.interest}`,
      lead.tier ? `Tier: ${lead.tier}` : null,
      lead.locale ? `Locale: ${lead.locale}` : null,
      "",
      lead.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
