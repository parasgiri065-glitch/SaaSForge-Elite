import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo team",
  robots: { index: false, follow: false },
};

export default function DemoTeamPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Demo workspace — invite flows stay behind RLS in a live project.
      </p>
    </main>
  );
}
