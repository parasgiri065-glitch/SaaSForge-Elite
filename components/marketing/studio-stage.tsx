"use client";

import { TiltStage } from "@/components/marketing/tilt-stage";

const CLIPS = [
  { label: "A-roll", color: "from-violet-500 to-fuchsia-400", width: "w-[22%]" },
  { label: "B-roll", color: "from-cyan-400 to-sky-500", width: "w-[16%]" },
  { label: "VO", color: "from-amber-400 to-orange-500", width: "w-[18%]" },
  { label: "SFX", color: "from-emerald-400 to-teal-500", width: "w-[12%]" },
] as const;

export function StudioStage() {
  return (
    <TiltStage>
      <div className="glass-panel relative overflow-hidden rounded-[28px] p-3 md:p-4">
        <div
          className="pointer-events-none absolute -top-24 -right-10 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl"
          style={{ transform: "translateZ(40px)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"
          style={{ transform: "translateZ(30px)" }}
        />

        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0a10]"
          style={{ transform: "translateZ(28px)" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
              <p className="ml-2 text-[11px] tracking-[0.18em] text-white/45 uppercase">
                Studio · Timeline
              </p>
            </div>
            <p className="font-mono text-[11px] text-white/40">01:12:08:14</p>
          </div>

          <div className="grid gap-3 p-3 md:grid-cols-[1.4fr_0.8fr]">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.45),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.28),transparent_40%)]" />
              <div className="cinematic-grid absolute inset-0 opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border border-white/20 bg-white/10 backdrop-blur-md" />
                <div className="absolute h-0 w-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white/90 ml-1" />
              </div>
              <div className="absolute right-3 bottom-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[10px] text-white/70">
                4K · ProRes
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-cyan-200/70 uppercase">
                  Agent
                </p>
                <p className="mt-1 text-sm text-white/85">Color-match scene 04…</p>
              </div>
              <div className="mt-3 space-y-1.5">
                {["scopeTenant", "gradeLut", "cutSilence"].map((tool, index) => (
                  <div
                    key={tool}
                    className="flex items-center justify-between rounded-lg bg-black/30 px-2.5 py-1.5 text-[11px] text-white/60"
                  >
                    <span>{tool}</span>
                    <span className={index === 0 ? "text-violet-300" : "text-white/30"}>
                      {index === 0 ? "live" : "queued"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/8 px-3 pt-3 pb-4">
            <div className="mb-2 flex items-center justify-between text-[10px] text-white/35">
              <span>V1 · Multi-cam</span>
              <span>snap · ripple</span>
            </div>
            <div className="relative space-y-1.5">
              <div className="flex h-7 items-center gap-1 rounded-md bg-white/4 px-1">
                {CLIPS.map((clip) => (
                  <div
                    key={clip.label}
                    className={`h-5 rounded ${clip.width} bg-gradient-to-r ${clip.color} opacity-90 shadow-[0_0_18px_rgba(167,139,250,0.25)]`}
                  />
                ))}
              </div>
              <div className="flex h-6 items-end gap-px rounded-md bg-white/4 px-1 py-1">
                {Array.from({ length: 42 }, (_, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-sm bg-cyan-300/50"
                    style={{ height: `${28 + ((index * 17) % 62)}%` }}
                  />
                ))}
              </div>
              <div className="absolute inset-y-0 w-px bg-rose-400 shadow-[0_0_12px_#fb7185] animate-playhead" />
            </div>
          </div>
        </div>
      </div>
    </TiltStage>
  );
}
