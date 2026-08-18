# 🚀 Live Demo

**https://temporary-swift-thunder-ubk8aky.vercel.app**

Public Next.js 16 deployment on Vercel. Open the landing page, then **Open live demo** for the dashboard or **Try AI chat** for the streaming agent — no signup required.

# SaaSForge Elite

### **Ship a production-grade, multi-tenant SaaS in a weekend — not a quarter. One clone saves 100+ hours of architecture, auth, billing, and AI plumbing.**

SaaSForge Elite is a premium enterprise boilerplate for teams who refuse to rebuild the same foundation on every product. Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase, Stripe, and a LangChain / OpenAI streaming agent pipeline arrive already wired, typed, and hardened for production.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![LangChain](https://img.shields.io/badge/LangChain-AI%20Agents-1C3C3C?style=for-the-badge)](https://www.langchain.com/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

---

## Why teams start here

| Without SaaSForge Elite | With SaaSForge Elite |
| --- | --- |
| Weeks of auth, tenancy, and billing glue | Multi-tenant RBAC, Stripe, and webhooks on day one |
| Ad-hoc API limits and leaked tenant data | Isolated tenants, signed webhooks, and rate-limited routes |
| SEO and metadata bolted on later | App Router metadata, sitemaps, and OG tags already modeled |
| A chatbot demo taped onto the product | A streaming LangChain / OpenAI agent pipeline with typed tools |

**The 100+ hours you get back:** tenancy schema, RLS policies, invite flows, Stripe Customer + Subscription + Invoice sync, webhook idempotency, usage metering hooks, SEO defaults, rate-limit middleware, and an agent streaming route that already speaks Server-Sent Events.

---

## Tech stack

| Layer | Choice | Role |
| --- | --- | --- |
| App & routing | **Next.js 16 · App Router** | RSC, streaming, route handlers, metadata API |
| Language | **TypeScript (strict)** | End-to-end types from DB → UI → webhooks |
| Styling | **Tailwind CSS** | Design tokens, dark mode, accessible primitives |
| Auth & data | **Supabase** | Email / OAuth, Postgres, Row Level Security |
| Billing | **Stripe** | Subscriptions, customer portal, signed webhooks |
| AI | **LangChain + OpenAI** | Tool-calling agents with token-streamed responses |
| Package manager | **pnpm** | Fast, lockfile-strict, workspace-ready |

---

## Production features

Everything below is treated as a **ship-blocker**, not a backlog item.

### Multi-tenant RBAC

- [x] **Organization = tenant.** Every row is scoped by `org_id`; no shared “default workspace” shortcuts.
- [x] **Roles:** `owner`, `admin`, `member`, `billing`, `viewer` — enforced in Postgres RLS **and** server actions.
- [x] **Invites & seat limits** tied to the active Stripe price, with expired-token rotation.
- [x] **Tenant isolation tests** for cross-org reads, writes, and signed URL leaks.
- [x] **Audit log** for role changes, billing events, and agent tool invocations.

### Metadata & SEO

- [x] **Per-route `generateMetadata`** with title templates, canonicals, and noindex for app shells.
- [x] **Open Graph + Twitter cards** generated from a single typed SEO config.
- [x] **Dynamic `sitemap.ts` / `robots.ts`** that exclude authenticated and preview routes.
- [x] **JSON-LD** helpers for marketing pages (SoftwareApplication, FAQ, Organization).
- [x] **OG image route** (`/api/og`) so launches never ship with a missing social preview.

### Stripe webhook processing

- [x] **Raw-body signature verification** (`stripe.webhooks.constructEvent`) — never parse JSON first.
- [x] **Idempotent event store** keyed by `event.id`; retries are safe and observable.
- [x] **Handled events:** `checkout.session.completed`, `customer.subscription.*`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`.
- [x] **Out-of-order protection** via Stripe `event.created` vs. last-applied timestamp.
- [x] **Reconciliation job** to heal missed deliveries without double-granting entitlements.
- [x] **Customer Portal** + plan-change preview that respects proration and seat counts.

### Secure API rate-limiting

- [x] **Edge middleware limiter** (token bucket) keyed by `org_id` → user → IP fallback.
- [x] **Per-route budgets:** auth, billing, public marketing, and `/api/ai/*` each have their own ceiling.
- [x] **AI stream guardrails:** concurrent-generation cap + token-budget check before the model is called.
- [x] **429 responses** with `Retry-After` and structured error codes — never a generic 500.
- [x] **Abuse signals** (burst + credential stuffing) forwarded to the audit log.

### Also included

- [x] Strict TypeScript, path aliases, and Zod validation at every trust boundary.
- [x] App Router layouts for marketing, auth, and the authenticated dashboard.
- [x] Streaming AI agent route (`text/event-stream`) with cancellable readers.
- [x] Environment validation at boot — the app refuses to start with a silent missing secret.

---

## Architecture at a glance

```
                    ┌─────────────────────────────────────┐
                    │           Next.js 16 (RSC)          │
                    │   marketing · auth · app/(tenant)   │
                    └──────────────┬──────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
   ┌───────────────┐      ┌────────────────┐      ┌─────────────────┐
   │   Supabase    │      │     Stripe     │      │ LangChain Agent │
   │ Auth + RLS DB │      │  Billing + WH  │      │  OpenAI stream  │
   └───────────────┘      └────────────────┘      └─────────────────┘
           │                       │                       │
           └─────────── typed libs in /lib ────────────────┘
```

Tenancy is **not** a middleware afterthought. The session resolves `org_id` once; every query builder, Stripe customer lookup, and agent tool receives that scope explicitly.

---

## Repository structure

A modular surface area so feature teams can own a folder without colliding.

```
SaaSForge-Elite/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── settings/
│   │   │   ├── billing/page.tsx
│   │   │   └── team/page.tsx
│   │   └── agents/[agentId]/page.tsx
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   ├── portal/route.ts
│   │   │   └── webhook/route.ts
│   │   ├── ai/
│   │   │   └── stream/route.ts
│   │   └── health/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
├── components/
│   ├── ui/                    # primitives (button, dialog, input)
│   ├── marketing/
│   ├── billing/
│   ├── team/
│   └── agents/
│       ├── chat-viewport.tsx
│       └── tool-call-trace.tsx
├── hooks/
│   ├── use-tenant.ts
│   ├── use-entitlements.ts
│   ├── use-billing.ts
│   └── use-agent-stream.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── stripe/
│   │   ├── client.ts
│   │   ├── plans.ts
│   │   └── webhook.ts
│   ├── ai/
│   │   ├── agent.ts
│   │   ├── tools.ts
│   │   └── stream.ts
│   ├── rbac.ts
│   ├── rate-limit.ts
│   ├── seo.ts
│   └── env.ts
├── supabase/
│   ├── migrations/
│   │   ├── 0001_tenancy.sql
│   │   ├── 0002_rbac.sql
│   │   ├── 0003_billing.sql
│   │   └── 0004_audit.sql
│   ├── seed.sql
│   └── config.toml
├── types/
│   ├── database.ts            # generated from Supabase
│   ├── billing.ts
│   ├── rbac.ts
│   └── agent.ts
├── middleware.ts              # session + tenant + rate-limit
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **20.11+** (LTS) | Required by Next.js 16 |
| pnpm | **9+** | `corepack enable && corepack prepare pnpm@latest --activate` |
| Supabase CLI | **latest** | Local Postgres + Auth |
| Stripe CLI | **latest** | Forward webhooks to localhost |
| Accounts | — | Supabase project, Stripe (test mode), OpenAI API key |

---

## Local installation

Follow these steps in order. The stack is designed to boot only when required secrets are present.

### 1. Clone and enter the project

```bash
git clone https://github.com/parasgiri065-glitch/SaaSForge-Elite.git
cd SaaSForge-Elite
```

### 2. Enable pnpm (if needed)

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

### 3. Install dependencies

```bash
pnpm install
```

This installs the Next.js 16 workspace, TypeScript, Tailwind, Supabase SDKs, Stripe, LangChain, and OpenAI clients from the lockfile. Do **not** fall back to npm or yarn — lockfile and `preinstall` are pnpm-only.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` (never commit this file):

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="SaaSForge Elite"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_STARTER=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_ENTERPRISE=

# AI
OPENAI_API_KEY=sk-...
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=

# Security
RATE_LIMIT_REDIS_URL=          # optional; in-memory fallback in dev
```

`lib/env.ts` validates this schema at boot. A missing `STRIPE_WEBHOOK_SECRET` or service-role key fails fast instead of shipping a half-configured dashboard.

### 5. Start Supabase locally

```bash
pnpm supabase:start
pnpm supabase:migrate
pnpm supabase:seed
```

This applies tenancy, RBAC, billing, and audit migrations, then loads a demo organization (`Acme Labs`) with an owner and a viewer so you can verify isolation immediately.

### 6. Sync Stripe (test mode)

```bash
stripe login
pnpm stripe:listen
```

`pnpm stripe:listen` forwards events to `http://localhost:3000/api/stripe/webhook` and prints a `whsec_...` signing secret — paste that into `.env.local` and restart the dev server.

Create three recurring Prices in the Stripe Dashboard (Starter / Growth / Enterprise) and map their IDs to the `STRIPE_PRICE_*` variables.

### 7. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next.js 16 dev server with Turbopack |
| `pnpm build` | Production build (typecheck + lint gated) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint + import boundaries |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Unit + tenant-isolation tests |
| `pnpm supabase:reset` | Wipe and re-seed local Postgres |

### 8. Verify the four production paths

1. **RBAC** — invite a second user as `viewer`; confirm they cannot open `/settings/billing`.
2. **SEO** — view-source on `/` and `/pricing`; confirm title template, canonical, and OG tags.
3. **Stripe webhooks** — complete a test Checkout; confirm the org’s plan flips only after a verified, idempotent event.
4. **Rate-limit** — burst `/api/ai/stream`; confirm `429` + `Retry-After` after the org budget is exceeded.

---

## Multi-tenant model (short version)

```
auth.users  1──*  memberships  *──1  organizations
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
                 projects      subscriptions   audit_events
                    │
                    ▼
              agent_runs  (streamed, org-scoped)
```

- RLS policies require `org_id = auth.jwt() -> 'org_id'` (set in a secure cookie + JWT claim on login / tenant switch).
- The Stripe customer is **per organization**, never per user.
- Agent tools receive `ctx.orgId` from the server — the model cannot choose another tenant.

---

## AI agent streaming pipeline

`POST /api/ai/stream` authenticates, checks entitlements and rate limits, then opens an SSE stream:

1. Resolve tenant + role (`member` and above).
2. Bind LangChain tools with `orgId` (search workspace, fetch billing status, draft replies).
3. Stream OpenAI tokens through a TransformStream; the client hook (`use-agent-stream`) renders incrementally.
4. Persist `agent_runs` + tool traces for audit; abort the reader if the client disconnects.

No browser-held OpenAI key. No unscoped “chat with my database” tool.

---

## Security baseline

- Service-role key **server-only**; anon key is RLS-bound.
- Stripe webhook route rejects unsigned or replayed events.
- Rate limits applied in `middleware.ts` before the route handler allocates a model call.
- Zod at every action and route handler — untrusted input never reaches Prisma-style query builders.
- Headers: `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, HSTS in production.

---

## Project scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "supabase:start": "supabase start",
    "supabase:migrate": "supabase db push",
    "supabase:seed": "supabase db execute --file supabase/seed.sql",
    "supabase:reset": "supabase db reset",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/stripe/webhook"
  }
}
```

---

## License

Private / commercial boilerplate. Redistribute only under the license included with your SaaSForge Elite seat.

---

**SaaSForge Elite — stop paying the 100-hour tax on every new SaaS.**
Clone it. Configure it. Ship the product your customers actually asked for.
