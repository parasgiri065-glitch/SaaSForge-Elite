"use client";

import type { ReactNode } from "react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { DemoAuthProvider } from "@/components/providers/demo-auth-provider";
import { LiveAuthProvider } from "@/components/providers/live-auth-provider";
import { isDemoMode, publicEnv } from "@/lib/env";
import type { TenantUser } from "@/types/auth";

export { useAuthContext } from "@/components/providers/auth-context";
export { DemoAuthProvider } from "@/components/providers/demo-auth-provider";

interface AuthProviderProps {
  children: ReactNode;
  initialAuthUser?: AuthUser | null;
  initialTenantUser?: TenantUser | null;
}

/**
 * Root auth switcher. Demo mode (or missing public Supabase keys) mounts the
 * mock tenant; otherwise the live session hook runs.
 *
 * @param props.children - Application tree.
 * @param props.initialAuthUser - Optional SSR-hydrated Auth user.
 * @param props.initialTenantUser - Optional SSR-hydrated tenant graph.
 * @returns Demo or live auth provider wrapping `children`.
 */
export function AuthProvider({
  children,
  initialAuthUser = null,
  initialTenantUser = null,
}: AuthProviderProps) {
  const hasSupabasePublicKeys =
    publicEnv.supabaseUrl.length > 0 && publicEnv.supabaseAnonKey.length > 0;
  if (isDemoMode || !hasSupabasePublicKeys) {
    return <DemoAuthProvider>{children}</DemoAuthProvider>;
  }

  return (
    <LiveAuthProvider
      initialAuthUser={initialAuthUser}
      initialTenantUser={initialTenantUser}
    >
      {children}
    </LiveAuthProvider>
  );
}
