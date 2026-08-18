import Link from "next/link";
import { ProductStage } from "@/components/marketing/product-stage";

interface LandingPageProps {
  displayClassName: string;
}

const FEATURES = [
  {
    title: "Multi-tenant by default",
    body: "Every row is scoped by organization. RLS and server guards agree — no shared workspace shortcuts.",
  },
  {
    title: "Billing that stays honest",
    body: "Signed Stripe webhooks, idempotent events, and entitlements that flip only after verification.",
  },
  {
    title: "An agent inside the product",
    body: "Streaming answers, a locked composer, tenant-bound tools. The model never holds the keys.",
  },
] as const;

export function LandingPage({ displayClassName }: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07060c] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[140px] animate-aurora" />
        <div className="absolute top-48 -left-20 h-[280px] w-[280px] rounded-full bg-indigo-400/10 blur-[110px]" />
        <div className="cinematic-grid absolute inset-0 opacity-60" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold">
            SF
          </span>
          <span className="text-sm font-medium text-white/75">SaaSForge Elite</span>
        </div>
        <Link
          href="/login"
          className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
        >
          Sign in
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-8 pb-24 md:pt-14">
        <section className="mx-auto max-w-3xl text-center">
          <p className="animate-rise text-sm text-violet-200/80">Enterprise boilerplate</p>
          <h1
            className={`${displayClassName} animate-rise mt-4 text-5xl leading-[1.05] text-white sm:text-6xl`}
            style={{ animationDelay: "80ms" }}
          >
            Ship the product.
            <br />
            Skip the 100-hour setup.
          </h1>
          <p
            className="animate-rise mx-auto mt-5 max-w-xl text-base text-white/55 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Auth, tenancy, Stripe, and a streaming AI agent — already wired, typed, and
            isolated. Open the live workspace and click around.
          </p>
          <div
            className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/demo/dashboard"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_36px_rgba(139,92,246,0.28)] transition hover:scale-[1.03]"
            >
              Open live demo
            </Link>
            <Link
              href="/demo/agents"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
            >
              Try the AI agent
            </Link>
          </div>
        </section>

        <section className="animate-rise" style={{ animationDelay: "300ms" }}>
          <ProductStage />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className="glass-panel animate-rise rounded-2xl p-5"
              style={{ animationDelay: `${380 + index * 70}ms` }}
            >
              <h2 className="text-lg font-medium">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">{feature.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
