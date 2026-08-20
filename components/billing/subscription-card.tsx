import type { Subscription } from "@/types/database";
import type { PlanTier } from "@/types/billing";
import { ACTIVE_SUBSCRIPTION_STATUSES } from "@/types/billing";
import { layoutClasses, subscriptionStatusClassName } from "@/lib/ui/layout-classes";

interface SubscriptionCardProps {
  plan: PlanTier;
  subscription: Subscription | null;
}

/**
 * Format a nullable ISO timestamp for the plan card.
 *
 * @param isoDate - ISO string or `null`.
 * @returns A short US date, or an em dash when missing.
 */
function formatSubscriptionDate(isoDate: string | null): string {
  if (!isoDate) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

/**
 * Current-plan summary for the billing page.
 *
 * @param props.plan - Resolved plan tier label.
 * @param props.subscription - Tenant subscription row, or `null`.
 * @returns A glass card with renew date, price id, and cancel flag.
 */
export function SubscriptionCard({ plan, subscription }: SubscriptionCardProps) {
  const statusLabel = subscription?.status ?? "none";
  const isSubscriptionActive = subscription
    ? ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status)
    : false;

  return (
    <section className={`${layoutClasses.glassCard} p-6`}>
      <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
        Current plan
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-3xl font-semibold tracking-tight">{plan}</h2>
        <span className={subscriptionStatusClassName(isSubscriptionActive)}>
          {statusLabel}
        </span>
      </div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-white/40">Renews</dt>
          <dd className="mt-0.5 font-medium">
            {formatSubscriptionDate(subscription?.current_period_end ?? null)}
          </dd>
        </div>
        <div>
          <dt className="text-white/40">Price</dt>
          <dd className="mt-0.5 font-mono text-xs font-medium">
            {subscription?.stripe_price_id ?? "Not assigned"}
          </dd>
        </div>
        <div>
          <dt className="text-white/40">Cancels at period end</dt>
          <dd className="mt-0.5 font-medium">
            {subscription?.cancel_at_period_end ? "Yes" : "No"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
