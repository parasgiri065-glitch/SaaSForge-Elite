import { AppErrorFallback } from "@/components/system/app-error-fallback";

export default function NotFound() {
  return (
    <AppErrorFallback
      title="Page not found"
      description="That route does not exist in this workspace. Check the URL or return to the dashboard."
      homeHref="/dashboard"
    />
  );
}
