"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useThemePreference,
  type ThemePreference,
  type ThemePreferenceState,
} from "@/hooks/use-theme-preference";

export type Theme = ThemePreference;

const ThemeContext = createContext<ThemePreferenceState | null>(null);

/**
 * Publishes theme preference from `useThemePreference`.
 *
 * @param props.children - Tree that may call `useTheme()`.
 * @returns Context provider wrapping `children`.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useThemePreference();
  return <ThemeContext.Provider value={preference}>{children}</ThemeContext.Provider>;
}

/**
 * Read the theme context. Throws when used outside `ThemeProvider`.
 *
 * @returns Current theme plus set/toggle callbacks.
 */
export function useThemeContext(): ThemePreferenceState {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
