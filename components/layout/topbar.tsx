"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { IconMenu } from "@/components/ui/icons";

interface TopbarProps {
  title: string;
  onOpenSidebar: () => void;
}

export function Topbar({ title, onOpenSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-black/20 px-4 backdrop-blur-xl md:px-6">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
      >
        <IconMenu className="h-4 w-4" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight md:text-base">
        {title}
      </h1>
      <span className="hidden rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white/45 uppercase sm:inline">
        rec · live
      </span>
      <ThemeToggle />
    </header>
  );
}
