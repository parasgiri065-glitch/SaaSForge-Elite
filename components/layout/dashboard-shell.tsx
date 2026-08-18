"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { APP_NAV } from "@/components/layout/nav-items";
import { IconClose } from "@/components/ui/icons";

interface DashboardShellProps {
  children: ReactNode;
}

function titleForPath(pathname: string): string {
  const match = APP_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Workspace";
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = useMemo(() => titleForPath(pathname), [pathname]);

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
    <div className="flex min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 lg:block dark:border-zinc-800">
        <div className="sticky top-0 h-screen">
          <Sidebar />
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
          <aside className="relative h-full w-[min(18rem,86vw)] border-r border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <button
              type="button"
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <IconClose className="h-4 w-4" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenSidebar={() => setMobileOpen(true)} />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
