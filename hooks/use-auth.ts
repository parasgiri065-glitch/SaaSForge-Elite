"use client";

import { useAuthContext } from "@/components/providers/auth-context";
import type { AuthContextValue } from "@/types/auth";

/**
 * Read the current auth context (demo or live).
 *
 * @returns Session, tenant user, and sign-in/up/out actions.
 */
export function useAuth(): AuthContextValue {
  return useAuthContext();
}
