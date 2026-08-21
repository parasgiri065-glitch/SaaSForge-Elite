import Link from "next/link";
import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { controlClasses } from "@/lib/ui/layout-classes";
import { cn } from "@/lib/ui/cn";

interface LandingHeroProps {
  displayClassName: string;
}

/**
 * Landing hero copy and primary CTAs (demo + store).
 *
 * @param props.displayClassName - Display font utilities from the homepage.
 * @returns The centered hero section.
 */
export function LandingHero({ displayClassName }: LandingHeroProps) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <p className="animate-rise text-sm text-violet-200/80">Enterprise Next.js boilerplate</p>
      <h1
        className={cn(
          displayClassName,
          "animate-rise mt-4 text-5xl leading-[1.05] text-white sm:text-6xl",
        )}
        style={{ animationDelay: "80ms" }}
      >
        Ship the product.
        <br />
        Skip the 100-hour setup.
      </h1>
      <p
        className="animate-rise mx-auto mt-5 max-w-xl text-base text-white/55 sm:text-lg"
        style={{ animationDelay: "160ms" }}
      >
        Auth, multi-tenant RLS, Stripe, and a streaming Groq agent — already wired,
        typed, and isolated. $149 Standard · $349 Enterprise.
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
          Get the boilerplate
        </a>
        <Link href="/demo/dashboard" className={controlClasses.secondaryCta}>
          Open live demo
        </Link>
        <Link href="/demo/agents" className={controlClasses.secondaryCta}>
          Try the AI agent
        </Link>
      </div>
    </section>
  );
}
