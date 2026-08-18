import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-neutral-500">
        SaaSForge Elite
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">
        Multi-tenant auth, RLS, and Stripe billing — already wired.
      </h1>
      <p className="max-w-2xl text-lg text-neutral-600">
        Organizations, users, profiles, and subscriptions sit behind Postgres
        Row-Level Security. Sessions are verified on the server. Stripe webhooks
        update tenant entitlements only after signature verification.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Create a workspace
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
