import Link from "next/link";
import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { controlClasses } from "@/lib/ui/layout-classes";
import { cn } from "@/lib/ui/cn";

interface LandingHeroProps {
  displayClassName: string;
}

/**
 * High-converting hero: value prop, stack, store + demo CTAs.
 *
 * @param props.displayClassName - Display font utilities from the homepage.
 * @returns The centered hero section.
 */
export function LandingHero({ displayClassName }: LandingHeroProps) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <p className="animate-rise text-sm tracking-[0.16em] text-violet-200/80 uppercase">
        Next.js 16 SaaS boilerplate
      </p>
      <h1
        className={cn(
          displayClassName,
          "animate-rise mt-4 text-5xl leading-[1.05] text-white sm:text-6xl",
        )}
        style={{ animationDelay: "80ms" }}
      >
        Launch your SaaS in days,
        <br />
        not months.
      </h1>
      <p
        className="animate-rise mx-auto mt-5 max-w-xl text-base text-white/55 sm:text-lg"
        style={{ animationDelay: "160ms" }}
      >
        Stop rebuilding auth, tenancy, billing, and AI. SaaSForge Elite is a
        production Next.js kit — typed, isolated, and ready to sell. One checkout.
        GitHub access lands automatically.
      </p>
      <div
        className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "240ms" }}
      >
        <a
          href={LEMON_SQUEEZY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className={controlClasses.primaryCta}
        >
          Buy the boilerplate
        </a>
        <a href="#pricing" className={controlClasses.secondaryCta}>
          View pricing
        </a>
        <Link href="/demo/agents" className={controlClasses.secondaryCta}>
          Try the live AI agent
        </Link>
      </div>
      <p
        className="animate-rise mt-5 text-xs text-white/35"
        style={{ animationDelay: "320ms" }}
      >
        Standard $149 · Enterprise $349 · Commercial license, not MIT
      </p>
    </section>
  );
}
