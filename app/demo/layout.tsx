import type { ReactNode } from "react";
import { DemoAuthProvider } from "@/components/providers/demo-auth-provider";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoAuthProvider>
      <DashboardShell basePath="/demo">{children}</DashboardShell>
    </DemoAuthProvider>
  );
}
