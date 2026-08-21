import { LICENSE_TIERS } from "@/lib/commerce/store";
import { layoutClasses } from "@/lib/ui/layout-classes";
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
        <p className="text-sm tracking-[0.18em] text-violet-200/80 uppercase">Pricing</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          One payment. The 100-hour tax ends here.
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/55 sm:text-base">
          Commercial license, not MIT. Checkout on Lemon Squeezy — GitHub access is
          invited automatically after payment.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
        {LICENSE_TIERS.map((tier) => (
          <article
            key={tier.id}
            className={cn(
              layoutClasses.glassCard,
              "flex flex-col p-6",
              tier.highlighted && "ring-1 ring-violet-400/40",
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-medium">{tier.name}</h3>
              {tier.highlighted ? (
                <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-violet-100 uppercase">
                  Most teams
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {tier.priceLabel}
              <span className="ml-1 text-sm font-normal text-white/40">USD, once</span>
            </p>
            <p className="mt-2 text-sm text-white/55">{tier.blurb}</p>
            <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-white/70">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "mt-8 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition",
                tier.highlighted
                  ? "bg-white text-zinc-950 shadow-[0_0_36px_rgba(139,92,246,0.28)] hover:scale-[1.02]"
                  : "border border-white/15 bg-white/5 text-white hover:bg-white/10",
              )}
            >
              {tier.ctaLabel}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
