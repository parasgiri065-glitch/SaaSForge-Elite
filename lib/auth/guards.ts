import type { TenantUser } from "@/types/auth";

export type ClaimsResult = {
  data: { claims?: { sub?: unknown } | null } | null;
  error: { message?: string } | null;
};

/**
 * Pull a verified subject out of getClaims().
 * Expired, unsigned, or empty tokens all collapse to null.
 */
export function readSubjectFromClaims(result: ClaimsResult): string | null {
  if (result.error) {
    return null;
  }
  const sub = result.data?.claims?.sub;
  if (typeof sub !== "string") {
    return null;
  }
  const trimmed = sub.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isUsableTenantUser(user: TenantUser | null): user is TenantUser {
  return user !== null && user.is_active;
}

export async function resolveVerifiedTenantUser(deps: {
  getClaims: () => Promise<ClaimsResult>;
  loadUser: (userId: string) => Promise<TenantUser | null>;
}): Promise<TenantUser | null> {
  const claims = await deps.getClaims();
  const userId = readSubjectFromClaims(claims);
  if (!userId) {
    return null;
  }
  return deps.loadUser(userId);
}
