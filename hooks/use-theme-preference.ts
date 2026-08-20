"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme/storage-key";

export type ThemePreference = "light" | "dark";

export type ThemePreferenceState = {
  theme: ThemePreference;
  setTheme: (nextTheme: ThemePreference) => void;
  toggleTheme: () => void;
};

/**
 * Read a stored theme from localStorage, ignoring invalid values.
 *
 * @returns `"light"`, `"dark"`, or `null` when unset / unavailable.
 */
function readStoredThemePreference(): ThemePreference | null {
  if (typeof window === "undefined") {
    return null;
  }
  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedValue === "light" || storedValue === "dark" ? storedValue : null;
}

/**
 * Apply the theme class and color-scheme to `<html>`.
 *
 * @param themePreference - `"light"` or `"dark"`.
 * @returns Nothing.
 */
function applyThemePreference(themePreference: ThemePreference): void {
  document.documentElement.classList.toggle("dark", themePreference === "dark");
  document.documentElement.style.colorScheme = themePreference;
}

/**
 * Theme preference state machine (storage + system preference).
 * The provider only publishes this value — no extra UI state lives there.
 *
 * @returns Current theme plus set/toggle callbacks.
 */
export function useThemePreference(): ThemePreferenceState {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof document === "undefined") {
      return "light";
    }
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onPreferenceChange = () => {
      if (readStoredThemePreference()) {
        return;
      }
      const nextTheme: ThemePreference = mediaQuery.matches ? "dark" : "light";
      setThemeState(nextTheme);
      applyThemePreference(nextTheme);
    };
    mediaQuery.addEventListener("change", onPreferenceChange);
    return () => {
      mediaQuery.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    setThemeState(nextTheme);
    applyThemePreference(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  return useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [setTheme, theme, toggleTheme],
  );
}
