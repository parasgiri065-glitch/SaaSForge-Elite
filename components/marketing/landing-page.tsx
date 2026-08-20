import { ProductAtmosphere } from "@/components/layout/product-atmosphere";
import { LandingFeatures } from "@/components/marketing/landing-features";
import { LandingHeader } from "@/components/marketing/landing-header";
import { LandingHero } from "@/components/marketing/landing-hero";
import { ProductStage } from "@/components/marketing/product-stage";
import { layoutClasses } from "@/lib/ui/layout-classes";

interface LandingPageProps {
  displayClassName: string;
}

/**
 * Public marketing landing page. Atmosphere, header, hero, product stage, features.
 *
 * @param props.displayClassName - Display font utilities from the homepage.
 * @returns The full landing canvas.
 */
export function LandingPage({ displayClassName }: LandingPageProps) {
  return (
    <div className={layoutClasses.productCanvas}>
      <ProductAtmosphere variant="landing" />
      <LandingHeader />
      <main className={layoutClasses.marketingMain}>
        <LandingHero displayClassName={displayClassName} />
        <section className="animate-rise" style={{ animationDelay: "300ms" }}>
          <ProductStage />
        </section>
        <LandingFeatures />
      </main>
    </div>
  );
}
