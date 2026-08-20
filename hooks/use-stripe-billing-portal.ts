"use client";

import { useCallback, useState } from "react";
import { readJsonError, readJsonUrl } from "@/lib/http/json-error";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";

export type StripeBillingPortalState = {
  isPortalRequestPending: boolean;
  portalRequestError: string | null;
  isManageActionDisabled: boolean;
  openBillingPortal: () => Promise<void>;
};

/**
 * Data-fetching hook for POST /api/stripe/portal.
 * The button component only renders pending/error/disabled from this state.
 *
 * @param options.hasStripeCustomer - Whether the org already has a `cus_…` id.
 * @param options.onManageOverride - Optional demo/test stand-in for the fetch.
 * @returns Pending flag, error string, disabled flag, and the click handler.
 */
export function useStripeBillingPortal(options: {
  hasStripeCustomer: boolean;
  onManageOverride?: () => Promise<void> | void;
}): StripeBillingPortalState {
  const { hasStripeCustomer, onManageOverride } = options;
  const [isPortalRequestPending, setIsPortalRequestPending] = useState(false);
  const [portalRequestError, setPortalRequestError] = useState<string | null>(null);

  const openBillingPortal = useCallback(async () => {
    setIsPortalRequestPending(true);
    setPortalRequestError(null);
    try {
      if (onManageOverride) {
        await onManageOverride();
        return;
      }

      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setPortalRequestError(readJsonError(body, "Could not open the billing portal"));
        return;
      }
      const portalUrl = readJsonUrl(body);
      if (portalUrl) {
        window.location.assign(portalUrl);
        return;
      }
      setPortalRequestError("Portal response was missing a URL");
    } catch (error: unknown) {
      const isolated = isolateUnknownError(error, "portal_network_error");
      setPortalRequestError(isolated.message || "Network error while opening the portal");
    } finally {
      setIsPortalRequestPending(false);
    }
  }, [onManageOverride]);

  return {
    isPortalRequestPending,
    portalRequestError,
    isManageActionDisabled: isPortalRequestPending || !hasStripeCustomer,
    openBillingPortal,
  };
}
