"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAppNav } from "@/components/layout/nav-items";
import { IconMark } from "@/components/ui/icons";
import { useAuth } from "@/hooks/use-auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarProps {
  onNavigate?: () => void;
  basePath?: string;
}

export function Sidebar({ onNavigate, basePath = "" }: SidebarProps) {
  const pathname = usePathname();
  const { tenantUser } = useAuth();
  const nav = getAppNav(basePath);
  const displayName = tenantUser?.profile?.full_name ?? tenantUser?.email ?? "Workspace";
  const orgName = tenantUser?.organization?.name ?? "No organization";

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex h-16 items-center gap-2.5 border-b border-zinc-200 px-5 dark:border-zinc-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <IconMark className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">SaaSForge</p>
          <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">Elite</p>
        </div>
      </div>

      <nav aria-label="Workspace" className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <p className="truncate text-sm font-medium">{displayName}</p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {orgName}
          {tenantUser?.role ? ` · ${tenantUser.role}` : ""}
        </p>
        <div className="mt-3">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
