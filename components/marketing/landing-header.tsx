import Link from "next/link";
import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { marketingClasses } from "@/lib/ui/marketing-classes";

/**
 * Marketing header: brand, feature/pricing jumps, store CTA.
 *
 * @returns The landing-page header.
 */
export function LandingHeader() {
  return (
    <header className={marketingClasses.header}>
      <div className={marketingClasses.headerInner}>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-[11px] font-semibold tracking-wide text-zinc-100">
            SF
          </span>
          <span className="text-sm font-medium text-zinc-200">SaaSForge Elite</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#features"
            className={`${marketingClasses.ghostLink} hidden md:inline`}
          >
            Features
          </a>
          <a href="#pricing" className={`${marketingClasses.ghostLink} hidden sm:inline`}>
            Pricing
          </a>
          <Link href="/demo/dashboard" className={marketingClasses.ghostLink}>
            Live demo
          </Link>
          <a
            href={LEMON_SQUEEZY_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className={marketingClasses.primaryCta}
          >
            Buy now
          </a>
        </nav>
      </div>
    </header>
  );
}
