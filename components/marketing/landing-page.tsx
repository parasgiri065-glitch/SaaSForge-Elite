import Link from "next/link";
import { StudioStage } from "@/components/marketing/studio-stage";

interface LandingPageProps {
  displayClassName: string;
}

const FEATURES = [
  {
    title: "Multi-tenant cut",
    body: "Every frame of data is scoped by organization. RLS is the negative.",
  },
  {
    title: "Billing on the timeline",
    body: "Stripe webhooks land idempotent. Entitlements flip only after the signature.",
  },
  {
    title: "Agent as a track",
    body: "Streaming markdown, locked composer, tenant-bound tools. No raw model keys in the browser.",
  },
] as const;

export function LandingPage({ displayClassName }: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07060c] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[140px] animate-aurora" />
        <div className="absolute top-40 -left-24 h-[360px] w-[360px] rounded-full bg-cyan-400/15 blur-[120px] animate-float-slow" />
        <div className="absolute right-[-80px] bottom-10 h-[300px] w-[300px] rounded-full bg-fuchsia-500/20 blur-[110px] animate-float-mid" />
        <div className="cinematic-grid absolute inset-0" />
        <div className="cinematic-grain" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold tracking-wide">
            SF
          </span>
          <span className="text-sm font-medium tracking-[0.18em] text-white/70 uppercase">
            SaaSForge
          </span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/demo/agents" className="hidden text-white/60 hover:text-white sm:inline">
            Agent
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-6 pb-24 md:pt-10">
        <section className="mx-auto max-w-3xl text-center">
          <p className="animate-rise text-xs tracking-[0.32em] text-violet-200/80 uppercase">
            Cinematic SaaS infrastructure
          </p>
          <h1
            className={`${displayClassName} animate-rise mt-4 text-5xl leading-[0.95] text-white sm:text-7xl`}
            style={{ animationDelay: "80ms" }}
          >
            Cut the <span className="text-shimmer">100-hour</span> setup reel.
          </h1>
          <p
            className="animate-rise mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Auth, tenancy, Stripe, and a streaming agent — graded, synced, and ready to
            ship. Less scaffolding. More picture.
          </p>
          <div
            className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/demo/dashboard"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_40px_rgba(167,139,250,0.35)] transition hover:scale-[1.03]"
            >
              Enter the studio
            </Link>
            <Link
              href="/demo/agents"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/80 backdrop-blur hover:bg-white/10"
            >
              Play the agent
            </Link>
          </div>
        </section>

        <section className="animate-rise" style={{ animationDelay: "320ms" }}>
          <StudioStage />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className="glass-panel animate-rise rounded-2xl p-5"
              style={{ animationDelay: `${400 + index * 80}ms` }}
            >
              <p className="text-[11px] tracking-[0.22em] text-violet-200/70 uppercase">
                0{index + 1}
              </p>
              <h2 className="mt-3 text-lg font-medium">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">{feature.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
