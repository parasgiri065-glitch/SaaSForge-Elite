import { cn } from "@/lib/ui/cn";
import type { InvoiceStatus } from "@/types/billing";

/**
 * Semantic layout tokens for the product chrome.
 * Keep long Tailwind strings here so screens read as structure, not clutter.
 */
export const layoutClasses = {
  productCanvas: "relative min-h-screen overflow-hidden bg-[#07060c] text-white",
  workspaceCanvas: "relative flex min-h-screen overflow-hidden bg-[#07060c] text-white",
  productGlowLayer: "pointer-events-none absolute inset-0",
  productGlowPrimary:
    "absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[140px] animate-aurora",
  productGlowSecondary:
    "absolute top-48 -left-20 h-[280px] w-[280px] rounded-full bg-indigo-400/10 blur-[110px]",
  productGrid: "cinematic-grid absolute inset-0 opacity-60",
  shellGlowPrimary:
    "absolute top-[-20%] left-[20%] h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]",
  shellGlowSecondary:
    "absolute right-[-10%] bottom-[-10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]",
  pageColumn: "mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6",
  billingColumn: "mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6",
  narrowColumn: "mx-auto max-w-3xl px-4 py-10 md:px-6",
  glassCard: "glass-panel rounded-2xl",
  glassCardPad: "glass-panel rounded-2xl p-5",
  stickyTopbar:
    "sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-black/20 px-4 backdrop-blur-xl md:px-6",
  sidebarRoot: "flex h-full flex-col bg-black/20 backdrop-blur-xl",
  desktopSidebar: "relative z-10 hidden w-64 shrink-0 border-r border-white/10 lg:block",
  mobileDrawerRoot: "fixed inset-0 z-40 lg:hidden",
  mobileDrawerScrim: "absolute inset-0 bg-zinc-950/50",
  mobileDrawerPanel:
    "relative h-full w-[min(18rem,86vw)] border-r border-white/10 bg-[#0b0a12] shadow-2xl",
  chatColumn: "flex h-[calc(100dvh-4rem)] flex-col",
  chatScroller: "flex-1 scrollbar-thin overflow-y-auto px-4 py-6 md:px-6",
  composerBar: "border-t border-white/10 bg-black/30 p-3 backdrop-blur-xl md:p-4",
  composerShell:
    "mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2",
  authForm: "flex flex-col gap-4",
  authPage: "mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16",
  marketingHeader:
    "relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6",
  marketingMain:
    "relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-8 pb-24 md:pt-14",
} as const;

/**
 * Repeated control chrome (inputs, icon buttons, CTAs).
 */
export const controlClasses = {
  textField: "rounded-md border border-neutral-300 px-3 py-2",
  fieldLabel: "flex flex-col gap-1 text-sm",
  iconButton:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/10",
  menuButton:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 md:hidden",
  closeButton:
    "absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500",
  ghostLink:
    "rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5",
  primaryCta:
    "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_rgba(139,92,246,0.22)] transition duration-200 hover:scale-[1.03] hover:shadow-[0_0_42px_rgba(139,92,246,0.5)]",
  secondaryCta:
    "rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10",
  submitButton:
    "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900",
  composerTextarea:
    "max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60",
  underlineLink: "underline",
} as const;

const navLinkVariants = {
  active: "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  idle: "text-white/55 hover:bg-white/5 hover:text-white",
} as const;

/**
 * Sidebar link surface for the current route versus its neighbors.
 *
 * @param isCurrentRoute - Whether this item matches the active pathname.
 * @returns Combined layout + state classes for a workspace nav link.
 */
export function navLinkClassName(isCurrentRoute: boolean): string {
  return cn(
    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
    isCurrentRoute ? navLinkVariants.active : navLinkVariants.idle,
  );
}

const chatBubbleVariants = {
  user: "rounded-br-md bg-violet-500 text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)]",
  assistant: "rounded-bl-md border border-white/10 bg-white/10 text-white",
} as const;

/**
 * Chat bubble chrome for a user or assistant turn.
 *
 * @param isUserMessage - `true` for the human bubble (right-aligned fill).
 * @returns Combined size + variant classes for the bubble body.
 */
export function chatBubbleClassName(isUserMessage: boolean): string {
  return cn(
    "max-w-[min(100%,42rem)] rounded-2xl px-4 py-3 shadow-sm",
    isUserMessage ? chatBubbleVariants.user : chatBubbleVariants.assistant,
  );
}

/**
 * Pill colors for an active versus inactive subscription.
 *
 * @param isSubscriptionActive - Whether the org currently has an entitled plan.
 * @returns Badge classes for the plan status chip.
 */
export function subscriptionStatusClassName(isSubscriptionActive: boolean): string {
  return cn(
    "rounded-full px-2.5 py-1 text-xs font-medium",
    isSubscriptionActive
      ? "bg-emerald-400/15 text-emerald-200"
      : "bg-white/10 text-white/60",
  );
}

export const invoiceStatusClasses: Record<InvoiceStatus, string> = {
  paid: "text-emerald-300",
  open: "text-amber-300",
  void: "text-white/40",
  uncollectible: "text-rose-300",
};

export const markdownClasses = {
  inlineCode:
    "rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-[0.85em] dark:bg-zinc-800",
  link: "underline decoration-indigo-400 underline-offset-2",
  heading: "mt-3 mb-1 font-semibold tracking-tight first:mt-0",
  paragraph: "my-1.5 text-sm leading-6",
  codeBlock:
    "my-2 overflow-x-auto rounded-xl bg-zinc-950 p-3 text-[13px] leading-relaxed text-zinc-100 dark:bg-black",
  caret:
    "animate-caret ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-indigo-500 align-middle",
} as const;

export const metricCardClasses = {
  live: "rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900",
  liveLink:
    "rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50",
  demo: "glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5",
} as const;
