import type { ReactNode } from "react";
import { redirectIfAuthenticated } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  await redirectIfAuthenticated();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      {children}
    </main>
  );
}
