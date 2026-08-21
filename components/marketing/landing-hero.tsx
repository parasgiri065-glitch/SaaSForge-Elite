import Link from "next/link";
import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { marketingClasses } from "@/lib/ui/marketing-classes";
import { cn } from "@/lib/ui/cn";

interface LandingHeroProps {
  displayClassName: string;
}

/**
 * High-converting hero: punchy value prop, stack, store + demo CTAs.
 *
 * @param props.displayClassName - Display font utilities from the homepage.
 * @returns The centered hero section.
 */
export function LandingHero({ displayClassName }: LandingHeroProps) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <p className={`${marketingClasses.eyebrow} animate-fade-in`}>
        Command center for your next SaaS
      </p>
      <h1
        className={cn(
          displayClassName,
          "animate-fade-in mt-5 text-5xl leading-[1.05] text-zinc-50 sm:text-6xl lg:text-7xl",
        )}
        style={{ animationDelay: "80ms" }}
      >
        Skip the Setup.
        <span className="mt-1 block">Ship the Product.</span>
      </h1>
      <p
        className="animate-fade-in mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg"
        style={{ animationDelay: "160ms" }}
      >
        The ultimate Next.js 16 boilerplate. Pre-configured with Supabase Auth &amp; RLS,
        Lemon Squeezy automated webhooks, and an integrated Groq AI inference engine.
      </p>
      <div
        className="animate-fade-in mt-10 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "240ms" }}
      >
        <a
          href={LEMON_SQUEEZY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className={marketingClasses.primaryCta}
        >
          Buy the boilerplate
        </a>
        <a href="#pricing" className={marketingClasses.secondaryCta}>
          View pricing
        </a>
        <Link href="/demo/agents" className={marketingClasses.secondaryCta}>
          Try the live AI agent
        </Link>
      </div>
      <p
        className="animate-fade-in mt-6 text-xs text-zinc-500"
        style={{ animationDelay: "320ms" }}
      >
        Standard $149 · Enterprise $349 · Commercial license, not MIT
      </p>
    </section>
  );
}
