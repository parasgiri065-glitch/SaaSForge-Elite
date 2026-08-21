import Link from "next/link";
import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { controlClasses, layoutClasses } from "@/lib/ui/layout-classes";

/**
 * Marketing header with brand, pricing jump, store CTA, and sign-in.
 *
 * @returns The landing-page header.
 */
export function LandingHeader() {
  return (
    <header className={layoutClasses.marketingHeader}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold">
          SF
        </span>
        <span className="text-sm font-medium text-white/75">SaaSForge Elite</span>
      </div>
      <nav className="flex items-center gap-2 sm:gap-3">
        <a
          href="#pricing"
          className="hidden rounded-full px-3 py-1.5 text-sm text-white/70 hover:bg-white/5 sm:inline"
        >
          Pricing
        </a>
        <Link href="/login" className={controlClasses.ghostLink}>
          Sign in
        </Link>
        <a
          href={LEMON_SQUEEZY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className={controlClasses.primaryCta}
        >
          Buy the kit
        </a>
      </nav>
    </header>
  );
}
