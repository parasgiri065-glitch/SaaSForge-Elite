"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { isDemoMode } from "@/lib/env";

export type SignOutActionState = {
  isSigningOut: boolean;
  handleSignOut: () => Promise<void>;
};

/**
 * Sign-out action plus post-logout routing.
 * Demo (or `/demo/*`) returns to marketing; live sessions return to `/login`.
 *
 * @returns Pending flag and the click handler.
 */
export function useSignOutAction(): SignOutActionState {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut(): Promise<void> {
    setIsSigningOut(true);
    await signOut();
    const destinationPath = isDemoMode || pathname.startsWith("/demo") ? "/" : "/login";
    router.replace(destinationPath);
    router.refresh();
  }

  return { isSigningOut, handleSignOut };
}
