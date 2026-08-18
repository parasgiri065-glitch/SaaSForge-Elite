import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loadTenantUser } from "@/lib/auth/load-tenant-user";
import { isUsableTenantUser, resolveVerifiedTenantUser } from "@/lib/auth/guards";
import type { TenantUser } from "@/types/auth";

/**
 * Server-side authorization boundary.
 * Validates the JWT via getClaims(), then loads the tenant-scoped user.
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

export async function requireUser(redirectTo = "/login"): Promise<TenantUser> {
  const user = await getVerifiedTenantUser();
  if (!isUsableTenantUser(user)) {
    redirect(redirectTo);
  }
  return user;
}

export async function redirectIfAuthenticated(to = "/dashboard"): Promise<void> {
  const user = await getVerifiedTenantUser();
  if (user) {
    redirect(to);
  }
}
