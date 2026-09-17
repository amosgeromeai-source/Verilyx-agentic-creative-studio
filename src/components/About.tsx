import { ArrowRight, Clapperboard, FileText, Film, Gauge, Lightbulb, Terminal } from 'lucide-react';

const DELIVERABLES = [
  {
    icon: Film,
    title: 'Final video',
    body: 'The finished MP4, merged from the generated clips — playable and downloadable here.',
    primary: true,
  },
  {
    icon: Lightbulb,
    title: 'Creative direction',
    body: 'The concept, tone, audience and visual language the production is built on.',
  },
  {
    icon: FileText,
    title: 'Timed script',
    body: 'Beats, voiceover and on-screen copy structured to the duration you asked for.',
  },
  {
    icon: Clapperboard,
    title: 'Scene plan',
    body: 'Shot-by-shot framing, movement, lighting and continuity notes.',
  },
  {
    icon: Terminal,
    title: 'Generation prompts',
    body: 'Generation-ready instructions per scene, with consistent parameters.',
  },
  {
    icon: Gauge,
    title: 'Quality review',
    body: 'A written audit with a score, plus the revision history when one was needed.',
  },
];

interface AboutProps {
  onCreateClick: () => void;
}

export function About({ onCreateClick }: AboutProps) {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 border-t border-white/[0.05] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">About</span>
          <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-slate-100 sm:text-[32px]">
            What comes back
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-slate-400">
            A finished video, plus every reviewed artifact behind it — not a wall of chat output.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`glass h-full p-5 transition-colors duration-300 hover:border-white/[0.14] ${
                  'primary' in item && item.primary ? 'border-cyan-400/25 bg-cyan-400/[0.03]' : ''
                }`}
              >
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
                    'primary' in item && item.primary
                      ? 'border-cyan-400/25 bg-cyan-400/[0.08]'
                      : 'border-white/10 bg-white/[0.04]'
                  }`}
                >
                  <Icon className="h-4 w-4 text-cyan-300" />
                </span>
                <h3 className="mt-3.5 text-[14.5px] font-medium text-slate-100">
                  {item.title}
                  {'primary' in item && item.primary && (
                    <span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-widest2 text-cyan-300/80">
                      Deliverable
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{item.body}</p>
              </div>
            );
          })}

          <div className="glass-strong flex h-full flex-col justify-between p-5">
            <div>
              <h3 className="text-[14.5px] font-medium text-slate-100">
                Built as a working prototype
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
                Verilyx runs a live multi-agent n8n workflow — planned, quality reviewed,
                automatically refined when a review calls for it, then generated and merged.
              </p>
            </div>
            <button type="button" onClick={onCreateClick} className="btn-primary mt-5 w-full">
              Create Production
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
