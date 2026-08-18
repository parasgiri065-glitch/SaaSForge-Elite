import type { Subscription } from "@/types/database";
import type { PlanTier } from "@/types/billing";
import { ACTIVE_SUBSCRIPTION_STATUSES } from "@/types/billing";

interface SubscriptionCardProps {
  plan: PlanTier;
  subscription: Subscription | null;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function SubscriptionCard({ plan, subscription }: SubscriptionCardProps) {
  const status = subscription?.status ?? "none";
  const active = subscription
    ? ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status)
    : false;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
        Current plan
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-3xl font-semibold tracking-tight">{plan}</h2>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            active
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {status}
        </span>
      </div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Renews</dt>
          <dd className="mt-0.5 font-medium">
            {formatDate(subscription?.current_period_end ?? null)}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Price</dt>
          <dd className="mt-0.5 font-mono text-xs font-medium">
            {subscription?.stripe_price_id ?? "Not assigned"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Cancels at period end</dt>
          <dd className="mt-0.5 font-medium">
            {subscription?.cancel_at_period_end ? "Yes" : "No"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
