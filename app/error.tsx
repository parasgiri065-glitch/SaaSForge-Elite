"use client";

import { AppErrorFallback } from "@/components/system/app-error-fallback";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorFallback
      title="Something broke"
      description="A page or data request failed. Your session is intact — retry or return home."
      digest={error.digest}
      reset={reset}
    />
  );
}
