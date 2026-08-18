"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

/**
 * Client-side route guard. Pair with the server layout in app/(app)/layout.tsx.
 * Never treat this hook as the only authorization check.
 */
export function useRequireAuth(redirectTo = "/login") {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [auth.isAuthenticated, auth.isLoading, redirectTo, router]);

  return auth;
}
