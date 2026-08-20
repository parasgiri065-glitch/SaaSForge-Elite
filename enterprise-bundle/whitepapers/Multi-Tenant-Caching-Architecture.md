# Multi-Tenant Caching Architecture

**SaaSForge Elite — Enterprise whitepaper**  
**Audience:** principal engineers shipping the kit to more than one tenant.  
**Companion rules:** `cursorrules/10-edge-caching-isr.cursorrules`, `03-supabase-rls-multitenancy.cursorrules`.

---

## 1. Problem

A cache that cannot name the tenant is a data leak with extra latency
savings. SaaSForge Elite scopes every row by `organization_id` and
enforces that scope in Postgres RLS. HTTP caches, Next.js Data Cache,
CDN edge, and ISR sit **above** Postgres. If they key or purge by URL
alone, they will:

- serve Org A’s billing HTML to Org B’s session (same URL
  `/settings/billing`);
- retain a plan entitlement after `customer.subscription.deleted`;
- skip HMAC webhook handlers because a POST was “already seen”.

This paper defines the isolation boundary, the tag vocabulary, and the
invalidation protocol that keep those failures from shipping.

---

## 2. Isolation boundary (RLS is not a CDN)

```
┌─────────────────────────────────────────────────────────────┐
│  Edge / CDN                                                 │
│  Allowed: public marketing, hashed static assets            │
│  Forbidden: any response that called cookies() or           │
│             requireUser() without Cache-Control: private    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Next.js 16  (proxy.ts + App Router)                        │
│  proxy.ts: session refresh, guest bounce. NOT authz.        │
│  (app)/layout.tsx: requireUser() + force-dynamic            │
│  Data cache keys MUST include organizationId from claims    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Postgres + RLS                                             │
│  organization_id = public.user_organization_id()            │
│  service_role: Stripe/Lemon webhooks only, after HMAC       │
└─────────────────────────────────────────────────────────────┘
```

**RLS is the last line of defense, not the first.** A cached RSC
payload never re-runs `user_organization_id()`. If Org B’s request
hits Org A’s cached flight, RLS never sees Org B. Therefore:

1. Do not put tenant HTML in a shared edge cache.
2. If you cache tenant *data* inside the Node process (Next Data
   Cache), the key and the tag both contain `organizationId`.
3. Webhooks that mutate entitlements must **purge those tags**, not
   “wait for TTL”.

---

## 3. Tag vocabulary

Tags are small, stable strings. They are not secrets, but they must
not be guess-writable from the client.

| Tag | Issued by | Purged by | Payload |
| --- | --- | --- | --- |
| `public:marketing` | landing `generateMetadata` / page | deploy, copy change | `/` HTML, OG |
| `org:{id}:shell` | `requireUser()` layouts | membership change, sign-out | nav, org name |
| `org:{id}:billing` | billing panel / entitlements | Stripe webhook after upsert | plan, invoices |
| `org:{id}:members` | team queries | invite / role update | seats |
| `user:{id}:session` | `getClaims()` path | sign-out, password reset | nothing at CDN |

Rules:

- `{id}` is the UUID from `organizations.id` or `users.id` loaded
  **after** `getClaims()`, never from `?org=` .
- No tag named `billing` without an org prefix.
- No `revalidatePath("/")` to fix a tenant cache. That blows the
  marketing ISR and still misses `/settings/billing` if it was stored
  under a different key.
- `revalidateTag("org:" + organizationId + ":billing")` from the
  **webhook process** after `markStripeWebhookProcessed`.

Suggested helper (client projects):

```ts
export type CacheScope =
  | { kind: "public"; name: "marketing" }
  | { kind: "org"; organizationId: string; facet: "shell" | "billing" | "members" }
  | { kind: "user"; userId: string; facet: "session" };

export function cacheTagFor(scope: CacheScope): string {
  switch (scope.kind) {
    case "public":
      return `public:${scope.name}`;
    case "org":
      return `org:${scope.organizationId}:${scope.facet}`;
    case "user":
      return `user:${scope.userId}:${scope.facet}`;
  }
}
```

Pass that string to `unstable_cache(..., { tags: [...] })` or
`"use cache"` + `cacheTag()`.

---

## 4. Invalidation protocol

### 4.1 Who may purge

| Actor | May purge | Must not purge |
| --- | --- | --- |
| Stripe webhook (`processStripeEvent`) | `org:{id}:billing` of the mapped org | other orgs, `public:marketing` |
| Lemon Squeezy fulfillment | nothing tenant-cached today (GitHub invite is side-effect) | — |
| `requireUser` / sign-out | `user:{id}:session` | other users |
| Deploy | everything | — |
| Browser | nothing | nothing |

A client `fetch("/api/revalidate?tag=org:…")` is forbidden. Purge is
a server privilege, same as `createAdminClient()`.

### 4.2 When to purge vs TTL

- **Entitlements** (plan active / canceled): purge on webhook. TTL is
  a safety net (e.g. 60s) never the primary.
- **Marketing copy**: ISR `revalidate = 3600` or on-demand at deploy.
- **Health**: `no-store`.
- **Webhooks**: never cached. Duplicate Stripe events are handled by
  `stripe_webhook_events.processed_at`, not by HTTP caches.

### 4.3 Ordering with Stripe idempotency

