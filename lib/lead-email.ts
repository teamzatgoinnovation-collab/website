import nodemailer, { type Transporter } from "nodemailer";

import { renderTeamEmail, renderVisitorEmail } from "./lead-email-templates";
import type { LeadRecord } from "./leads-store";

/**
 * Gmail SMTP. Port 587 with STARTTLS by default (Hetzner Cloud blocks outbound 465/25 on new servers); set SMTP_PORT=465 to use
 * implicit TLS elsewhere. SMTP_PASS is a Gmail App Password and must only ever live in the server environment.
 */
function getTransport(): Transporter | null {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  if (!user || !pass) return null;
  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

const teamAddress = () => process.env.LEADS_NOTIFY_EMAIL?.trim() || "team.zatgoinnovation@gmail.com";
const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://zatgoinnovation.com").replace(/\/$/, "");

/** Two attempts, then give up: email must never block or fail the lead (which is already stored). */
async function withRetry(label: string, send: () => Promise<unknown>): Promise<boolean> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await send();
      return true;
    } catch (error) {
      console.warn(`lead_email_${label}_failed`, { attempt, error: error instanceof Error ? error.message : String(error) });
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return false;
}

/** Notification to the team inbox; Reply-To is the visitor. No-op when SMTP is not configured. */
export async function sendLeadEmail(lead: LeadRecord): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;
  const { subject, text } = renderTeamEmail(lead);
  const from = process.env.SMTP_USER!.trim();
  return withRetry("team", () => transport.sendMail({ from: `"ZatGo Website" <${from}>`, to: teamAddress(), replyTo: lead.email, subject, text }));
}

/** Confirmation to the visitor; replies go to the team. */
export async function sendVisitorConfirmation(lead: LeadRecord): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;
  const { subject, text, html } = renderVisitorEmail(lead, siteUrl(), teamAddress());
  const from = process.env.SMTP_USER!.trim();
  return withRetry("visitor", () => transport.sendMail({ from: `"ZatGo Innovation" <${from}>`, to: lead.email, replyTo: teamAddress(), subject, text, html }));
}
