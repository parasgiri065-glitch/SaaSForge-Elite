"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8">
            <p className="text-xs font-medium tracking-wide text-indigo-600 uppercase">
              SaaSForge Elite
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              The app failed to start
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              A root-level error stopped rendering. Retry before signing in again.
            </p>
            {error.digest ? (
              <p className="mt-3 font-mono text-[11px] text-zinc-400">
                ref {error.digest}
              </p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white"
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
