"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getAppNav } from "@/components/layout/nav-items";
import { IconClose } from "@/components/ui/icons";

interface DashboardShellProps {
  children: ReactNode;
  basePath?: string;
}

function titleForPath(pathname: string, basePath: string): string {
  const match = getAppNav(basePath).find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Workspace";
}

export function DashboardShell({ children, basePath = "" }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = useMemo(() => titleForPath(pathname, basePath), [basePath, pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#07060c] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[20%] h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />
      </div>
      <aside className="relative z-10 hidden w-64 shrink-0 border-r border-white/10 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar basePath={basePath} />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/50"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(18rem,86vw)] border-r border-white/10 bg-[#0b0a12] shadow-2xl">
            <button
              type="button"
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <IconClose className="h-4 w-4" />
            </button>
            <Sidebar basePath={basePath} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenSidebar={() => setMobileOpen(true)} />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
