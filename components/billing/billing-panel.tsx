"use client";

import { SubscriptionCard } from "@/components/billing/subscription-card";
import { InvoiceTable } from "@/components/billing/invoice-table";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";
import { MOCK_INVOICES } from "@/components/billing/mock-invoices";
import { useUserSubscriptionState } from "@/hooks/use-user-subscription-state";
import { layoutClasses } from "@/lib/ui/layout-classes";
import type { Invoice } from "@/types/billing";

interface BillingPanelProps {
  invoices?: Invoice[];
  onManage?: () => Promise<void> | void;
}

/**
 * Billing settings page body. Subscription data comes from
 * `useUserSubscriptionState` (auth context), not a second fetch.
 *
 * @param props.invoices - Invoice rows (defaults to mock samples).
 * @param props.onManage - Optional portal override.
 * @returns Plan card + invoices + manage button.
 */
export function BillingPanel({ invoices = MOCK_INVOICES, onManage }: BillingPanelProps) {
  const { subscriptionRecord, planTier, hasStripeCustomer, organizationDisplayName } =
    useUserSubscriptionState();

  return (
    <div className={layoutClasses.billingColumn}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Billing</h2>
          <p className="mt-1 text-sm text-white/50">
            Plan, invoices, and the Stripe customer portal for {organizationDisplayName}.
          </p>
        </div>
        <ManageSubscriptionButton hasCustomer={hasStripeCustomer} onManage={onManage} />
      </div>
      <SubscriptionCard plan={planTier} subscription={subscriptionRecord} />
      <InvoiceTable invoices={invoices} />
    </div>
  );
}
