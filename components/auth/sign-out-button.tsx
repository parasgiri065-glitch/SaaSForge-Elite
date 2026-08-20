"use client";

import { Button } from "@/components/ui/button";
import { useSignOutAction } from "@/hooks/use-sign-out-action";

/**
 * Sidebar sign-out control. Routing lives in `useSignOutAction`.
 *
 * @returns A full-width secondary button.
 */
export function SignOutButton() {
  const { isSigningOut, handleSignOut } = useSignOutAction();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="w-full"
      disabled={isSigningOut}
      onClick={() => {
        void handleSignOut();
      }}
    >
      {isSigningOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
