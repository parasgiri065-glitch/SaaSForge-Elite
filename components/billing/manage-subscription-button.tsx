"use client";

import { Button } from "@/components/ui/button";
import { useStripeBillingPortal } from "@/hooks/use-stripe-billing-portal";

interface ManageSubscriptionButtonProps {
  hasCustomer: boolean;
  onManage?: () => Promise<void> | void;
}

/**
 * Opens the Stripe Customer Portal. Fetch logic lives in `useStripeBillingPortal`.
 *
 * @param props.hasCustomer - Whether the org already has a `cus_…` id.
 * @param props.onManage - Optional override used by demos/tests.
 * @returns The manage button plus helper/error copy.
 */
export function ManageSubscriptionButton({
  hasCustomer,
  onManage,
}: ManageSubscriptionButtonProps) {
  const {
    isPortalRequestPending,
    portalRequestError,
    isManageActionDisabled,
    openBillingPortal,
  } = useStripeBillingPortal({
    hasStripeCustomer: hasCustomer,
    onManageOverride: onManage,
  });

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        onClick={() => {
          void openBillingPortal();
        }}
        disabled={isManageActionDisabled}
      >
        {isPortalRequestPending ? "Opening portal…" : "Manage Subscription"}
      </Button>
      {!hasCustomer ? (
        <p className="text-xs text-zinc-500">
          A Stripe customer is required before the portal can open.
        </p>
      ) : null}
      {portalRequestError ? (
        <p className="text-xs text-red-600" role="alert">
          {portalRequestError}
        </p>
      ) : null}
    </div>
  );
}
