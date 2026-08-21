import { IconBolt, IconLayout, IconShield, IconWebhook } from "@/components/ui/icons";
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
    title: "Next.js 16",
    body: "App Router, proxy.ts, Server Components, and typed routes already locked. You ship product pages — not a framework science project.",
  },
  {
    icon: IconShield,
    eyebrow: "Auth & data",
    title: "Supabase Auth & RLS",
    body: "Every row is scoped by organization_id. JWT identity via getClaims(), Postgres RLS as the last line of defense.",
  },
  {
    icon: IconWebhook,
    eyebrow: "Fulfillment",
    title: "Lemon Squeezy webhooks",
    body: "HMAC-verified order_created events invite buyers to GitHub as pull collaborators. Raw body first, JSON second.",
  },
  {
    icon: IconBolt,
    eyebrow: "Inference",
    title: "Groq AI engine",
    body: "POST /api/ai/stream uses the Vercel AI SDK and the Groq provider. Tokens stream into the command center — no mock fallback.",
  },
];

/**
 * Tech-stack feature grid rendered as command-center dashboard cards.
 *
 * @returns A 2×2 feature section.
 */
export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className={marketingClasses.eyebrow}>What’s inside</p>
        <h2 className={`${marketingClasses.heading} mt-3`}>
          A command center, not a starter zip.
        </h2>
        <p className={`${marketingClasses.body} mt-3`}>
          Next.js App Router, Supabase Auth &amp; RLS, Lemon Squeezy webhooks, and Groq AI
          — wired, typed, and isolated before you write a feature.
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
    </section>
  );
}
