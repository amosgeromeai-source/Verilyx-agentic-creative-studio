import { ArrowRight, Sparkles, Wrench } from 'lucide-react';
import { ScorePill } from './QualityScore';

interface RevisionTimelineProps {
  initialScore: number | null;
  finalScore: number | null;
}

/** "Initial review → Revision Agent → Final review" story card. */
export function RevisionTimeline({ initialScore, finalScore }: RevisionTimelineProps) {
  const delta =
    initialScore !== null && finalScore !== null ? finalScore - initialScore : null;

  return (
    <section className="glass-strong overflow-hidden border-violet-400/[0.16] p-5 sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full opacity-[0.18] blur-[80px]"
        style={{ background: 'radial-gradient(closest-side, #a78bfa, transparent 72%)' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-400/[0.08]">
            <Sparkles className="h-4 w-4 text-violet-300" />
          </span>
          <div>
            <h3 className="text-[16px] font-semibold tracking-tight text-slate-100">
              Automatic Quality Improvement
            </h3>
            <p className="mt-0.5 text-[12.5px] text-slate-500">
              This package did not pass on the first review.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2.5">
            <ScorePill score={initialScore} muted />
            <div className="sm:text-center">
              <p className="text-[12.5px] font-medium text-slate-300">Initial Review</p>
              <p className="text-[11.5px] text-slate-600">First quality gate</p>
            </div>
          </div>

          <ArrowRight
            className="hidden h-4 w-4 flex-none self-center text-slate-700 sm:block"
            aria-hidden="true"
          />

          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-violet-400/20 bg-violet-400/[0.05] px-4 py-4">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/[0.08]">
              <Wrench className="h-[18px] w-[18px] text-violet-300" />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-violet-100">Automatic Revision</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">
                Revision Agent → Final Quality Reviewer
              </p>
            </div>
          </div>

          <ArrowRight
            className="hidden h-4 w-4 flex-none self-center text-slate-700 sm:block"
            aria-hidden="true"
          />

          <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2.5">
            <ScorePill score={finalScore} />
            <div className="sm:text-center">
              <p className="text-[12.5px] font-medium text-slate-300">Final Review</p>
              <p className="text-[11.5px] text-slate-600">
                {delta !== null && delta > 0 ? `+${delta} points` : 'Second quality gate'}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-7 border-t border-white/[0.06] pt-5 text-[13.5px] leading-[1.75] text-slate-400">
          Verilyx detected production risks and automatically refined the package before approval.
        </p>
      </div>
    </section>
  );
}
