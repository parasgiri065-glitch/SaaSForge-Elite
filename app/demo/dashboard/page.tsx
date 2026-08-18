import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo dashboard",
  robots: { index: false, follow: false },
};

const STATS = [
  { label: "Organization", value: "Acme Labs" },
  { label: "Role", value: "owner" },
  { label: "Subscription", value: "active" },
] as const;

export default function DemoDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
      <div>
        <p className="text-xs tracking-[0.28em] text-violet-200/70 uppercase">
          Live demo · Acme Labs
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Ada Lovelace</h2>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <article
            key={stat.label}
            className="glass-panel rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          >
            <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase">{stat.label}</p>
            <p className="mt-2 text-lg font-semibold capitalize">{stat.value}</p>
          </article>
        ))}
      </section>
      <section className="glass-panel overflow-hidden rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between text-[11px] text-white/40">
          <span className="tracking-[0.2em] uppercase">Program timeline</span>
          <span className="font-mono">01:12:08</span>
        </div>
        <div className="relative space-y-2">
          <div className="flex h-8 gap-1">
            <div className="w-[28%] rounded-md bg-gradient-to-r from-violet-500 to-fuchsia-400" />
            <div className="w-[18%] rounded-md bg-gradient-to-r from-cyan-400 to-sky-500" />
            <div className="w-[22%] rounded-md bg-gradient-to-r from-amber-400 to-orange-500" />
          </div>
          <div className="flex h-6 items-end gap-px">
            {Array.from({ length: 36 }, (_, index) => (
              <span
                key={index}
                className="flex-1 rounded-sm bg-white/25"
                style={{ height: `${30 + ((index * 13) % 70)}%` }}
              />
            ))}
          </div>
          <div className="absolute inset-y-0 w-px bg-rose-400 shadow-[0_0_14px_#fb7185] animate-playhead" />
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/demo/agents"
          className="glass-panel rounded-2xl p-5 transition hover:-translate-y-1"
        >
          <p className="font-medium">Open the AI agent</p>
          <p className="mt-1 text-sm text-white/50">Streaming grade notes on a locked track.</p>
        </Link>
        <Link
          href="/demo/settings/billing"
          className="glass-panel rounded-2xl p-5 transition hover:-translate-y-1"
        >
          <p className="font-medium">Billing settings</p>
          <p className="mt-1 text-sm text-white/50">Plan, invoices, and the portal cut.</p>
        </Link>
      </section>
    </main>
  );
}
