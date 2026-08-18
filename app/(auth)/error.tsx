"use client";

import { AppErrorFallback } from "@/components/system/app-error-fallback";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorFallback
      title="Sign-in interrupted"
      description="The auth page crashed before a session could be established. Retry or go back to the marketing site."
      digest={error.digest}
      reset={reset}
      homeHref="/"
    />
  );
}
