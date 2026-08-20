import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loadTenantUser } from "@/lib/auth/load-tenant-user";
import { isUsableTenantUser, resolveVerifiedTenantUser } from "@/lib/auth/guards";
import type { TenantUser } from "@/types/auth";

/**
 * Server-side authorization boundary.
 * Validates the JWT via `getClaims()`, then loads the tenant-scoped user.
 *
 * @returns The tenant user, or `null` when unauthenticated / inactive.
 */
export async function getVerifiedTenantUser(): Promise<TenantUser | null> {
  try {
    const supabase = await createServerSupabaseClient();
    return await resolveVerifiedTenantUser({
      getClaims: async () => {
        const result = await supabase.auth.getClaims();
        return {
          data: result.data,
          error: result.error,
        };
      },
      loadUser: (userId) => loadTenantUser(supabase, userId),
    });
  } catch {
    return null;
  }
}

/**
 * Require an active tenant user or redirect away.
 *
 * @param redirectTo - Destination when the session is missing (default `/login`).
 * @returns The verified, active tenant user (never returns for guests).
 */
export async function requireUser(redirectTo = "/login"): Promise<TenantUser> {
  const user = await getVerifiedTenantUser();
  if (!isUsableTenantUser(user)) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Bounce an already-authenticated visitor off login/signup.
 *
 * @param to - Destination for authenticated users (default `/dashboard`).
 * @returns Resolves after a possible redirect.
 */
export async function redirectIfAuthenticated(to = "/dashboard"): Promise<void> {
  const user = await getVerifiedTenantUser();
  if (user) {
    redirect(to);
  }
}
