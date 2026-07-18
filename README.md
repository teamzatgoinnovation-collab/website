# `@zatgo/marketing`

Public marketing website for **ZatGo Innovation** — products, downloads, docs/tutorials hubs, updates, pricing, and contact.

## Quick start

```bash
# from repo root
pnpm install
pnpm dev:marketing
# → http://localhost:3000/en
```

Build:

```bash
pnpm --filter @zatgo/marketing build
pnpm --filter @zatgo/marketing start
```

## Stack (shipped)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router · React 19 · TypeScript |
| Style | Tailwind CSS v4 · marketing tokens in `app/globals.css` |
| UI | `@zatgo/ui` (shadcn-style) · `@zatgo/icons` (Lucide) |
| Motion | Framer Motion |
| Forms | React Hook Form · Zod |
| i18n | `next-intl` (English deep-merge fallback) |
| Leads | `POST /api/leads` · Redis/Upstash rate limit · JSONL persist · webhook queue |

## Languages

| Locale | Language | Path | RTL |
|--------|----------|------|-----|
| `en` | English (default) | `/en` | |
| `hi` | Hindi | `/hi` | |
| `ur` | Urdu | `/ur` | yes |
| `ar` | Arabic | `/ar` | yes |
| `ml` | Malayalam | `/ml` | |
| `es` | Spanish | `/es` | |
| `zh` | Chinese | `/zh` | |
| `ja` | Japanese | `/ja` | |
| `tr` | Turkish | `/tr` | |

UI chrome is localized in `messages/{locale}.json`. Missing keys merge from English at request time — production never throws on untranslated strings.

## Routes (shipped)

| Route | Purpose |
|-------|---------|
| `/[locale]` | Home |
| `/[locale]/products` | Product catalog |
| `/[locale]/products/[slug]` | Product detail |
| `/[locale]/downloads` | Mobile · desktop · web downloads |
| `/[locale]/docs` | Docs hub → `NEXT_PUBLIC_DOCS_URL` / `DOWNLOAD_BASE_URL/docs` |
| `/[locale]/tutorials` | Tutorials hub → docs app |
| `/[locale]/case-studies` | Case studies |
| `/[locale]/case-studies/[slug]` | Case study detail |
| `/[locale]/updates` | Changelog |
| `/[locale]/pricing` | Pricing tiers |
| `/[locale]/contact` | Demo / contact form |
| `/[locale]/industries` | Industry positioning |
| `/[locale]/solutions` | Solution positioning |
| `/[locale]/about` | Company |
| `/[locale]/careers` | Open roles |
| `/[locale]/partners` | Partner types |
| `/[locale]/privacy` | Privacy policy |
| `/[locale]/terms` | Terms of use |
| `POST /api/leads` | Lead capture |
| `PUT /api/leads` | Webhook queue drain (secret-protected in production) |

Docs/Tutorials are **hubs only**. Full documentation belongs in `apps/documentation`.

## Environment

Copy [`.env.example`](./.env.example) → `.env.local`. **Never set localhost URLs in production.**

### Site & SEO

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / OG base (required in production) |
| `NEXT_PUBLIC_OG_IMAGE_URL` | Optional override for social preview image |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Contact mailto |
| `NEXT_PUBLIC_PHONE` | Optional phone |
| `NEXT_PUBLIC_WHATSAPP` | Optional WhatsApp |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | Optional address |
| `NEXT_PUBLIC_SUPPORT_URL` | Optional support URL |
| `NEXT_PUBLIC_DOWNLOADS_URL` | Optional nav override for downloads page path |
| `NEXT_PUBLIC_LINKEDIN` / `X` / `YOUTUBE` / `FACEBOOK` | Optional social links |

### Downloads (production)

| Variable | Role |
|----------|------|
| `DOWNLOAD_BASE_URL` | Server-side CDN/base for apps + releases (mirrored to public at build) |
| `NEXT_PUBLIC_DOWNLOAD_BASE_URL` | Same, public (preferred for client cards) |
| `NEXT_PUBLIC_PROJECT_TRACKER_WEB_URL` | Optional override |
| `NEXT_PUBLIC_CUSTOMER_PORTAL_URL` | Optional override |
| `NEXT_PUBLIC_VENDOR_PORTAL_URL` | Optional override |
| `NEXT_PUBLIC_ADMIN_PORTAL_URL` | Optional override |
| `NEXT_PUBLIC_BI_DASHBOARD_URL` | Optional override |
| `NEXT_PUBLIC_CRM_PORTAL_URL` | Optional override |
| `NEXT_PUBLIC_DOCS_URL` | Docs app URL (optional if base URL provides `/docs`) |
| `NEXT_PUBLIC_RELEASES_BASE_URL` | Optional installer CDN (defaults to `{DOWNLOAD_BASE_URL}/releases`) |
| `NEXT_PUBLIC_DOCKER_PLATFORM_URL` | Optional Docker card link |
| `NEXT_PUBLIC_DOCKER_PLATFORM_IMAGE` | Image name shown on Docker card |

`DOWNLOAD_BASE_URL` path map:

- `{base}/apps/project-tracker` · `customer-portal` · `vendor-portal` · `admin-console` · `bi-dashboard` · `crm`
- `{base}/docs`
- `{base}/releases/{fileName}`

In **production**, missing or localhost URLs → download card stays **coming soon** (never links to localhost).

### Lead API

| Variable | Role |
|----------|------|
| `LEADS_WEBHOOK_URL` | Optional CRM/Slack webhook |
| `LEADS_NOTIFY_EMAIL` | Logged marker when leads arrive |
| `LEADS_STORE_DIR` | JSONL directory (default `.data/leads`) |
| `LEADS_RETRY_SECRET` | Required in production for `PUT /api/leads` queue drain |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Preferred serverless rate limit |
| `REDIS_URL` | Classic Redis rate limit (`ioredis`) |

Rate limit order: Upstash → `REDIS_URL` → in-memory fallback. Persist always succeeds before webhook; webhook failures never return HTTP 500.

## Lead capture

1. Validate + honeypot  
2. Redis-backed rate limit (memory fallback)  
3. Append JSONL lead  
4. Queue webhook delivery in `after()` with retries  
5. Client mailto fallback only if persist/API fails  

## Content model

- Structure in `content/*.ts` (products, downloads, changelog, …)
- User-facing strings in `messages/*.json`
- No ERPNext / internal backend names in public copy

## Production checklist

See [Docs/PRODUCTION_CHECKLIST.md](../../Docs/PRODUCTION_CHECKLIST.md).

## Roadmap (not built yet)

**Pages:** Blog · RSS  

**Contact:** Newsletter · maps embed  

**Ops:** CMS · analytics suite · A/B · localization dashboard  

---

Related: [FRONTEND_STACK.md](../../Docs/Foundation/FRONTEND_STACK.md) · [PRODUCT_CATALOG.md](../../Docs/Foundation/PRODUCT_CATALOG.md)
