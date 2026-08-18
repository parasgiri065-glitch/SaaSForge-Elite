import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create workspace",
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Create a workspace</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Already have one?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
