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
import { isDemoMode, publicEnv } from "@/lib/env";
import type { AuthContextValue, SignUpInput, TenantUser } from "@/types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  initialAuthUser?: AuthUser | null;
  initialTenantUser?: TenantUser | null;
}

const DEMO_TENANT: TenantUser = {
  id: "demo-user",
  email: "ada@demo.saasforge.dev",
  organization_id: "demo-org",
  role: "owner",
  is_active: true,
  last_seen_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  profile: {
    id: "demo-profile",
    user_id: "demo-user",
    full_name: "Ada Lovelace",
    avatar_url: null,
    job_title: "Founder",
    timezone: "UTC",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  organization: {
    id: "demo-org",
    name: "Acme Labs",
    slug: "acme-labs",
    stripe_customer_id: "cus_demo_acme",
    billing_email: "billing@demo.saasforge.dev",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  subscription: {
    id: "demo-sub",
    organization_id: "demo-org",
    user_id: "demo-user",
    stripe_subscription_id: "sub_demo",
    stripe_price_id: "price_growth_demo",
    stripe_product_id: "prod_demo",
    status: "active",
    current_period_start: "2026-08-01T00:00:00.000Z",
    current_period_end: "2026-09-01T00:00:00.000Z",
    cancel_at_period_end: false,
    canceled_at: null,
    trial_end: null,
    metadata: {},
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
};

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(
    () => ({
      authUser: null,
      session: null,
      tenantUser: DEMO_TENANT,
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

export function AuthProvider({
  children,
  initialAuthUser = null,
  initialTenantUser = null,
}: AuthProviderProps) {
  const hasSupabase =
    publicEnv.supabaseUrl.length > 0 && publicEnv.supabaseAnonKey.length > 0;
  if (isDemoMode || !hasSupabase) {
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

function LiveAuthProvider({
  children,
  initialAuthUser = null,
  initialTenantUser = null,
}: AuthProviderProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [authUser, setAuthUser] = useState<AuthUser | null>(initialAuthUser);
  const [session, setSession] = useState<Session | null>(null);
  const [tenantUser, setTenantUser] = useState<TenantUser | null>(initialTenantUser);
  const [isLoading, setIsLoading] = useState(!initialAuthUser);

  const hydrateTenant = useCallback(
    async (userId: string | undefined) => {
      if (!userId) {
        setTenantUser(null);
        return;
      }
      try {
        const next = await loadTenantUser(supabase, userId);
        setTenantUser(next);
      } catch {
        setTenantUser(null);
      }
    },
    [supabase],
  );

  const applyAuthUser = useCallback(
    async (user: AuthUser | null) => {
      if (!user) {
        setAuthUser(null);
        setSession(null);
        setTenantUser(null);
        return;
      }
      setAuthUser(user);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
      } catch {
        setSession(null);
      }
      await hydrateTenant(user.id);
    },
    [hydrateTenant, supabase],
  );

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        await applyAuthUser(null);
        return;
      }
      await applyAuthUser(data.user);
    } catch {
      await applyAuthUser(null);
    }
  }, [applyAuthUser, supabase]);

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
          await applyAuthUser(null);
          return;
        }
        await applyAuthUser(data.user);
      } catch {
        if (!cancelled) {
          await applyAuthUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void applyAuthUser(nextSession?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [applyAuthUser, supabase]);

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
      await applyAuthUser(null);
      return { error: error?.message ?? null };
    } catch (error) {
      await applyAuthUser(null);
      return { error: error instanceof Error ? error.message : "sign_out_failed" };
    }
  }, [applyAuthUser, supabase]);

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
