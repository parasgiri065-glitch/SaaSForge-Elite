"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User as AuthUser } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { loadTenantUser } from "@/lib/auth/load-tenant-user";
import { signInSchema, signUpSchema } from "@/lib/auth/schemas";
import { publicEnv } from "@/lib/env";
import type { AuthContextValue, SignUpInput, TenantUser } from "@/types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  initialAuthUser?: AuthUser | null;
  initialTenantUser?: TenantUser | null;
}

export function AuthProvider({
  children,
  initialAuthUser = null,
  initialTenantUser = null,
}: AuthProviderProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [authUser, setAuthUser] = useState<AuthUser | null>(initialAuthUser);
  const [session, setSession] = useState<Session | null>(null);
  const [tenantUser, setTenantUser] = useState<TenantUser | null>(
    initialTenantUser,
  );
  const [isLoading, setIsLoading] = useState(!initialAuthUser);

  const hydrateTenant = useCallback(
    async (userId: string | undefined) => {
      if (!userId) {
        setTenantUser(null);
        return;
      }
      const next = await loadTenantUser(supabase, userId);
      setTenantUser(next);
    },
    [supabase],
  );

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      setAuthUser(null);
      setSession(null);
      setTenantUser(null);
      return;
    }
    setAuthUser(data.user);
    const { data: sessionData } = await supabase.auth.getSession();
    setSession(sessionData.session);
    await hydrateTenant(data.user.id);
  }, [hydrateTenant, supabase]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (cancelled) {
          return;
        }
        if (error || !data.user) {
          setAuthUser(null);
          setSession(null);
          setTenantUser(null);
          return;
        }
        setAuthUser(data.user);
        const { data: sessionData } = await supabase.auth.getSession();
        if (!cancelled) {
          setSession(sessionData.session);
        }
        await hydrateTenant(data.user.id);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthUser(nextSession?.user ?? null);
      if (event === "SIGNED_OUT") {
        setTenantUser(null);
        return;
      }
      if (nextSession?.user) {
        void hydrateTenant(nextSession.user.id);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [hydrateTenant, supabase]);

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
    const { error } = await supabase.auth.signOut();
    setAuthUser(null);
    setSession(null);
    setTenantUser(null);
    return { error: error?.message ?? null };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
