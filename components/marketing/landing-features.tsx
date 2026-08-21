import { IconCard, IconLayout, IconShield, IconWebhook } from "@/components/ui/icons";
import { marketingClasses } from "@/lib/ui/marketing-classes";
import type { ComponentType, SVGProps } from "react";

type FeatureIcon = ComponentType<SVGProps<SVGSVGElement>>;

const LANDING_FEATURES: readonly {
  icon: FeatureIcon;
  eyebrow: string;
  title: string;
  body: string;
}[] = [
  {
    icon: IconLayout,
    eyebrow: "App Router",
    title: "Next.js 16, RSC by default",
    body: "App Router, proxy.ts (not middleware.ts), Server Components, and typed routes. Node 20.11+, pnpm 9.15.9 only. You ship product pages — not a framework science project.",
  },
  {
    icon: IconShield,
    eyebrow: "Tenancy",
    title: "Supabase Auth + RLS",
    body: "Every row is scoped by organization_id. JWT identity via getClaims() — never getSession(). The provision trigger creates the org; the form never assigns it. Postgres RLS is the last line of defense.",
  },
  {
    icon: IconCard,
    eyebrow: "Billing",
    title: "Stripe customer per organization",
    body: "The browser never sends a customer id. Portal POST is empty JSON. HMAC constructEvent on the raw body, idempotent stripe_webhook_events ledger, one subscription row per org. Roles: owner, admin, billing.",
  },
  {
    icon: IconWebhook,
    eyebrow: "Fulfillment",
    title: "Lemon Squeezy → GitHub invite",
    body: "HMAC-SHA256 of the raw body vs X-Signature. order_created reads github_username and PUT-invites the buyer as a pull collaborator. Missing username returns 200 skipped — no retry loop.",
  },
];

const TRUST_ORDER = [
  "Browser never sends a customer id",
  "requireUser() → getClaims() (never getSession() for identity)",
  "decidePortalAccess(role, org.stripe_customer_id)",
  "Stripe SDK or constructEvent(rawBody, Stripe-Signature)",
  "claim event.id → upsert subscriptions → mark processed",
] as const;

/**
 * README-backed feature grid: stack, tenancy, Stripe, Lemon — no chat UI.
 *
 * @returns Spec cards plus the billed-mutation trust order.
 */
export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className={marketingClasses.eyebrow}>What ships</p>
        <h2 className={`${marketingClasses.heading} mt-3`}>
          Tenancy is not a middleware afterthought.
        </h2>
        <p className={`${marketingClasses.body} mt-3`}>
          The session resolves <span className="text-zinc-200">organization_id</span>{" "}
          once. Every query, Stripe customer lookup, and billed mutation receives that
          scope explicitly. Wired, typed, and hardened before you write a feature.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {LANDING_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className={`${marketingClasses.card} animate-fade-in p-6 transition duration-200 hover:border-zinc-700 hover:bg-zinc-900/40`}
              style={{ animationDelay: `${120 + index * 70}ms` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
                <Icon className="h-4 w-4" />
              </span>
              <p className={`${marketingClasses.eyebrow} mt-5`}>{feature.eyebrow}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-zinc-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.body}</p>
            </article>
          );
        })}
      </div>

      <article className={`${marketingClasses.card} mt-4 p-6 md:p-8`}>
        <p className={marketingClasses.eyebrow}>Security baseline</p>
        <h3 className="mt-3 text-lg font-medium tracking-tight text-zinc-50">
          Trust order on every billed mutation
        </h3>
        <ol className="mt-6 space-y-3 font-mono text-sm text-zinc-300">
          {TRUST_ORDER.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="w-5 shrink-0 text-zinc-600">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-6 text-zinc-400">
          Service-role is server-only. Zod at every trust boundary.{" "}
          <span className="text-zinc-200">any</span> and{" "}
          <span className="text-zinc-200">as unknown as T</span> are lint errors. Catch
          blocks run through isolateUnknownError. CSP, Referrer-Policy,
          Permissions-Policy, HSTS on Vercel. proxy.ts is not an authorization boundary —
          layouts still call requireUser().
        </p>
      </article>
    </section>
  );
}
