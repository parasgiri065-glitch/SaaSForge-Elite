import Link from "next/link";
import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { controlClasses, layoutClasses } from "@/lib/ui/layout-classes";

/**
 * Marketing header: brand, feature/pricing jumps, store CTA.
 *
 * @returns The landing-page header.
 */
export function LandingHeader() {
  return (
    <header className={layoutClasses.marketingHeader}>
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold">
          SF
        </span>
        <span className="text-sm font-medium text-white/75">SaaSForge Elite</span>
      </Link>
      <nav className="flex items-center gap-1 sm:gap-3">
        <a
          href="#features"
          className="hidden rounded-full px-3 py-1.5 text-sm text-white/70 hover:bg-white/5 md:inline"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="hidden rounded-full px-3 py-1.5 text-sm text-white/70 hover:bg-white/5 sm:inline"
        >
          Pricing
        </a>
        <Link href="/demo/dashboard" className={controlClasses.ghostLink}>
          Live demo
        </Link>
        <a
          href={LEMON_SQUEEZY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className={controlClasses.primaryCta}
        >
          Buy now
        </a>
      </nav>
    </header>
  );
}
