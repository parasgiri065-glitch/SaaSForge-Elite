"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { IconMenu } from "@/components/ui/icons";
import { controlClasses, layoutClasses } from "@/lib/ui/layout-classes";

interface TopbarProps {
  title: string;
  onOpenSidebar: () => void;
}

/**
 * Sticky workspace top bar: mobile menu, page title, theme toggle.
 *
 * @param props.title - Resolved page title from the current route.
 * @param props.onOpenSidebar - Opens the mobile navigation drawer.
 * @returns The header element.
 */
export function Topbar({ title, onOpenSidebar }: TopbarProps) {
  return (
    <header className={layoutClasses.stickyTopbar}>
      <button
        type="button"
        className={controlClasses.menuButton}
        onClick={onOpenSidebar}
        aria-label="Open navigation"
      >
        <IconMenu className="h-4 w-4" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight md:text-base">
        {title}
      </h1>
      <ThemeToggle />
    </header>
  );
}
