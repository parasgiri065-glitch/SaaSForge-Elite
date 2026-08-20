import type { Metadata } from "next";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/metric-card";
import { requireUser } from "@/lib/auth/require-user";
import { layoutClasses, metricCardClasses } from "@/lib/ui/layout-classes";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className={layoutClasses.pageColumn}>
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {user.profile?.full_name ?? user.email}
        </h2>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Organization"
          value={user.organization?.name ?? "Unassigned"}
        />
        <MetricCard
          label="Role"
          value={<span className="capitalize">{user.role}</span>}
        />
        <MetricCard label="Subscription" value={user.subscription?.status ?? "none"} />
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/agents" className={metricCardClasses.liveLink}>
          <p className="font-medium">Open the AI agent</p>
          <p className="mt-1 text-sm text-zinc-500">Streaming chat with markdown.</p>
        </Link>
        <Link href="/settings/billing" className={metricCardClasses.liveLink}>
          <p className="font-medium">Billing settings</p>
          <p className="mt-1 text-sm text-zinc-500">Plan, invoices, and portal.</p>
        </Link>
      </section>
    </main>
  );
}
