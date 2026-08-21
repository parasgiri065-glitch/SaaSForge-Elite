const NAV = ["Overview", "AI Agent", "Billing", "Team"] as const;
const METRICS = [
  { label: "MRR", value: "$48,920", hint: "+12.4%" },
  { label: "Active seats", value: "128 / 150", hint: "Acme Labs" },
  { label: "Groq latency", value: "42 ms", hint: "llama-3.1-8b" },
] as const;

/**
 * Command-center product mock for the landing page.
 *
 * @returns A Notion-style workspace preview (no 3D tilt).
 */
export function ProductStage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <p className="font-mono text-[11px] tracking-wide text-zinc-500">
            saasforge.app / command-center
          </p>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            Live
          </span>
        </div>

        <div className="grid min-h-[360px] md:grid-cols-[200px_1fr]">
          <aside className="hidden border-r border-zinc-800 p-4 md:block">
            <p className="px-2 text-[10px] tracking-[0.16em] text-zinc-500 uppercase">
              Acme Labs
            </p>
            <ul className="mt-3 space-y-1">
              {NAV.map((item, index) => (
                <li
                  key={item}
                  className={`rounded-lg px-2.5 py-1.5 text-[12px] ${
                    index === 1
                      ? "border border-zinc-800 bg-zinc-900 text-zinc-50"
                      : "text-zinc-500"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex flex-col gap-4 p-4 md:p-5">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
              <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                ⌘K
              </span>
              <span className="text-sm text-zinc-500">
                Ask Groq to draft an RLS policy…
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-3"
                >
                  <p className="text-[10px] tracking-wide text-zinc-500 uppercase">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-lg font-medium tracking-tight text-zinc-50">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{metric.hint}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-[10px] tracking-wide text-zinc-500 uppercase">
                Agent · Groq llama-3.1-8b-instant
              </p>
              <div className="ml-auto max-w-[85%] rounded-lg bg-zinc-800 px-3 py-2 text-xs leading-5 text-zinc-200">
                Draft a Lemon Squeezy order_created handler.
              </div>
              <div className="max-w-[90%] rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs leading-5 text-zinc-300">
                Verify HMAC-SHA256 against the raw body, then PUT the buyer as a GitHub{" "}
                <span className="text-zinc-100">pull</span> collaborator. Never JSON.parse
                first.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
