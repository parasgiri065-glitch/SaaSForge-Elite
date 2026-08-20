"use client";

import { useThemeContext } from "@/components/providers/theme-provider";
import type { ThemePreferenceState } from "@/hooks/use-theme-preference";

/**
 * Read the current theme preference.
 *
 * @returns `{ theme, setTheme, toggleTheme }`.
 */
export function useTheme(): ThemePreferenceState {
  return useThemeContext();
}
