import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { requireUser } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export default async function ProtectedAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <RequireAuth>
      <div className="min-h-screen">{children}</div>
    </RequireAuth>
  );
}
