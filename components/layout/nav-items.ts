import type { ComponentType } from "react";
import { IconCard, IconLayout, IconSpark, IconUsers } from "@/components/ui/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const APP_NAV: readonly NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: IconLayout },
  { href: "/agents", label: "AI Agent", icon: IconSpark },
  { href: "/settings/billing", label: "Billing", icon: IconCard },
  { href: "/settings/team", label: "Team", icon: IconUsers },
];

/**
 * Prefix workspace nav hrefs for the live app (`""`) or the public demo (`"/demo"`).
 *
 * @param basePath - Optional path prefix without a trailing slash.
 * @returns A new nav list with prefixed hrefs.
 */
export function getAppNav(basePath = ""): NavItem[] {
  const prefix = basePath.replace(/\/$/, "");
  return APP_NAV.map((item) => ({
    ...item,
    href: `${prefix}${item.href}`,
  }));
}

/**
 * Resolve the top-bar title from the current pathname and optional demo prefix.
 *
 * @param pathname - The App Router pathname (`usePathname()`).
 * @param basePath - `""` for the live app or `"/demo"` for the public demo shell.
 * @returns The matching nav label, or `"Workspace"` when nothing matches.
 */
export function resolveWorkspacePageTitle(pathname: string, basePath: string): string {
  const matchingItem = getAppNav(basePath).find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return matchingItem?.label ?? "Workspace";
}
