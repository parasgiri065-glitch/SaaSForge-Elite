import { IconCheck } from "@/components/ui/icons";
import { LICENSE_TIERS } from "@/lib/commerce/store";
import { marketingClasses } from "@/lib/ui/marketing-classes";
import { cn } from "@/lib/ui/cn";

/**
 * Two-tier license pricing. Both CTAs open the Lemon Squeezy storefront.
 *
 * @returns The marketing pricing section.
 */
export function LandingPricing() {
  return (
    <section id="pricing" className="scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className={marketingClasses.eyebrow}>Pricing</p>
        <h2 className={`${marketingClasses.heading} mt-3`}>
          Stop paying the 100-hour tax on every new SaaS.
        </h2>
        <p className={`${marketingClasses.body} mt-3`}>
          Commercial boilerplate, not MIT. Standard $149 — one production domain.
          Enterprise / Agency $349 — unlimited production apps and client work. Checkout
          on Lemon Squeezy; GitHub access is invited after payment.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2 md:items-stretch">
        {LICENSE_TIERS.map((tier) => {
          const inner = (
            <div
              className={cn(
                "flex h-full flex-col p-7",
                tier.highlighted ? "rounded-[15px] bg-zinc-950" : "",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-medium text-zinc-50">{tier.name}</h3>
                {tier.highlighted ? (
                  <span className="rounded-full border border-violet-400/40 bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-violet-100 uppercase">
                    Most Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-zinc-50">
                {tier.priceLabel}
                <span className="ml-1 text-sm font-normal text-zinc-500">USD, once</span>
              </p>
              <p className="mt-2 text-sm text-zinc-400">{tier.blurb}</p>
              <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm text-zinc-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "mt-8 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition duration-200",
                  tier.highlighted
                    ? "bg-white text-zinc-950 shadow-[0_0_36px_rgba(139,92,246,0.35)] hover:scale-[1.03] hover:shadow-[0_0_48px_rgba(139,92,246,0.55)]"
                    : "border border-zinc-800 bg-zinc-950 text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900",
                )}
              >
                {tier.ctaLabel}
              </a>
            </div>
          );

          if (tier.highlighted) {
            return (
              <article
                key={tier.id}
                className="relative rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 p-[1px] shadow-[0_0_48px_rgba(99,102,241,0.28)]"
              >
                {inner}
              </article>
            );
          }

          return (
            <article key={tier.id} className={`${marketingClasses.card} flex flex-col`}>
              {inner}
            </article>
          );
        })}
      </div>
    </section>
  );
}
