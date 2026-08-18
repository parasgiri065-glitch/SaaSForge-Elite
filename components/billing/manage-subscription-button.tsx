"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonError, readJsonUrl } from "@/lib/http/json-error";

interface ManageSubscriptionButtonProps {
  hasCustomer: boolean;
  onManage?: () => Promise<void> | void;
}

export function ManageSubscriptionButton({
  hasCustomer,
  onManage,
}: ManageSubscriptionButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    try {
      if (onManage) {
        await onManage();
        return;
      }

      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(readJsonError(body, "Could not open the billing portal"));
        return;
      }
      const url = readJsonUrl(body);
      if (url) {
        window.location.assign(url);
        return;
      }
      setError("Portal response was missing a URL");
    } catch {
      setError("Network error while opening the portal");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        onClick={() => {
          void handleClick();
        }}
        disabled={pending || !hasCustomer}
      >
        {pending ? "Opening portal…" : "Manage Subscription"}
      </Button>
      {!hasCustomer ? (
        <p className="text-xs text-zinc-500">
          A Stripe customer is required before the portal can open.
        </p>
      ) : null}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
