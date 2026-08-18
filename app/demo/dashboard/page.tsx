import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo dashboard",
  robots: { index: false, follow: false },
};

export default function DemoDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Live demo · Acme Labs</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Ada Lovelace</h2>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs tracking-wide text-zinc-500 uppercase">Organization</p>
          <p className="mt-2 text-lg font-semibold">Acme Labs</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs tracking-wide text-zinc-500 uppercase">Role</p>
          <p className="mt-2 text-lg font-semibold capitalize">owner</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs tracking-wide text-zinc-500 uppercase">Subscription</p>
          <p className="mt-2 text-lg font-semibold">active</p>
        </article>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/demo/agents"
          className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
        >
          <p className="font-medium">Open the AI agent</p>
          <p className="mt-1 text-sm text-zinc-500">Streaming markdown chat mockup.</p>
        </Link>
        <Link
          href="/demo/settings/billing"
          className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
        >
          <p className="font-medium">Billing settings</p>
          <p className="mt-1 text-sm text-zinc-500">Plan card and invoice history.</p>
        </Link>
      </section>
    </main>
  );
}
