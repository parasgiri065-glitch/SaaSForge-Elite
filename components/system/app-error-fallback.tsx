"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AppErrorFallbackProps {
  title: string;
  description: string;
  digest?: string;
  reset?: () => void;
  homeHref?: string;
}

/**
 * Shared error / not-found card used by App Router error boundaries.
 *
 * @param props.title - Heading.
 * @param props.description - Supporting copy.
 * @param props.digest - Optional Next.js error digest.
 * @param props.reset - Optional retry callback.
 * @param props.homeHref - Home link target (default `/`).
 * @returns A centered error card.
 */
export function AppErrorFallback({
  title,
  description,
  digest,
  reset,
  homeHref = "/",
}: AppErrorFallbackProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
          SaaSForge Elite
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        {digest ? (
          <p className="mt-3 font-mono text-[11px] text-zinc-400">ref {digest}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {reset ? (
            <Button type="button" onClick={reset}>
              Try again
            </Button>
          ) : null}
          <Link
            href={homeHref}
            className="inline-flex h-10 items-center rounded-lg border border-zinc-300 px-3.5 text-sm font-medium dark:border-zinc-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
