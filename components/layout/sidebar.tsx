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
    <div className="flex h-full flex-col bg-black/20 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200 ring-1 ring-white/10">
          <IconMark className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">SaaSForge</p>
          <p className="truncate text-[11px] tracking-[0.18em] text-white/40 uppercase">
            Studio
          </p>
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
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
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
