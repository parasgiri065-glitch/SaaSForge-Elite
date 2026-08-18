import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-600">
          New here?{" "}
          <Link href="/signup" className="underline">
            Create a workspace
          </Link>
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
