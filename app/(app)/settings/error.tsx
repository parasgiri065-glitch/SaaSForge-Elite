"use client";

import { AppErrorFallback } from "@/components/system/app-error-fallback";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorFallback
      title="Settings failed to load"
      description="Billing or team data could not be rendered. Retry this page — the rest of the workspace is unaffected."
      digest={error.digest}
      reset={reset}
      homeHref="/dashboard"
    />
  );
}
