import { LandingFeatures } from "@/components/marketing/landing-features";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { LandingHeader } from "@/components/marketing/landing-header";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingPricing } from "@/components/marketing/landing-pricing";
import { ProductStage } from "@/components/marketing/product-stage";
import { marketingClasses } from "@/lib/ui/marketing-classes";

interface LandingPageProps {
  displayClassName: string;
}

/**
 * Public marketing landing page — command-center canvas on zinc-950.
 *
 * @param props.displayClassName - Display font utilities from the homepage.
 * @returns The full landing canvas.
 */
export function LandingPage({ displayClassName }: LandingPageProps) {
  return (
    <div className={marketingClasses.canvas}>
      <div className={marketingClasses.ambient} />
      <LandingHeader />
      <main className={marketingClasses.main}>
        <LandingHero displayClassName={displayClassName} />
        <section className="animate-fade-in" style={{ animationDelay: "280ms" }}>
          <ProductStage />
        </section>
        <LandingFeatures />
        <LandingPricing />
      </main>
      <LandingFooter />
    </div>
  );
}
