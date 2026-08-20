import type { ReactNode } from "react";
import { metricCardClasses } from "@/lib/ui/layout-classes";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  variant?: "live" | "demo";
}

/**
 * Small labeled metric used on live and demo dashboards.
 *
 * @param props.label - Upper caption (Organization, Role, Plan, …).
 * @param props.value - Primary value.
 * @param props.variant - `"live"` uses zinc cards; `"demo"` uses glass.
 * @returns An `article` metric tile.
 */
export function MetricCard({ label, value, variant = "live" }: MetricCardProps) {
  return (
    <article
      className={variant === "demo" ? metricCardClasses.demo : metricCardClasses.live}
    >
      <p
        className={
          variant === "demo"
            ? "text-xs text-white/40"
            : "text-xs tracking-wide text-zinc-500 uppercase"
        }
      >
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </article>
  );
}
