"use client";

import { AppErrorFallback } from "@/components/system/app-error-fallback";

export default function AppSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorFallback
      title="Workspace unavailable"
      description="The dashboard could not load this view. Billing and auth APIs are isolated — retry this panel without leaving the app."
      digest={error.digest}
      reset={reset}
      homeHref="/dashboard"
    />
  );
}
