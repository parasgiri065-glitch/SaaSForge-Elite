import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/require-user";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Signed in as</p>
          <h1 className="text-2xl font-semibold">
            {user.profile?.full_name ?? user.email}
          </h1>
        </div>
        <SignOutButton />
      </header>
      <dl className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-6 text-sm">
        <div>
          <dt className="text-neutral-500">Organization</dt>
          <dd className="font-medium">
            {user.organization?.name ?? "Unassigned"}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-500">Role</dt>
          <dd className="font-medium">{user.role}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Subscription</dt>
          <dd className="font-medium">{user.subscription?.status ?? "none"}</dd>
        </div>
      </dl>
    </main>
  );
}
