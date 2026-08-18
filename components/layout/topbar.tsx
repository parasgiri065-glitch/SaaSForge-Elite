"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { IconMenu } from "@/components/ui/icons";

interface TopbarProps {
  title: string;
  onOpenSidebar: () => void;
}

export function Topbar({ title, onOpenSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md md:px-6 dark:border-zinc-800 dark:bg-zinc-950/80">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 md:hidden dark:border-zinc-700 dark:text-zinc-200"
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
