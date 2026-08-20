"use client";

import { createContext, useContext } from "react";
import type { AuthContextValue } from "@/types/auth";

/**
 * Shared auth context. Demo and live providers must publish the same shape
 * so `useAuth()` never branches on which provider is mounted.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Read the auth context. Throws when used outside `AuthProvider`.
 *
 * @returns The current `AuthContextValue`.
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
