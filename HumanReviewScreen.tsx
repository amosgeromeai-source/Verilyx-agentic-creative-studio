import { ArrowLeft, CheckCircle2, Mail, Plus, ShieldQuestion, UserCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ResultSection } from './ResultSection';
import { ScorePill } from './QualityScore';
import type { NormalizedProduction } from '@/types';

interface HumanReviewScreenProps {
  production: NormalizedProduction;
  onStartNew: () => void;
  onReturnHome: () => void;
}

export function HumanReviewScreen({
  production,
  onStartNew,
  onReturnHome,
}: HumanReviewScreenProps) {
  const message =
    production.message ||
    'Automatic revision completed, but the project did not reach the required quality threshold.';

  const timeline = [
    { label: 'Project submitted successfully', pending: false },
    { label: 'AI analysis completed', pending: false },
    {
      label: production.revised ? 'Automatic revision attempted' : 'Quality review completed',
      pending: false,
    },
    { label: 'Human review requested', pending: true },
  ];

  const hasScores =
    production.initialQualityScore !== null || production.finalQualityScore !== null;

  return (
    <main className="relative px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] max-w-full -translate-x-1/2 rounded-full opacity-[0.13] blur-[110px]"
        style={{ background: 'radial-gradient(closest-side, #22d3ee, transparent 72%)' }}
      />

      <div className="relative mx-auto max-w-2xl">
        <div className="animate-fade-up text-center">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.07]">
            <ShieldQuestion className="h-7 w-7 text-cyan-300" />
          </span>

          <div className="mt-6 flex justify-center">
            <StatusBadge kind="review" label="Human Review Requested" />
          </div>

          <h1 className="mt-5 text-[27px] font-semibold tracking-tight text-slate-50 sm:text-[33px]">
            Additional Review Required
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.8] text-slate-400">
            Verilyx completed its automatic revision process, but the production package still
            requires human review.
          </p>
        </div>

        {production.projectName && (
          <div className="animate-fade-up anim-delay-1 mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="chip">{production.projectName}</span>
            {production.duration !== null && <span className="chip">{production.duration}s</span>}
            {production.visualStyle && <span className="chip">{production.visualStyle}</span>}
          </div>
        )}

        <div className="glass-strong animate-fade-up anim-delay-2 mt-8 p-6 sm:p-8">
          <h2 className="text-[13px] font-medium uppercase tracking-widest2 text-slate-400">
            What happened
          </h2>

          <ol className="mt-6 space-y-4">
            {timeline.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span
                  className={`inline-flex h-7 w-7 flex-none items-center justify-center rounded-lg border ${
                    item.pending
                      ? 'border-cyan-400/30 bg-cyan-400/[0.08]'
                      : 'border-emerald-400/25 bg-emerald-400/[0.07]'
                  }`}
                >
                  {item.pending ? (
                    <UserCheck className="h-3.5 w-3.5 text-cyan-300" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  )}
                </span>
                <span className="text-[14px] text-slate-300">{item.label}</span>
              </li>
            ))}
          </ol>

          {hasScores && (
            <>
              <div className="divider my-6" />
              <div className="flex flex-wrap items-center gap-6">
                {production.revised && production.initialQualityScore !== null && (
                  <div className="flex items-center gap-3">
                    <ScorePill score={production.initialQualityScore} muted />
                    <div>
                      <p className="text-[12.5px] font-medium text-slate-300">Initial review</p>
                      <p className="text-[11.5px] text-slate-600">First quality gate</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <ScorePill score={production.finalQualityScore} muted />
                  <div>
                    <p className="text-[12.5px] font-medium text-slate-300">
                      {production.revised ? 'Final review' : 'Quality review'}
                    </p>
                    <p className="text-[11.5px] text-slate-600">Below the required threshold</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="divider my-6" />

          <p className="text-[13.5px] leading-[1.75] text-slate-400">{message}</p>

          <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
              <div className="min-w-0">
                <p className="text-[13.5px] text-slate-300">
                  We&rsquo;ll use the email you provided to keep you updated.
                </p>
                {production.email ? (
                  <p className="mt-1 break-all font-mono text-[13px] text-slate-100">
                    {production.email}
                  </p>
                ) : (
                  <p className="mt-1 text-[13px] italic text-slate-500">
                    No email was captured for this run.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {production.finalReview.trim().length > 0 && (
          <div className="animate-fade-up anim-delay-3 mt-6">
            <ResultSection
              title={production.revised ? 'Final Quality Review' : 'Quality Review'}
              description="Why the package was escalated instead of released."
              icon={ShieldQuestion}
              tone="muted"
              content={production.finalReview}
            />
          </div>
        )}

        <div className="animate-fade-up anim-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={onReturnHome} className="btn-ghost px-5 py-2.5">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </button>
          <button type="button" onClick={onStartNew} className="btn-primary px-5 py-2.5">
            <Plus className="h-4 w-4" />
            Create Another Project
          </button>
        </div>

        <p className="mt-8 text-center text-[12.5px] leading-relaxed text-slate-600">
          Escalation is a normal path in this workflow — nothing failed, and your submission was
          not lost.
        </p>
      </div>
    </main>
  );
}
