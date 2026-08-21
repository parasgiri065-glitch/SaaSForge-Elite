const NAV = ["Overview", "Billing", "Team", "Settings"] as const;
const METRICS = [
  { label: "MRR", value: "$48,920", hint: "+12.4%" },
  { label: "Active seats", value: "128 / 150", hint: "Acme Labs" },
  { label: "Plan", value: "Growth", hint: "stripe_price_id" },
] as const;
const INVOICES = [
  { id: "in_1N8c…", status: "paid", amount: "$79.00" },
  { id: "in_1N7k…", status: "paid", amount: "$79.00" },
  { id: "in_1N6p…", status: "open", amount: "$79.00" },
] as const;

/**
 * Tenant dashboard mock for the landing page. Billing chrome only — no chat.
 *
 * @returns A Notion-style workspace preview.
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
            saasforge.app / dashboard
          </p>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            RLS on
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
                    index === 0
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

            <div className="grid flex-1 gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-[10px] tracking-wide text-zinc-500 uppercase">
                  Subscription · per organization
                </p>
                <p className="mt-2 text-sm text-zinc-200">cus_9f2a… · Growth</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Customer id is read from Postgres after getClaims(). The browser never
                  sends it. Portal POST body is empty JSON.
                </p>
                <div className="mt-3 inline-flex h-8 items-center rounded-lg border border-zinc-800 px-3 text-[11px] font-medium text-zinc-300">
                  Manage Subscription
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-[10px] tracking-wide text-zinc-500 uppercase">
                  stripe_webhook_events
                </p>
                <ul className="mt-2 space-y-2">
                  {INVOICES.map((invoice) => (
                    <li
                      key={invoice.id}
                      className="flex items-center justify-between font-mono text-[11px] text-zinc-400"
                    >
                      <span>{invoice.id}</span>
                      <span
                        className={
                          invoice.status === "paid"
                            ? "text-emerald-400"
                            : "text-amber-300"
                        }
                      >
                        {invoice.status}
                      </span>
                      <span className="text-zinc-200">{invoice.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
