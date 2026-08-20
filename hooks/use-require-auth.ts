"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { AuthContextValue } from "@/types/auth";

/**
 * Client-side route guard. Pair with the server layout in `app/(app)/layout.tsx`.
 * Never treat this hook as the only authorization check.
 *
 * @param redirectTo - Path to bounce unauthenticated visitors (default `/login`).
 * @returns The underlying `useAuth()` value.
 */
export function useRequireAuth(redirectTo = "/login"): AuthContextValue {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [auth.isAuthenticated, auth.isLoading, redirectTo, router]);

  return auth;
}
