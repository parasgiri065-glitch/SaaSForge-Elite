"use client";

import { AppErrorFallback } from "@/components/system/app-error-fallback";

export default function AgentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorFallback
      title="Agent stream failed"
      description="The AI workspace hit an error. Your other dashboard pages are still available."
      digest={error.digest}
      reset={reset}
      homeHref="/dashboard"
    />
  );
}
