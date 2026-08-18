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

export function hasRole(
  role: AppRole | null | undefined,
  allowed: readonly AppRole[],
): boolean {
  return role !== null && role !== undefined && allowed.includes(role);
}
