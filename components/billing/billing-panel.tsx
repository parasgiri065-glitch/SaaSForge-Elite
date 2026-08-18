"use client";

import { SubscriptionCard } from "@/components/billing/subscription-card";
import { InvoiceTable } from "@/components/billing/invoice-table";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";
import { MOCK_INVOICES } from "@/components/billing/mock-invoices";
import { useAuth } from "@/hooks/use-auth";
import type { Invoice, PlanTier } from "@/types/billing";
import type { Subscription } from "@/types/database";

interface BillingPanelProps {
  invoices?: Invoice[];
  onManage?: () => Promise<void> | void;
}

function resolvePlan(subscription: Subscription | null): PlanTier {
  const price = subscription?.stripe_price_id ?? "";
  if (price.includes("ENTERPRISE") || price.toLowerCase().includes("enterprise")) {
    return "Enterprise";
  }
  if (price.includes("GROWTH") || price.toLowerCase().includes("growth")) {
    return "Growth";
  }
  if (price.includes("STARTER") || price.toLowerCase().includes("starter")) {
    return "Starter";
  }
  if (subscription) {
    return "Growth";
  }
  return "None";
}

export function BillingPanel({ invoices = MOCK_INVOICES, onManage }: BillingPanelProps) {
  const { tenantUser } = useAuth();
  const subscription = tenantUser?.subscription ?? null;
  const plan = resolvePlan(subscription);
  const hasCustomer = Boolean(tenantUser?.organization?.stripe_customer_id);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Billing</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Plan, invoices, and the Stripe customer portal for{" "}
            {tenantUser?.organization?.name ?? "your workspace"}.
          </p>
        </div>
        <ManageSubscriptionButton hasCustomer={hasCustomer} onManage={onManage} />
      </div>
      <SubscriptionCard plan={plan} subscription={subscription} />
      <InvoiceTable invoices={invoices} />
    </div>
  );
}