```
constructEvent
  → claim event.id
  → upsert subscriptions (service_role)
  → revalidateTag(org:{id}:billing)   // after the row is visible
  → mark processed_at
```

If you purge before upsert, a concurrent dashboard render can refill
the cache with the **old** plan, then the upsert lands, and the tag is
already clean. Purge after the write commits.

If `processed_at` was already set (duplicate delivery), **skip purge**.
The first delivery already invalidated.

### 4.4 Failure

If `revalidateTag` throws, the webhook should still `markStripeWebhookFailed`
and return 500 so Stripe retries. A tenant seeing a stale plan for one
TTL is better than a silently skipped cancel — but a retry will both
no-op the upsert (same Stripe status) and purge again.

---

## 5. Edge tags and CDN reality

Vercel’s cache uses `x-vercel-cache` (`HIT` / `MISS` / `STALE`).
Cloudflare uses Cache-Tags (Enterprise). Whatever the vendor:

- **Public** documents may send

  `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`  
  plus a marketing tag.

- **Private** documents must send

  `Cache-Control: private, no-store`  
  and **must not** send `s-maxage` or `CDN-Cache-Control: public`.

- `Set-Cookie` and `Cache-Control: public` together are a
  vulnerability. `proxy.ts` sets cookies when refreshing the JWT.
  Those responses stay uncached.

- ISR (“Incremental Static Regeneration”) in App Router is
  time-based revalidation of **static** trees. `(app)` is
  `force-dynamic`. Do not mark it static to chase Lighthouse.

Pinning `regions: ["iad1"]` in `vercel.json` reduces cache-split
across continents for the **public** site. It does not make tenant
caching safe.

---

## 6. RLS data-boundary isolation (how cache and SQL agree)

### 6.1 Dual control

| Layer | Question it answers |
| --- | --- |
| Cache key / tag | “Which org’s bytes are these?” |
| RLS | “May this JWT read that row **right now**?” |

Both are required. Cache without RLS = leaked bytes on a bug.
RLS without cache discipline = leaked bytes on a HIT.

### 6.2 What RLS guarantees (and does not)

Guarantees, given the migrations in this kit:

- `authenticated` cannot `SELECT` another org’s `organizations`,
  `users`, `profiles`, or `subscriptions`.
- `stripe_webhook_events` has **no** policy for `authenticated` →
  default deny. Only service_role writes.
- `user_organization_id()` is `SECURITY DEFINER` and ignores
  client-supplied org ids.

Does **not** guarantee:

- That a cached RSC payload is dropped when the member is removed.
  You must purge `org:{id}:members` and `user:{id}:session` on
  deactivation (`is_active = false`).
- That a CDN will honor `private`. Misconfigured `s-maxage` bypasses
  RLS entirely because the database is never consulted.

### 6.3 Service role and cache

`createAdminClient()` bypasses RLS. It runs only after HMAC. Those
code paths **write**. They must not **read through** a user-tagged
cache (you would mix service-role bytes into a user tag). Admin
reads, if any, use no cache or a tag `admin:stripe:{eventId}` that
users never fetch.

### 6.4 Demo mode

`NEXT_PUBLIC_DEMO_MODE=true` serves Ada Lovelace / Acme Labs with no
Supabase. Demo HTML is public and identical for everyone. Do not tag
it `org:demo-org:billing` as if it were a real tenant — a later real
org must not inherit that tag.

---

## 7. Worked examples

### 7.1 Safe: marketing ISR

`app/page.tsx` has no `cookies()`. `revalidate = 3600`. CDN HIT is
correct. Purge on deploy.

### 7.2 Safe: billing after webhook

Webhook maps `cus_…` → `organizations.id = org_123`, upserts
`subscriptions.status = canceled`, then
`revalidateTag("org:org_123:billing")`. Next dashboard render for
that org misses and reads RLS-filtered SQL.

### 7.3 Unsafe: `unstable_cache` keyed by path

```ts
unstable_cache(() => loadBilling(), ["billing"]) // FORBIDDEN
```

Every tenant shares `["billing"]`. Replace with
`["billing", user.organization_id]` **and**
`tags: ["org:" + user.organization_id + ":billing"]`.

### 7.4 Unsafe: caching `GET /api/stripe/portal`

Portal is POST, empty body, 302/JSON to Stripe. Caching it would
replay another org’s portal URL. Keep `force-dynamic`.

---

## 8. Launch audit (copy into the runbook)

1. Two test orgs, two browsers. Confirm titles, plan chips, and
   invoice numbers never swap under refresh-spam.
2. `curl -I https://<prod>/settings/billing` without cookies →
   redirect, `cache-control` not public.
3. `curl -I https://<prod>/` may be HIT after warm-up.
4. Cancel a test subscription. Dashboard plan flips before 60s
   without a hard deploy.
5. Replay the same Stripe `event.id`. Second webhook 200
   `duplicate`, no extra purge storm.
6. Grep the codebase for `revalidatePath("/")` and
   `unstable_cache` without `organizationId`. Those are bugs.

---

## 9. Summary

Cache **public** documents by URL and time. Cache **tenant** data
only with an org-scoped key **and** tag, issued from `getClaims()`,
purged by the writer (webhooks), with RLS still on every miss.
If the platform cannot tag by org, do not cache the route.

---

Copyright © 2026 Licensor. Licensed only under the SaaSForge Elite
Enterprise / Agency License. Not for public redistribution.
