import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
        SaaSForge Elite
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">
        Multi-tenant auth, RLS, and Stripe billing — already wired.
      </h1>
      <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        Organizations, users, profiles, and subscriptions sit behind Postgres Row-Level
        Security. Open the live demo to walk the dashboard and streaming AI chat without
        signing in.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/demo/dashboard"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Open live demo
        </Link>
        <Link
          href="/demo/agents"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Try AI chat
        </Link>
        <Link
          href="/login"
          className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
