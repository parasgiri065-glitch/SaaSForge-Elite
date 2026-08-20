"use client";

import type { ReactNode } from "react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { AuthContext } from "@/components/providers/auth-context";
import { useLiveAuthSession } from "@/hooks/use-live-auth-session";
import type { TenantUser } from "@/types/auth";

interface LiveAuthProviderProps {
  children: ReactNode;
  initialAuthUser?: AuthUser | null;
  initialTenantUser?: TenantUser | null;
}

/**
 * Live Supabase auth provider. Session state lives in `useLiveAuthSession`.
 *
 * @param props.children - Tree that may call `useAuth()`.
 * @param props.initialAuthUser - Optional SSR-hydrated Auth user.
 * @param props.initialTenantUser - Optional SSR-hydrated tenant graph.
 * @returns Context provider wrapping `children`.
 */
export function LiveAuthProvider({
  children,
  initialAuthUser = null,
  initialTenantUser = null,
}: LiveAuthProviderProps) {
  const value = useLiveAuthSession({ initialAuthUser, initialTenantUser });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
