# Architecture: `@zatgo/marketing` and the ZatGo backend

This document defines the boundary between this Next.js marketing website and the rest of
the ZatGo stack. It exists so future work on this repo doesn't accidentally turn the
marketing site into a second business backend.

## Current state (as of this audit)

**This website has no ERPNext/Frappe integration today.** Confirmed by direct audit:

- No code anywhere in `app/`, `components/`, `content/`, or `lib/` calls an ERPNext/Frappe
  URL or `/api/resource/*` endpoint. "ERPNext" only appears as a **product name** (ZatGo
  sells ERPNext hosting as a product) and as a **marketing feature label**
  ("ERPNext integration" in the VanSale pricing feature list) — never as an actual API call.
- No ERPNext/Frappe credentials, API keys, or secrets exist anywhere in this repo.
- No direct database access exists. The only datastore dependency is `ioredis`, used
  exclusively for lead-form rate limiting (`lib/leads-rate-limit.ts`) — never for business
  data (customers, invoices, stock, accounting, payments).
- The only server-side "backend" this site talks to today is itself: `POST /api/leads`
  validates and persists contact/demo form submissions to a local JSONL file, then
  optionally relays them to `LEADS_WEBHOOK_URL` and/or sends an email via SMTP.

This means there is currently **no `zatgo-core` integration to refactor** — the boundary
described below is the target for when that integration is built, not a description of
existing code.

## Layered responsibility

```
Browser (marketing pages, product pages, forms)
        │
        ▼
Next.js server (API routes / server actions)   ← this repo's only privileged layer
        │
        ▼
zatgo-core (ZatGo business/API layer)           ← separate repo, not built into this site
        │
        ▼
ERPNext / Frappe                                 ← authoritative business backend
        │
        ▼
Database (MariaDB)                               ← ERPNext-owned, never touched directly
```

Flutter (VanSale mobile) talks to `zatgo-core` directly and does not go through this
website. This site and the mobile app are two independent clients of the same backend.

### What belongs in Next.js (this repo)

Marketing, product/pricing presentation, SEO, localization, lead capture, and initiating
SaaS actions (demo requests, contact, eventually signup). Every current page in `app/`
falls into this category.

### What must never live in Next.js

Accounting, inventory/stock ledgers, sales posting, VAT/ZATCA invoice processing, customer
ledgers, payment processing, or direct ERPNext DocType manipulation. If a future feature
needs any of this, the actual business logic belongs in `zatgo-core`; this site should only
call a controlled API and render the result.

## Integration boundary (for when it's built)

When this site needs to talk to `zatgo-core`/ERPNext, the rule is:

1. **Server-side only.** All calls go through a Next.js API route or server action —
   never a `fetch()` inside a client component. Follow the existing pattern in
   `app/api/leads/route.ts`: validate input server-side (Zod), never trust client-provided
   identifiers, never leak internal error detail to the response.
2. **Centralized client, not scattered URLs.** A future integration should live in a single
   module (e.g. `lib/integrations/zatgo-core.ts`), not `fetch()` calls hand-written into
   individual routes or components — mirrors how `lib/leads-store.ts` and
   `lib/lead-email.ts` already centralize the leads side-effects.
3. **Business-oriented endpoints, not raw ERPNext resources.** Call
   `zatgo-core`-defined endpoints (e.g. `/api/vansale/request-demo`), never
   `/api/resource/<DocType>` directly. `zatgo-core` owns DocType shape and validation;
   this site should not need to know it.
4. **Secrets stay server-side.** Any `zatgo-core`/ERPNext API key or secret is a plain
   (non-`NEXT_PUBLIC_`) environment variable, read only in server code. The existing
   `.env.example` pattern already separates public config
   (`NEXT_PUBLIC_*`, e.g. product portal URLs, social links) from private config
   (`SMTP_USER`/`SMTP_PASS`, `LEADS_WEBHOOK_URL`, `LEADS_RETRY_SECRET`) — extend that same
   split, don't introduce a new pattern.
5. **No client-supplied tenant/site selection.** If multi-tenant resolution is ever needed
   here, the tenant/site mapping is resolved server-side from an authenticated identity
   (e.g. account email → tenant → ERPNext site), never from a client-passed site ID or URL.

## What is NOT implemented and would require `zatgo-core` work first

These are real gaps, not something this repo should fake:

- **VanSale signup/onboarding API.** Today "Get started" and "Contact sales" on
  `/products/vansale` route to the existing `/contact` lead form — there is no self-serve
  signup, account creation, or tenant provisioning. Building that requires `zatgo-core`
  endpoints for account/tenant/site creation; this site should not create ERPNext records
  directly even once such a flow exists.
- **Multi-tenant account model.** No `ZatGo Account → subscription → ERPNext site` mapping
  exists anywhere in this stack today (confirmed: this repo has no auth, no accounts, no
  tenant concept). This needs to be designed in `zatgo-core` before the website can surface
  any tenant-aware UI.
- **Free trial.** VanSale pricing CTAs intentionally say "Get started" / "Contact sales",
  not "Start free trial" — no self-serve trial infrastructure exists today, so the copy
  doesn't claim one.
- **ZATCA compliance claims.** VanSale marketing copy currently says the product is
  "designed to support Saudi e-invoicing workflows" — it does not and must not claim ZATCA
  certification unless that certification is legally confirmed by the business.

## Security checklist (verified against this repo)

- [x] No `NEXT_PUBLIC_*` variable holds a secret (all are public URLs/contact info).
- [x] All privileged env vars (`SMTP_USER`, `SMTP_PASS`, `LEADS_WEBHOOK_URL`,
      `LEADS_RETRY_SECRET`, `UPSTASH_REDIS_REST_TOKEN`, `REDIS_URL`) are read only in
      server-side files under `lib/` and `app/api/`.
- [x] No direct database client for business data anywhere in the repo.
- [x] `POST /api/leads` validates all input server-side with Zod and includes a honeypot
      field; the `PUT /api/leads` queue-drain endpoint requires `LEADS_RETRY_SECRET` in
      production.
- [x] No ERPNext/Frappe credentials or Administrator-level access exist in this repo.
