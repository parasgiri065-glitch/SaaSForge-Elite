import { layoutClasses } from "@/lib/ui/layout-classes";

const LANDING_FEATURES = [
  {
    eyebrow: "App Router",
    title: "Next.js 16, RSC by default",
    body: "App Router, proxy.ts (not middleware.ts), Server Components, typed routes, and security headers already locked in. You ship product pages — not a framework science project.",
  },
  {
    eyebrow: "Auth & data",
    title: "Supabase Auth + RLS tenancy",
    body: "Every row is scoped by organization_id. JWT identity via getClaims(), Postgres RLS as the last line of defense, no “default workspace” shortcuts.",
  },
  {
    eyebrow: "Fulfillment",
    title: "Lemon Squeezy webhooks",
    body: "HMAC-verified order_created events invite buyers to GitHub as pull collaborators. Raw body first, JSON second — the same discipline as Stripe.",
  },
  {
    eyebrow: "AI inside the product",
    title: "Groq streaming agent",
    body: "POST /api/ai/stream uses the Vercel AI SDK and the Groq provider. The model never holds tenant keys. The composer locks while tokens stream.",
  },
] as const;

/**
 * Sales-page feature grid for the kit’s actual stack.
 *
 * @returns A 2×2 feature section.
 */
export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm tracking-[0.18em] text-violet-200/80 uppercase">What’s inside</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          The stack you would have built anyway.
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/55 sm:text-base">
          Next.js App Router, Supabase Auth/RLS, Lemon Squeezy webhooks, and Groq
          AI — wired, typed, and isolated before you write a single feature.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {LANDING_FEATURES.map((feature, index) => (
          <article
            key={feature.title}
            className={`${layoutClasses.glassCard} animate-rise p-6`}
            style={{ animationDelay: `${120 + index * 60}ms` }}
          >
            <p className="text-[11px] tracking-[0.16em] text-violet-200/70 uppercase">
              {feature.eyebrow}
            </p>
            <h3 className="mt-2 text-lg font-medium">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
