import Link from "next/link";
import { controlClasses } from "@/lib/ui/layout-classes";
import { cn } from "@/lib/ui/cn";

interface LandingHeroProps {
  displayClassName: string;
}

/**
 * Landing hero copy and primary CTAs.
 *
 * @param props.displayClassName - Display font utilities from the homepage.
 * @returns The centered hero section.
 */
export function LandingHero({ displayClassName }: LandingHeroProps) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <p className="animate-rise text-sm text-violet-200/80">Enterprise boilerplate</p>
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
        Auth, tenancy, Stripe, and a streaming AI agent — already wired, typed, and
        isolated. Open the live workspace and click around.
      </p>
      <div
        className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "240ms" }}
      >
        <Link href="/demo/dashboard" className={controlClasses.primaryCta}>
          Open live demo
        </Link>
        <Link href="/demo/agents" className={controlClasses.secondaryCta}>
          Try the AI agent
        </Link>
      </div>
    </section>
  );
}
