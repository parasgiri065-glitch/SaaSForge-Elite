"use client";

import { useTheme } from "@/hooks/use-theme";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { controlClasses } from "@/lib/ui/layout-classes";

/**
 * Icon button that flips light/dark preference.
 *
 * @returns A toggle button bound to `useTheme()`.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDarkTheme}
      className={controlClasses.iconButton}
    >
      {isDarkTheme ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
    </button>
  );
}
