import type { ReactNode } from "react";
import { redirectIfAuthenticated } from "@/lib/auth/require-user";
import { layoutClasses } from "@/lib/ui/layout-classes";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  await redirectIfAuthenticated();
  return <main className={layoutClasses.authPage}>{children}</main>;
}
