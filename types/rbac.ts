import type { AppRole } from "@/types/database";

export const APP_ROLES = [
  "owner",
  "admin",
  "member",
  "billing",
  "viewer",
] as const satisfies readonly AppRole[];

export const BILLING_ROLES: readonly AppRole[] = ["owner", "admin", "billing"];
export const ADMIN_ROLES: readonly AppRole[] = ["owner", "admin"];

/**
 * Whether a membership role is in an allowed set.
 *
 * @param role - Current member role, or null/undefined.
 * @param allowed - Roles that grant the action (e.g. `BILLING_ROLES`).
 * @returns `true` when `role` is present and listed.
 */
export function hasRole(
  role: AppRole | null | undefined,
  allowed: readonly AppRole[],
): boolean {
  return role !== null && role !== undefined && allowed.includes(role);
}
