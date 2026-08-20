"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User as AuthUser } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { loadTenantUser } from "@/lib/auth/load-tenant-user";
import { signInSchema, signUpSchema } from "@/lib/auth/schemas";
import { publicEnv } from "@/lib/env";
import type { AuthContextValue, SignUpInput, TenantUser } from "@/types/auth";

/**
 * Live Supabase session + tenant hydration.
 * Data-fetching only — the provider merely publishes the returned value.
 *
 * @param options.initialAuthUser - Optional SSR-hydrated Auth user.
 * @param options.initialTenantUser - Optional SSR-hydrated tenant graph.
 * @returns A full `AuthContextValue` (session, tenant, sign-in/up/out, refresh).
 */
export function useLiveAuthSession(
  options: {
    initialAuthUser?: AuthUser | null;
    initialTenantUser?: TenantUser | null;
  } = {},
): AuthContextValue {
  const initialAuthUser = options.initialAuthUser ?? null;
  const initialTenantUser = options.initialTenantUser ?? null;
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [authUser, setAuthUser] = useState<AuthUser | null>(initialAuthUser);
  const [session, setSession] = useState<Session | null>(null);
  const [tenantUser, setTenantUser] = useState<TenantUser | null>(initialTenantUser);
  const [isLoading, setIsLoading] = useState(!initialAuthUser);

  const hydrateTenantUserFromAuthId = useCallback(
    async (userId: string | undefined) => {
      if (!userId) {
        setTenantUser(null);
        return;
      }
      try {
        const nextTenantUser = await loadTenantUser(supabase, userId);
        setTenantUser(nextTenantUser);
      } catch {
        setTenantUser(null);
      }
    },
    [supabase],
  );

  const applyVerifiedAuthUser = useCallback(
    async (nextAuthUser: AuthUser | null) => {
      if (!nextAuthUser) {
        setAuthUser(null);
        setSession(null);
        setTenantUser(null);
        return;
      }
      setAuthUser(nextAuthUser);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
      } catch {
        setSession(null);
      }
      await hydrateTenantUserFromAuthId(nextAuthUser.id);
    },
    [hydrateTenantUserFromAuthId, supabase],
  );

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        await applyVerifiedAuthUser(null);
        return;
      }
      await applyVerifiedAuthUser(data.user);
    } catch {
      await applyVerifiedAuthUser(null);
    }
  }, [applyVerifiedAuthUser, supabase]);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (cancelled) {
          return;
        }
        if (error || !data.user) {
          await applyVerifiedAuthUser(null);
          return;
        }
        await applyVerifiedAuthUser(data.user);
      } catch {
        if (!cancelled) {
          await applyVerifiedAuthUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void applyVerifiedAuthUser(nextSession?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [applyVerifiedAuthUser, supabase]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const parsed = signInSchema.safeParse({ email, password });
      if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
      }
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) {
        return { error: error.message };
      }
      await refresh();
      return { error: null };
    },
    [refresh, supabase],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const parsed = signUpSchema.safeParse(input);
      if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid signup data" };
      }
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${publicEnv.appUrl}/callback`,
          data: {
            full_name: parsed.data.fullName,
            organization_name: parsed.data.organizationName,
          },
        },
      });
      if (error) {
        return { error: error.message };
      }
      await refresh();
      return { error: null };
    },
    [refresh, supabase],
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      await applyVerifiedAuthUser(null);
      return { error: error?.message ?? null };
    } catch (error) {
      await applyVerifiedAuthUser(null);
      return { error: error instanceof Error ? error.message : "sign_out_failed" };
    }
  }, [applyVerifiedAuthUser, supabase]);

  return useMemo<AuthContextValue>(
    () => ({
      authUser,
      session,
      tenantUser,
      isLoading,
      isAuthenticated: Boolean(authUser),
      signIn,
      signUp,
      signOut,
      refresh,
    }),
    [authUser, isLoading, refresh, session, signIn, signOut, signUp, tenantUser],
  );
}
