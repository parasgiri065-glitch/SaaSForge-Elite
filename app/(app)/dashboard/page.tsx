import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {user.profile?.full_name ?? user.email}
        </h2>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs tracking-wide text-zinc-500 uppercase">Organization</p>
          <p className="mt-2 text-lg font-semibold">
            {user.organization?.name ?? "Unassigned"}
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs tracking-wide text-zinc-500 uppercase">Role</p>
          <p className="mt-2 text-lg font-semibold capitalize">{user.role}</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs tracking-wide text-zinc-500 uppercase">Subscription</p>
          <p className="mt-2 text-lg font-semibold">
            {user.subscription?.status ?? "none"}
          </p>
        </article>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/agents"
          className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
        >
          <p className="font-medium">Open the AI agent</p>
          <p className="mt-1 text-sm text-zinc-500">Streaming chat with markdown.</p>
        </Link>
        <Link
          href="/settings/billing"
          className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
        >
          <p className="font-medium">Billing settings</p>
          <p className="mt-1 text-sm text-zinc-500">Plan, invoices, and portal.</p>
        </Link>
      </section>
    </main>
  );
}
