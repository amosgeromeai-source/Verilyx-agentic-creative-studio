import { ArrowRight, Hexagon, Sparkles } from 'lucide-react';

interface HeroProps {
  onCreateClick: () => void;
}

const HIGHLIGHTS = [
  { value: '7', label: 'Specialist agents' },
  { value: '2', label: 'Quality gates' },
  { value: '1', label: 'Automatic revision pass' },
  { value: '1', label: 'Finished MP4' },
];

export function Hero({ onCreateClick }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-noise" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[30rem] w-[52rem] -translate-x-1/2 rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: 'radial-gradient(closest-side, #22d3ee, transparent 72%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8rem] top-[6rem] h-[26rem] w-[26rem] rounded-full opacity-[0.14] blur-[110px]"
        style={{ background: 'radial-gradient(closest-side, #a78bfa, transparent 72%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip animate-fade-up border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-200/90">
            <Sparkles className="h-3 w-3" />
            <span className="tracking-widest2">AI CREATIVE PRODUCTION</span>
          </span>

          <h1 className="animate-fade-up anim-delay-1 mt-7 text-balance text-[2.1rem] font-semibold leading-[1.12] tracking-tight sm:text-[2.9rem] lg:text-[3.15rem]">
            <span className="text-gradient">
              AI creative production, from brief to final video.
            </span>
          </h1>

          <p className="animate-fade-up anim-delay-2 mx-auto mt-6 max-w-2xl text-[16px] leading-[1.75] text-slate-400 sm:text-[17px]">
            Verilyx coordinates specialized AI agents to develop creative direction, scripts, scene
            plans and generation prompts, reviews the result, then generates and merges the clips
            into a finished video you can download.
          </p>

          <div className="animate-fade-up anim-delay-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCreateClick}
              className="btn-primary w-full px-6 py-3 text-[15px] sm:w-auto"
            >
              Create Production
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#how-it-works" className="btn-ghost w-full px-6 py-3 text-[15px] sm:w-auto">
              See How It Works
            </a>
          </div>

          <p className="animate-fade-in anim-delay-4 mt-5 text-[12.5px] text-slate-600">
            AI-assisted output, quality reviewed before release. No account required.
          </p>
        </div>

        <div className="animate-fade-up anim-delay-5 mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="bg-ink-950/70 px-4 py-5 text-center backdrop-blur-xl">
              <div className="flex items-center justify-center gap-1.5">
                <Hexagon className="h-3 w-3 text-cyan-400/60" />
                <span className="text-2xl font-semibold tracking-tight text-slate-100">
                  {item.value}
                </span>
              </div>
              <div className="mt-1.5 text-[11.5px] leading-tight text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
