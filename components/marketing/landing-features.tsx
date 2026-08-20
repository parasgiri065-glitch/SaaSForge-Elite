import { layoutClasses } from "@/lib/ui/layout-classes";

const LANDING_FEATURES = [
  {
    title: "Multi-tenant by default",
    body: "Every row is scoped by organization. RLS and server guards agree — no shared workspace shortcuts.",
  },
  {
    title: "Billing that stays honest",
    body: "Signed Stripe webhooks, idempotent events, and entitlements that flip only after verification.",
  },
  {
    title: "An agent inside the product",
    body: "Streaming answers, a locked composer, tenant-bound tools. The model never holds the keys.",
  },
] as const;

/**
 * Three-up feature grid on the marketing landing page.
 *
 * @returns A responsive grid of glass feature cards.
 */
export function LandingFeatures() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {LANDING_FEATURES.map((feature, index) => (
        <article
          key={feature.title}
          className={`${layoutClasses.glassCard} animate-rise p-5`}
          style={{ animationDelay: `${380 + index * 70}ms` }}
        >
          <h2 className="text-lg font-medium">{feature.title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">{feature.body}</p>
        </article>
      ))}
    </section>
  );
}
