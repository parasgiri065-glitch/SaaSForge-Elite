"use client";

import { TiltStage } from "@/components/marketing/tilt-stage";

const NAV = ["Overview", "AI Agent", "Billing", "Team"] as const;
const BARS = [42, 58, 51, 73, 66, 81, 74, 90, 84, 96] as const;

export function ProductStage() {
  return (
    <TiltStage>
      <div className="glass-panel relative overflow-hidden rounded-[28px] p-2 md:p-3">
        <div
          className="pointer-events-none absolute -top-20 right-10 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl"
          style={{ transform: "translateZ(36px)" }}
        />
        <div
          className="relative grid min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b12] md:grid-cols-[148px_1fr]"
          style={{ transform: "translateZ(26px)" }}
        >
          <aside className="hidden border-r border-white/10 p-3 md:block">
            <p className="px-2 text-[10px] tracking-[0.16em] text-white/35 uppercase">
              Acme Labs
            </p>
            <ul className="mt-3 space-y-1">
              {NAV.map((item, index) => (
                <li
                  key={item}
                  className={`rounded-lg px-2 py-1.5 text-[12px] ${
                    index === 0 ? "bg-white/10 text-white" : "text-white/45"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-white/40">MRR</p>
                <p className="text-xl font-semibold tracking-tight">$48,920</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">
                +12.4%
              </span>
            </div>

            <div className="flex h-24 items-end gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              {BARS.map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-sm bg-gradient-to-t from-violet-600/30 to-violet-300"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-white/40">Active seats</p>
                <p className="mt-1 text-lg font-medium">128 / 150</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-cyan-200/70">Agent</p>
                <p className="mt-1 text-sm text-white/80">Drafting Q3 renewal…</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-cyan-300/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TiltStage>
  );
}
