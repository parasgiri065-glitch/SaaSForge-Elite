import { layoutClasses } from "@/lib/ui/layout-classes";

type ProductAtmosphereVariant = "landing" | "workspace";

/**
 * Decorative glow layer behind marketing and the dashboard shell.
 *
 * @param props.variant - `"landing"` includes the grid; `"workspace"` is quieter.
 * @returns A pointer-events-none backdrop.
 */
export function ProductAtmosphere({ variant }: { variant: ProductAtmosphereVariant }) {
  if (variant === "landing") {
    return (
      <div className={layoutClasses.productGlowLayer}>
        <div className={layoutClasses.productGlowPrimary} />
        <div className={layoutClasses.productGlowSecondary} />
        <div className={layoutClasses.productGrid} />
      </div>
    );
  }

  return (
    <div className={layoutClasses.productGlowLayer}>
      <div className={layoutClasses.shellGlowPrimary} />
      <div className={layoutClasses.shellGlowSecondary} />
    </div>
  );
}
