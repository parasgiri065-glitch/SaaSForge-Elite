"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAppNav } from "@/components/layout/nav-items";
import { IconMark } from "@/components/ui/icons";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useAuth } from "@/hooks/use-auth";
import { layoutClasses, navLinkClassName } from "@/lib/ui/layout-classes";

/**
 * Whether a nav href is the current page (exact or nested).
 *
 * @param pathname - Current App Router pathname.
 * @param href - Candidate nav href (already prefixed with `basePath`).
 * @returns `true` when this item should render as current.
 */
function isCurrentNavHref(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarProps {
  onNavigate?: () => void;
  basePath?: string;
}

/**
 * Workspace sidebar: brand, nav, tenant identity, sign out.
 *
 * @param props.onNavigate - Optional callback (closes the mobile drawer).
 * @param props.basePath - `""` or `"/demo"`.
 * @returns The sidebar column.
 */
export function Sidebar({ onNavigate, basePath = "" }: SidebarProps) {
  const pathname = usePathname();
  const { tenantUser } = useAuth();
  const navigationItems = getAppNav(basePath);
  const displayName = tenantUser?.profile?.full_name ?? tenantUser?.email ?? "Workspace";
  const organizationName = tenantUser?.organization?.name ?? "No organization";

  return (
    <div className={layoutClasses.sidebarRoot}>
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200 ring-1 ring-white/10">
          <IconMark className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">SaaSForge</p>
          <p className="truncate text-[11px] text-white/40">Elite</p>
        </div>
      </div>

      <nav aria-label="Workspace" className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigationItems.map((item) => {
          const isCurrentRoute = isCurrentNavHref(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isCurrentRoute ? "page" : undefined}
              className={navLinkClassName(isCurrentRoute)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-medium">{displayName}</p>
        <p className="truncate text-xs text-white/40">
          {organizationName}
          {tenantUser?.role ? ` · ${tenantUser.role}` : ""}
        </p>
        <div className="mt-3">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
