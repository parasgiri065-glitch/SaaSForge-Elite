/**
 * Landing-page visual tokens: command-center / Notion density on zinc-950.
 * Isolated from product chrome so the dashboard can keep its own surfaces.
 */
export const marketingClasses = {
  canvas: "relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50",
  ambient:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_58%)]",
  header: "sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl",
  headerInner: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6",
  main: "relative z-10 mx-auto flex max-w-6xl flex-col gap-24 px-6 pt-16 pb-28 md:gap-28 md:pt-24",
  eyebrow: "text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase",
  heading: "text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl",
  body: "text-sm leading-7 text-zinc-400 sm:text-base",
  card: "rounded-2xl border border-zinc-800 bg-zinc-950/80",
  primaryCta:
    "inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_rgba(139,92,246,0.22)] transition duration-200 hover:scale-[1.03] hover:shadow-[0_0_42px_rgba(139,92,246,0.5)]",
  secondaryCta:
    "inline-flex h-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 px-5 text-sm font-medium text-zinc-200 transition duration-200 hover:border-zinc-600 hover:bg-zinc-900",
  ghostLink:
    "rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100",
  footer: "relative z-10 border-t border-zinc-800 bg-zinc-950",
} as const;
