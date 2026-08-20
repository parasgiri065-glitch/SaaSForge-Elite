import type { Metadata } from "next";
import { layoutClasses } from "@/lib/ui/layout-classes";

export const metadata: Metadata = {
  title: "Demo team",
  robots: { index: false, follow: false },
};

export default function DemoTeamPage() {
  return (
    <main className={layoutClasses.narrowColumn}>
      <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Demo workspace — invite flows stay behind RLS in a live project.
      </p>
    </main>
  );
}
