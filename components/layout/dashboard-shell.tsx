"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProductAtmosphere } from "@/components/layout/product-atmosphere";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { IconClose } from "@/components/ui/icons";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { resolveWorkspacePageTitle } from "@/components/layout/nav-items";
import { layoutClasses, controlClasses } from "@/lib/ui/layout-classes";

interface DashboardShellProps {
  children: ReactNode;
  basePath?: string;
}

/**
 * Authenticated (and demo) workspace chrome: sidebar + topbar + main.
 * Mobile drawer state lives in `useMobileNavigation` — not in this file.
 *
 * @param props.children - Page content.
 * @param props.basePath - `""` or `"/demo"` prefix for nav links.
 * @returns The full workspace shell.
 */
export function DashboardShell({ children, basePath = "" }: DashboardShellProps) {
  const pathname = usePathname();
  const { isMobileNavigationOpen, openMobileNavigation, closeMobileNavigation } =
    useMobileNavigation();
  const pageTitle = useMemo(
    () => resolveWorkspacePageTitle(pathname, basePath),
    [basePath, pathname],
  );

  return (
    <div className={layoutClasses.workspaceCanvas}>
      <ProductAtmosphere variant="workspace" />
      <aside className={layoutClasses.desktopSidebar}>
        <div className="sticky top-0 h-screen">
          <Sidebar basePath={basePath} />
        </div>
      </aside>

      {isMobileNavigationOpen ? (
        <div className={layoutClasses.mobileDrawerRoot}>
          <button
            type="button"
            className={layoutClasses.mobileDrawerScrim}
            aria-label="Close navigation"
            onClick={closeMobileNavigation}
          />
          <aside className={layoutClasses.mobileDrawerPanel}>
            <button
              type="button"
              className={controlClasses.closeButton}
              onClick={closeMobileNavigation}
              aria-label="Close navigation"
            >
              <IconClose className="h-4 w-4" />
            </button>
            <Sidebar basePath={basePath} onNavigate={closeMobileNavigation} />
          </aside>
        </div>
      ) : null}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar title={pageTitle} onOpenSidebar={openMobileNavigation} />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
