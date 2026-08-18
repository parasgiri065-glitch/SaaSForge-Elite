"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/env";

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    await signOut();
    const next = isDemoMode || pathname.startsWith("/demo") ? "/" : "/login";
    router.replace(next);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="w-full"
      disabled={pending}
      onClick={() => {
        void onClick();
      }}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
