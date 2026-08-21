import { LEMON_SQUEEZY_STORE_URL } from "@/lib/commerce/store";
import { marketingClasses } from "@/lib/ui/marketing-classes";

/**
 * Marketing footer with license prices and the storefront URL.
 *
 * @returns The landing footer.
 */
export function LandingFooter() {
  return (
    <footer className={marketingClasses.footer}>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-center text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>SaaSForge Elite · Commercial license · Not MIT</p>
        <p>
          Standard $149 · Enterprise $349 ·{" "}
          <a
            href={LEMON_SQUEEZY_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-300 underline-offset-2 hover:text-white hover:underline"
          >
            elitesaasforge.lemonsqueezy.com
          </a>
        </p>
      </div>
    </footer>
  );
}
