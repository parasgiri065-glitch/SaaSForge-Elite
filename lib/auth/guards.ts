import { z } from "zod";
import type { TenantUser } from "@/types/auth";

export const claimsResultSchema = z.object({
  data: z
    .object({
      claims: z
        .object({
          sub: z.unknown().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable(),
  error: z
    .object({
      message: z.string().optional(),
    })
    .nullable(),
});

export type ClaimsResult = z.infer<typeof claimsResultSchema>;

/**
 * Pull a verified subject out of `getClaims()`.
 * Expired, unsigned, or empty tokens all collapse to `null`.
 *
 * @param result - The object returned by `supabase.auth.getClaims()`.
 * @returns The `sub` string, or `null` when the token is unusable.
 */
export function readSubjectFromClaims(result: ClaimsResult): string | null {
  const parsed = claimsResultSchema.safeParse(result);
  if (!parsed.success || parsed.data.error) {
    return null;
  }
  const subject = parsed.data.data?.claims?.sub;
  if (typeof subject !== "string") {
    return null;
  }
  const trimmedSubject = subject.trim();
  return trimmedSubject.length > 0 ? trimmedSubject : null;
}

/**
 * Whether a tenant row may enter the authenticated app.
 *
 * @param user - Loaded tenant user, or `null`.
 * @returns `true` only for an active membership.
 */
export function isUsableTenantUser(user: TenantUser | null): user is TenantUser {
  return user !== null && user.is_active;
}

/**
 * Resolve a tenant user from verified JWT claims, then a loader.
 * Does not call `loadUser` when the token is missing or expired.
 *
 * @param deps.getClaims - Returns the current JWT claims result.
 * @param deps.loadUser - Loads the tenant graph for a verified user id.
 * @returns The tenant user, or `null` when unauthenticated / missing.
 */
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
