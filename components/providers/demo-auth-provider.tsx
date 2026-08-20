"use client";

import { useMemo, type ReactNode } from "react";
import { AuthContext } from "@/components/providers/auth-context";
import { DEMO_TENANT_USER } from "@/lib/auth/demo-tenant";
import type { AuthContextValue } from "@/types/auth";

/**
 * Public-demo auth provider. No Supabase calls — Ada Lovelace / Acme Labs.
 *
 * @param props.children - Tree that may call `useAuth()`.
 * @returns Context provider wrapping `children`.
 */
export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(
    () => ({
      authUser: null,
      session: null,
      tenantUser: DEMO_TENANT_USER,
      isLoading: false,
      isAuthenticated: true,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      refresh: async () => undefined,
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
