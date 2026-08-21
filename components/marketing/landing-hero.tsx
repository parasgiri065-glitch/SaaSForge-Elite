import Link from "next/link";
import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { marketingClasses } from "@/lib/ui/marketing-classes";
import { cn } from "@/lib/ui/cn";

interface LandingHeroProps {
  displayClassName: string;
}

const STACK_PILLS = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "Stripe",
  "pnpm 9.15",
] as const;

/**
 * Hero copy taken from the README value proposition — no chat CTAs.
 *
 * @param props.displayClassName - Display font utilities from the homepage.
 * @returns The centered hero section.
 */
export function LandingHero({ displayClassName }: LandingHeroProps) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <p className={`${marketingClasses.eyebrow} animate-fade-in`}>
        Premium enterprise boilerplate
      </p>
      <h1
        className={cn(
          displayClassName,
          "animate-fade-in mt-5 text-4xl leading-[1.08] text-zinc-50 sm:text-5xl lg:text-6xl",
        )}
        style={{ animationDelay: "80ms" }}
      >
        Ship a production-grade, multi-tenant SaaS in a weekend — not a quarter.
      </h1>
      <p
        className="animate-fade-in mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg"
        style={{ animationDelay: "160ms" }}
      >
        One clone saves 100+ hours of architecture, auth, and billing. Next.js 16 (App
        Router), TypeScript, Tailwind CSS, Supabase, and Stripe arrive already wired,
        typed, and hardened.
      </p>
      <ul
        className="animate-fade-in mt-8 flex flex-wrap items-center justify-center gap-2"
        style={{ animationDelay: "200ms" }}
      >
        {STACK_PILLS.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 font-mono text-[11px] tracking-wide text-zinc-300"
          >
            {item}
          </li>
        ))}
      </ul>
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
        <Link href="/demo/dashboard" className={marketingClasses.secondaryCta}>
          Open live demo
        </Link>
      </div>
      <p
        className="animate-fade-in mt-6 text-xs text-zinc-500"
        style={{ animationDelay: "320ms" }}
      >
        Standard $149 · one production domain · Enterprise $349 · unlimited apps ·
        Commercial license, not MIT
      </p>
    </section>
  );
}
