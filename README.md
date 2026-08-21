# 🚀 Live Demo

**https://saasforge-elite.vercel.app**

Public Next.js 16 deployment on Vercel. Open the landing page, then **Open live demo** for the dashboard — no signup required.

If Vercel asks for a **Project Name**, use exactly: `saasforge-elite` (lowercase, no spaces). The GitHub repo name `SaaSForge-Elite` is rejected by Vercel’s slug rules.

---

# SaaSForge Elite

### **Ship a production-grade, multi-tenant SaaS in a weekend — not a quarter. One clone saves 100+ hours of architecture, auth, billing, and AI plumbing.**

SaaSForge Elite is a premium enterprise boilerplate for teams who refuse to rebuild the same foundation on every product. Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase, Stripe, and a streaming AI agent arrive already wired, typed, and hardened.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20RLS-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9.15-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

| | |
| --- | --- |
| **Clone** | `git clone https://github.com/parasgiri065-glitch/SaaSForge-Elite.git` |
| **Install** | `pnpm install` — pnpm only, Node 20.11+ |
| **Buy** | [elitesaasforge.lemonsqueezy.com](https://elitesaasforge.lemonsqueezy.com/) — Standard **$149** · Enterprise **$349** |
| **License** | See [LICENSE.md](./LICENSE.md) |

---

## Table of contents

1. [Architecture visual map](#architecture-visual-map)
2. [Repository structure](#repository-structure)
3. [Quick Start for Beginners](#quick-start-for-beginners)
4. [Local installation](#local-installation)
5. [Troubleshooting missing environment keys](#troubleshooting-missing-environment-keys)
6. [Security baseline](#security-baseline)
7. [License](#license)

---

## Architecture visual map

Tenancy is **not** a middleware afterthought. The session resolves `organization_id` once. Every query, Stripe customer lookup, and agent tool receives that scope explicitly. The Stripe customer is **per organization**, never per user.

```
                         ┌──────────────────────────────────────────┐
                         │         Browser  (App Router)            │
                         │  landing · /login · /signup · /dashboard │
                         │  /settings/billing · /agents · /demo/*   │
                         └────────────────────┬─────────────────────┘
                                              │
                    NEXT_PUBLIC_* keys only   │   cookies (JWT)
                                              ▼
                         ┌──────────────────────────────────────────┐
                         │     Next.js 16  ·  proxy.ts (edge)       │
                         │  refresh session · bounce guests to login│
                         │  NOT the auth boundary — layouts still   │
                         │  call getClaims() / requireUser()        │
                         └──────┬─────────────────────────┬─────────┘
                                │                         │
               RSC / Server     │                         │  Route handlers
               Components       │                         │
                                ▼                         ▼
                    ┌─────────────────────┐    ┌─────────────────────────┐
                    │  lib/supabase       │    │  app/api/*              │
                    │  server.ts  RLS on  │    │  /webhooks/stripe  HMAC │
                    │  admin.ts   after   │    │  /stripe/portal    401/ │
                    │  signature verify   │    │  /health           403  │
                    └──────────┬──────────┘    └───────────┬─────────────┘
                               │                           │
                               ▼                           ▼
                    ┌─────────────────────┐    ┌─────────────────────────┐
                    │  Supabase Postgres  │    │  Stripe                 │
                    │  organizations      │◄──►│  Customer (per org)     │
                    │  users · profiles   │    │  Subscription · Invoice │
                    │  subscriptions      │    │  Customer Portal        │
                    │  stripe_webhook_    │    │  signed webhooks        │
                    │  events  (idempotent)    └─────────────────────────┘
                    └─────────────────────┘
```

**Trust order on every billed mutation**

```
1. Browser never sends a customer id
2. requireUser()  →  getClaims()  (never getSession() for identity)
3. decidePortalAccess(role, org.stripe_customer_id)
4. Stripe SDK  OR  constructEvent(rawBody, Stripe-Signature)
5. claim event.id  →  upsert subscriptions  →  mark processed
```

---

## Repository structure

A modular surface so a feature team can own a folder without colliding. Every path below is what ships in this repo today. Comments on the right are the **job of that directory**, not a file listing.

```
SaaSForge-Elite/
│
├── app/                          Next.js 16 App Router. RSC by default.
│   ├── page.tsx                  Public marketing landing.
│   ├── layout.tsx                Root chrome, fonts, Auth + Theme providers.
│   ├── error.tsx · global-error.tsx · not-found.tsx
│   │
│   ├── (auth)/                   Unauthenticated shell. Bounces signed-in users.
│   │   ├── login/                Email/password sign-in form.
│   │   ├── signup/               Creates auth user + owner org (via DB trigger).
│   │   └── callback/route.ts     PKCE code exchange; `next` is same-origin only.
│   │
│   ├── (app)/                    Authenticated workspace. layout calls requireUser().
│   │   ├── dashboard/            Tenant overview (org, role, plan).
│   │   ├── agents/               Streaming AI chat viewport.
│   │   └── settings/
│   │       ├── billing/          Plan card, invoices, Manage Subscription.
│   │       └── team/             Seat placeholder (invites stay behind RLS).
│   │
│   ├── demo/                     Public mock workspace (Ada Lovelace / Acme Labs).
│   │                             No live keys required. Prefix /demo is public.
│   │
│   └── api/
│       ├── health/               Liveness probe. No secrets, no DB.
│       ├── ai/stream/            Groq (Vercel AI SDK) text stream. No mock.
│       ├── stripe/portal/        POST empty body → Stripe Customer Portal URL.
│       └── webhooks/
│           ├── stripe/           HMAC verify, idempotent event apply.
│           │                     Rewrite: /api/stripe/webhook → this route.
│           └── lemonsqueezy/     HMAC `X-Signature` → GitHub `pull` invite.
│
├── components/                   UI only. No Stripe, no service-role, no SQL.
│   ├── agents/                   Chat bubbles, composer, markdown stream, tool trace.
│   ├── auth/                     Login / signup forms, require-auth gate, sign-out.
│   ├── billing/                  Plan card, invoice table, portal button.
│   ├── dashboard/                Metric tiles shared by live + demo dashboards.
│   ├── layout/                   Sidebar, topbar, mobile drawer, atmosphere.
│   ├── marketing/                Landing header, hero, features, product stage.
│   ├── providers/                AuthContext, live vs demo auth, theme.
│   ├── system/                   Shared error-boundary fallback card.
│   └── ui/                       Button variants, text field, inline SVG icons.
│
├── hooks/                        One concern per hook. UI state ≠ data fetching.
│   ├── use-live-auth-session.ts  Supabase session + tenant hydration.
│   ├── use-user-subscription-state.ts
│   │                             Plan tier + Stripe customer derived from auth.
│   ├── use-stripe-billing-portal.ts
│   │                             POST /api/stripe/portal; surfaces typed errors.
│   ├── use-agent-stream.ts       Transcript + POST /api/ai/stream (Groq).
│   ├── use-composer-draft.ts     Composer text only (no network).
│   ├── use-mobile-navigation.ts  Drawer open/close + body scroll lock.
│   ├── use-stick-to-bottom-scroll.ts
│   ├── use-login-form.ts · use-signup-form.ts
│   └── use-theme-preference.ts   light/dark + localStorage.
│
├── lib/                          Server-capable domain logic. Import with @/*.
│   ├── auth/                     JWT guards, requireUser, Zod sign-in/up, demo tenant.
│   ├── billing/                  Pure portal authorization (401 / 403 / 409).
│   ├── stripe/                   HMAC inspect, payload parsers, org sync, handlers.
│   │                             Cryptographically verified webhook signatures
│   │                             live here — never JSON.parse the body first.
│   ├── lemonsqueezy/             X-Signature HMAC + order_created payload parse.
│   ├── github/                   PUT collaborator invite (`permission: pull`).
│   ├── supabase/                 Browser / server / admin clients + Zod row schemas.
│   ├── security/                 Zod env schema + API body/query schemas.
│   ├── errors/                   isolateUnknownError — typed catch → UI/API alerts.
│   ├── http/                     JSON responses, empty-body inspect, parseJsonUnknown.
│   ├── crypto/                   Web Crypto IDs (no Math.random).
│   ├── markdown/                 Streaming-safe markdown subset parser.
│   ├── agents/                   Chat message factories + demo stream.
│   ├── ui/                       cn() + semantic Tailwind variants.
│   ├── theme/                    Shared localStorage key for the boot script.
│   ├── types/                    Compile-time AssertEqual / object-record guards.
│   ├── env.ts                    Public env (client-safe). Zod-parsed.
│   └── env.server.ts             Server secrets. `import "server-only"`.
│
├── supabase/                     Schema is source of truth. RLS on every table.
│   ├── migrations/
│   │   ├── 0001_tenancy.sql      organizations, users, profiles + provision trigger.
│   │   ├── 0002_rls.sql          Default-deny policies + role helpers.
│   │   └── 0003_billing.sql      subscriptions + stripe_webhook_events ledger.
│   └── seed.sql                  Local Acme Labs fixture.
│
├── types/                        Shared domain types. No runtime code.
│   ├── database.ts               SQL columns 1:1. Insert/Update derived from Row.
│   ├── auth.ts                   TenantUser = User + profile/org/subscription.
│   ├── billing.ts                Plan tier, invoices, status guards.
│   ├── rbac.ts                   APP_ROLES, BILLING_ROLES, hasRole().
│   └── agent.ts                  ChatMessage / stream events.
│
├── tests/                        Vitest. Included in `pnpm typecheck`.
│   ├── auth/ · billing/ · stripe/ · supabase/ · security/ · errors/ · ui/
│
├── proxy.ts                      Next.js 16 request boundary (NOT middleware.ts).
├── next.config.ts                CSP, HSTS on Vercel, webhook path rewrite.
├── vercel.json                   Project name must be saasforge-elite.
├── .env.example                  The only env file that is committed.
├── LICENSE.md                    Personal $149 · Enterprise $349.
├── package.json                  pnpm@9.15.9 · engines.node >= 20.11.0
└── README.md                     You are here.
```

---

## Quick Start for Beginners

This is the code execution pipeline — how a click in the UI becomes a row in Postgres and a customer in Stripe. Read it top to bottom the first time you clone.

### The three moving parts

| Layer | What the beginner touches | What actually runs |
| --- | --- | --- |
| **Frontend form** | `/signup`, `/login`, **Manage Subscription** | Client components + hooks. Never hold the service-role key. |
| **Supabase** | `.env.local` URL + anon key | Auth users, tenant rows, RLS. Provisioning trigger creates the org. |
| **Stripe gateway** | Test API keys + `pnpm stripe:listen` | Customer (per org), subscription, signed webhooks back into Postgres. |

### Pipeline A — Create a workspace (signup → database)

| Step | Where | What happens |
| ---: | --- | --- |
| 1 | `components/auth/signup-form.tsx` | User submits name, org, email, password. |
| 2 | `hooks/use-signup-form.ts` | Field state. Calls `signUp()` from auth context. |
| 3 | `hooks/use-live-auth-session.ts` | Zod `signUpSchema`, then `supabase.auth.signUp()`. |
| 4 | Supabase Auth | Inserts `auth.users`. Fires `handle_new_user()`. |
| 5 | `0001_tenancy.sql` trigger | Inserts `organizations` (owner) + `users` + `profiles`. `organization_id` is assigned **by the server**, never from the form. |
| 6 | `app/(auth)/callback/route.ts` | If email confirm is on: PKCE `code` → session. `next` must be a same-origin path. |
| 7 | `lib/auth/require-user.ts` | `getClaims()` (not `getSession()`) → `loadTenantUser()` → dashboard. |

```
[ Signup form ]
      │  email, password, fullName, organizationName
      ▼
[ useSignupForm / useLiveAuthSession ]
      │  Zod  →  supabase.auth.signUp()
      ▼
[ Supabase Auth  auth.users ]
      │  AFTER INSERT trigger
      ▼
[ public.organizations  +  public.users  +  public.profiles ]
      │  RLS: caller only sees their organization_id
      ▼
[ /dashboard ]  requireUser() + tenant graph
```

### Pipeline B — Manage billing (button → Stripe → webhook → database)

The browser **never** sends a Stripe customer id. The org’s `cus_…` is read from Postgres after the JWT is verified.

| Step | Where | What happens |
| ---: | --- | --- |
| 1 | `Manage Subscription` button | `useStripeBillingPortal` POSTs **empty JSON** to `/api/stripe/portal`. |
| 2 | `app/api/stripe/portal/route.ts` | Rejects extra body fields. `getVerifiedTenantUser()`. |
| 3 | `lib/billing/portal-access.ts` | `401` no user · `403` wrong role · `409` no `stripe_customer_id`. Roles allowed: `owner`, `admin`, `billing`. |
| 4 | Stripe API | `billingPortal.sessions.create({ customer, return_url })`. Browser redirects to Stripe. |
| 5 | Customer pays / changes plan | Stripe emits `invoice.paid`, `customer.subscription.*`, `checkout.session.completed`. |
| 6 | `POST /api/webhooks/stripe` | Raw body + `Stripe-Signature`. **Never `JSON.parse` first.** `constructEvent`. |
| 7 | `lib/stripe/webhook-idempotency.ts` | Claim `event.id` in `stripe_webhook_events`. Duplicates return 200. |
| 8 | `lib/stripe/subscription-sync.ts` | Map customer → `organizations`, upsert `subscriptions` (one row per org). |
| 9 | Billing UI | `useUserSubscriptionState` reads the joined tenant subscription. Plan label comes from `stripe_price_id`. |

```
[ Billing button ]
      │  POST /api/stripe/portal   body = {} 
      ▼
[ requireUser + decidePortalAccess ]
      │  customer id from organizations.stripe_customer_id
      ▼
[ Stripe Customer Portal ]
      │  user changes plan / pays
      ▼
[ Stripe → POST /api/webhooks/stripe ]
      │  HMAC  →  claim event.id  →  upsert subscriptions
      ▼
[ public.subscriptions  (status, price, period) ]
      │
      ▼
[ SubscriptionCard  /  InvoiceTable ]
```

### Pipeline C — Public demo (no keys)

Set `NEXT_PUBLIC_DEMO_MODE=true`. `AuthProvider` mounts `DemoAuthProvider` (Ada Lovelace / Acme Labs). `/demo/*` is a public path. No Supabase, no Stripe. Use this on Vercel when you only need the landing + clickable dashboard.

### Pipeline D — Store fulfillment (Lemon Squeezy → GitHub invite)

Checkout must send `custom_data.github_username`. The webhook never trusts an unsigned body.

| Step | Where | What happens |
| ---: | --- | --- |
| 1 | Lemon Squeezy `order_created` | POST `/api/webhooks/lemonsqueezy` with `X-Signature`. |
| 2 | `lib/lemonsqueezy/verify-signature.ts` | HMAC-SHA256 of the **raw** body vs `LEMONSQUEEZY_WEBHOOK_SECRET`. 400 if invalid. |
| 3 | Zod payload | Ignore any event other than `order_created` (200). |
| 4 | `meta.custom_data.github_username` | Must be a legal GitHub login. Missing/invalid → 200 skipped (no retry loop). |
| 5 | `PUT api.github.com/repos/{owner}/{repo}/collaborators/{user}` | `Authorization: Bearer GITHUB_PAT_TOKEN`, `permission: "pull"`. |
| 6 | GitHub | `201` invitation sent · `204` already a collaborator · else 500 so Lemon retries. |

---

## Local installation

### Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **20.11+** (LTS) | Required by Next.js 16 |
| pnpm | **9.15.9** | `corepack enable && corepack prepare pnpm@9.15.9 --activate` |
| Supabase CLI | latest | Local Postgres + Auth |
| Stripe CLI | latest | Forward webhooks to localhost |

### 1. Clone and install

```bash
git clone https://github.com/parasgiri065-glitch/SaaSForge-Elite.git
cd SaaSForge-Elite
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
```

Do **not** fall back to npm or yarn.

### 2. Environment file

```bash
cp .env.example .env.local
```

Never commit `.env.local`. The only env file in git is `.env.example`.

### 3. Database and Stripe (live mode)

```bash
pnpm supabase:start
pnpm supabase:migrate
pnpm supabase:seed

stripe login
pnpm stripe:listen          # prints whsec_…  → paste into .env.local, restart
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Demo mode (no keys)

```bash
NEXT_PUBLIC_DEMO_MODE=true pnpm dev
```

Then open `/demo/dashboard`.

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next.js 16 + Turbopack |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint (`any` banned, `@/*` imports only) |
| `pnpm typecheck` | `tsc --noEmit` including tests |
| `pnpm test` | Vitest |
| `pnpm stripe:listen` | Forward to `/api/webhooks/stripe` |

---

## Troubleshooting missing environment keys

Env is parsed by Zod in `lib/security/env-schema.ts`. Public keys boot through `lib/env.ts`. Server secrets are **lazy** (`lib/env.server.ts`) so the public demo can start without Stripe — they throw the first time a secret is actually read.

Placeholders containing `YOUR_` are **rejected**. Copying `.env.example` without replacing values is the #1 failure mode.

### What you will see

| Symptom | Missing / invalid key | What to check |
| --- | --- | --- |
| Boot error: `Missing public environment variable for "supabaseUrl"` | `NEXT_PUBLIC_SUPABASE_URL` | Dashboard → Project Settings → API → Project URL. Local CLI is `http://127.0.0.1:54321`. No trailing slash. Empty string is allowed only for demo; a non-empty value must be a valid URL. |
| Boot error: same, for `"supabaseAnonKey"` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or publishable alias) | API → `anon` / `publishable` key. Either name works; `lib/env.ts` falls back. |
| `[SaaSForge] Invalid or missing server secret "SUPABASE_SERVICE_ROLE_KEY"` | `SUPABASE_SERVICE_ROLE_KEY` | API → `service_role`. Server-only. If the value still contains `YOUR_`, Zod refuses it. First thrown when a webhook uses `createAdminClient()`. |
| Same, `"STRIPE_SECRET_KEY"` | `STRIPE_SECRET_KEY` | Developers → API keys. Use `sk_test_…` until go-live. Thrown when `getStripe()` runs (portal or webhook). |
| Same, `"STRIPE_WEBHOOK_SECRET"` | `STRIPE_WEBHOOK_SECRET` | Local: `pnpm stripe:listen` prints `whsec_…` — paste and **restart** `pnpm dev`. Prod: Webhooks → endpoint signing secret. Thrown in `constructEvent`. |
| Portal button → `409 no_customer` | Org has no `stripe_customer_id` | Complete a Checkout in test mode (or attach a customer in Studio). Not an env miss — the tenant row is empty. |
| Portal button → `403 forbidden` | Role is `member` / `viewer` | Sign in as `owner`, `admin`, or `billing`. |
| Portal button → `401 unauthorized` | Session missing / inactive | Sign in again. `getClaims()` failed or `is_active = false`. |
| Webhook `400 invalid_signature` | `STRIPE_WEBHOOK_SECRET` mismatch | Local secret from `stripe listen` is **not** the Dashboard secret. Don’t mix them. Restart after pasting. |
| Webhook `400 empty_body` / `missing_stripe_signature` | Request never reached the raw-body handler | Confirm the CLI forwards to `/api/webhooks/stripe` (or `/api/stripe/webhook`, which rewrites). Do not put a JSON parser in front of this route. |
| Webhook `400 payload_too_large` | Body > 1,048,576 bytes | Not env. Inspect the Stripe event; this is a guard, not a misconfig. |
| Landing works, dashboard is Ada Lovelace | `NEXT_PUBLIC_DEMO_MODE=true` **or** public Supabase keys empty | Expected. Set `NEXT_PUBLIC_DEMO_MODE=false` and fill URL + anon key for live auth. |
| Vercel deploy boots but portal/webhooks 500 | Server secrets not set **in the Vercel project** | Project → Settings → Environment Variables. Names must match `.env.example` exactly. Redeploy after saving. Project name: `saasforge-elite`. |
| OAuth callback → `/login?error=invalid_callback` | `NEXT_PUBLIC_APP_URL` wrong origin | Must be the canonical origin (`http://localhost:3000` or `https://your-domain.com`), no trailing slash. Also check `next` is a relative path, not `https://evil`. |
| `placeholder secret` in the throw message | Any server key still contains `YOUR_` | Replace the whole value. Trimming is not enough if `YOUR_` remains. |
| Lemon webhook `400 invalid_signature` | `LEMONSQUEEZY_WEBHOOK_SECRET` | Settings → Webhooks → signing secret. Must match the endpoint that posts to `/api/webhooks/lemonsqueezy`. |
| Lemon webhook `400 missing_x_signature` | No `X-Signature` header | Confirm Lemon Squeezy is posting to this app, not a proxy that strips headers. |
| Lemon webhook `200 skipped` | `meta.custom_data.github_username` missing/invalid | Pass `{ "github_username": "<login>" }` as checkout custom data. |
| Lemon webhook `500 github_invite_failed` | `GITHUB_PAT_TOKEN` / `GITHUB_OWNER` / `GITHUB_REPO` | PAT needs collaborator invite rights on that repo. Owner/repo must exist. |
| Chat shows `API Key missing in environment` | `GROQ_API_KEY` | Set it in `.env.local` and Vercel Production, then Redeploy. There is no mock stream. |

### Checklist (run in order)

1. `cp .env.example .env.local` — then **replace every `YOUR_`**.
2. Confirm the file is named `.env.local` (Next.js does not load `.env.production` in `pnpm dev`).
3. Restart `pnpm dev` after every env edit. Next inlines `NEXT_PUBLIC_*` at boot.
4. `pnpm stripe:listen` running in a second terminal if you expect webhooks.
5. On Vercel: Production + Preview env both filled; no `YOUR_` leftovers.

### Where keys are allowed to live

| Key | Browser bundle | Server | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | yes | yes | OAuth redirect + portal `return_url` |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | yes | yes | RLS-bound. Never the service role. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | yes | yes | `pk_test_` / `pk_live_` |
| `NEXT_PUBLIC_DEMO_MODE` | yes | yes | `"true"` to skip live Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **never** | webhook only | `lib/env.server.ts` + `server-only` |
| `STRIPE_SECRET_KEY` | **never** | portal + webhook | |
| `STRIPE_WEBHOOK_SECRET` | **never** | webhook HMAC | |
| `STRIPE_PRICE_*` | no | mapping plan names | |
| `OPENAI_API_KEY` | **never** | future `/api/ai/stream` | Safe to leave blank for the demo chat |

---

## Security baseline

- Service-role key **server-only**; anon key is RLS-bound.
- Stripe webhook route rejects unsigned, empty, or oversized payloads before crypto.
- `proxy.ts` is **not** an authorization boundary. Layouts and route handlers call `getClaims()` / `requireUser()`.
- Zod at every trust boundary. `any` and `as unknown as T` are lint errors.
- Catch blocks run through `isolateUnknownError` before a UI/API alert is built.
- Headers: `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, HSTS on Vercel.

---

## License

Commercial boilerplate. **Standard $149** — one production domain. **Enterprise / Agency $349** — unlimited production apps and client work.

**Buy:** [https://elitesaasforge.lemonsqueezy.com/](https://elitesaasforge.lemonsqueezy.com/)

See [LICENSE.md](./LICENSE.md). AS-IS, no warranty.

---

**SaaSForge Elite — stop paying the 100-hour tax on every new SaaS.**
Clone it. Configure it. Ship the product your customers actually asked for.
