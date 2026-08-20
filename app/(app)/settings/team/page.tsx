import type { Metadata } from "next";
import { layoutClasses } from "@/lib/ui/layout-classes";

export const metadata: Metadata = {
  title: "Team",
  robots: { index: false, follow: false },
};

export default function TeamSettingsPage() {
  return (
    <main className={layoutClasses.narrowColumn}>
      <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Invite flows live behind RLS. This panel is a placeholder so navigation stays
        complete.
      </p>
    </main>
  );
}
