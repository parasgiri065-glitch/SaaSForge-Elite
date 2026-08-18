import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loadTenantUser } from "@/lib/auth/load-tenant-user";
import type { TenantUser } from "@/types/auth";

/**
 * Server-side authorization boundary.
 * Validates the JWT via getClaims(), then loads the tenant-scoped user.
 */
export async function getVerifiedTenantUser(): Promise<TenantUser | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string" || userId.length === 0) {
    return null;
  }

  return loadTenantUser(supabase, userId);
}

export async function requireUser(redirectTo = "/login"): Promise<TenantUser> {
  const user = await getVerifiedTenantUser();
  if (!user || !user.is_active) {
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
