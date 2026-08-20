"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Client gate paired with `requireUser()` in the server layout.
 * Renders a restoring-session state, then children once authenticated.
 *
 * @param props.children - Protected tree.
 * @returns Children, a loading label, or `null` while redirecting.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-500">
        Restoring session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
