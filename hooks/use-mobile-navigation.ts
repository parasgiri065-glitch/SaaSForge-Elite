"use client";

import { useCallback, useEffect, useState } from "react";

export type MobileNavigationState = {
  isMobileNavigationOpen: boolean;
  openMobileNavigation: () => void;
  closeMobileNavigation: () => void;
};

/**
 * Owns the mobile sidebar drawer — UI layout state only, no data fetching.
 * Locks `document.body` overflow while the drawer is open so the page cannot
 * scroll underneath the scrim.
 *
 * @returns Open flag plus open/close callbacks for the dashboard shell.
 */
export function useMobileNavigation(): MobileNavigationState {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

  useEffect(() => {
    if (!isMobileNavigationOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavigationOpen]);

  const openMobileNavigation = useCallback(() => {
    setIsMobileNavigationOpen(true);
  }, []);

  const closeMobileNavigation = useCallback(() => {
    setIsMobileNavigationOpen(false);
  }, []);

  return {
    isMobileNavigationOpen,
    openMobileNavigation,
    closeMobileNavigation,
  };
}
