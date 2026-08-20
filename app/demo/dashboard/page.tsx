import type { Metadata } from "next";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/metric-card";
import { layoutClasses, metricCardClasses } from "@/lib/ui/layout-classes";

export const metadata: Metadata = {
  title: "Demo dashboard",
  robots: { index: false, follow: false },
};

const DEMO_STATS = [
  { label: "Organization", value: "Acme Labs" },
  { label: "Role", value: "owner" },
  { label: "Plan", value: "Growth · active" },
] as const;

const DEMO_ACTIVITY = [
  { title: "Seat invited", detail: "billing@acme.test · 2h ago" },
  { title: "Invoice paid", detail: "INV-2026-004 · $49.00" },
  { title: "Agent run", detail: "Q3 renewal draft · 14s" },
] as const;

export default function DemoDashboardPage() {
  return (
    <main className={layoutClasses.pageColumn}>
      <div>
        <p className="text-sm text-white/45">Workspace</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, Ada</h2>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        {DEMO_STATS.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            variant="demo"
          />
        ))}
      </section>
      <section className={layoutClasses.glassCardPad}>
        <p className="text-sm font-medium">Recent activity</p>
        <ul className="mt-3 divide-y divide-white/10">
          {DEMO_ACTIVITY.map((item) => (
            <li key={item.title} className="flex items-center justify-between py-3">
              <span className="text-sm">{item.title}</span>
              <span className="text-xs text-white/40">{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/demo/agents" className={metricCardClasses.demo}>
          <p className="font-medium">Open the AI agent</p>
          <p className="mt-1 text-sm text-white/50">
            Streaming chat with a locked composer.
          </p>
        </Link>
        <Link href="/demo/settings/billing" className={metricCardClasses.demo}>
          <p className="font-medium">Billing settings</p>
          <p className="mt-1 text-sm text-white/50">Plan, invoices, and the portal.</p>
        </Link>
      </section>
    </main>
  );
}
