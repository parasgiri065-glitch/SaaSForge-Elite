import Link from "next/link";
import { controlClasses, layoutClasses } from "@/lib/ui/layout-classes";

/**
 * Marketing header with brand mark and sign-in link.
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
      <Link href="/login" className={controlClasses.ghostLink}>
        Sign in
      </Link>
    </header>
  );
}
