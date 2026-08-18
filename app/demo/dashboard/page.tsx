import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo dashboard",
  robots: { index: false, follow: false },
};

const STATS = [
  { label: "Organization", value: "Acme Labs" },
  { label: "Role", value: "owner" },
  { label: "Plan", value: "Growth · active" },
] as const;

const ACTIVITY = [
  { title: "Seat invited", detail: "billing@acme.test · 2h ago" },
  { title: "Invoice paid", detail: "INV-2026-004 · $49.00" },
  { title: "Agent run", detail: "Q3 renewal draft · 14s" },
] as const;

export default function DemoDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
      <div>
        <p className="text-sm text-white/45">Workspace</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, Ada</h2>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <article
            key={stat.label}
            className="glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5"
          >
            <p className="text-xs text-white/40">{stat.label}</p>
            <p className="mt-2 text-lg font-semibold">{stat.value}</p>
          </article>
        ))}
      </section>
      <section className="glass-panel rounded-2xl p-5">
        <p className="text-sm font-medium">Recent activity</p>
        <ul className="mt-3 divide-y divide-white/10">
          {ACTIVITY.map((item) => (
            <li key={item.title} className="flex items-center justify-between py-3">
              <span className="text-sm">{item.title}</span>
              <span className="text-xs text-white/40">{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/demo/agents"
          className="glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5"
        >
          <p className="font-medium">Open the AI agent</p>
          <p className="mt-1 text-sm text-white/50">
            Streaming chat with a locked composer.
          </p>
        </Link>
        <Link
          href="/demo/settings/billing"
          className="glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5"
        >
          <p className="font-medium">Billing settings</p>
          <p className="mt-1 text-sm text-white/50">Plan, invoices, and the portal.</p>
        </Link>
      </section>
    </main>
  );
}
