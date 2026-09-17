import { AlertTriangle, ArrowDown, CheckCircle2, Film, GitBranch, UserCheck } from 'lucide-react';
import { CORE_AGENTS, REVISION_AGENTS, VIDEO_STAGES, type AgentSpec } from '@/utils';
import { QUALITY_THRESHOLD } from '@/config';

function Node({
  agent,
  index,
  tone = 'core',
}: {
  agent: AgentSpec;
  index?: number;
  tone?: 'core' | 'revision' | 'final';
}) {
  const Icon = agent.icon;

  const ring =
    tone === 'revision'
      ? 'border-violet-400/25 bg-violet-400/[0.05]'
      : tone === 'final'
        ? 'border-emerald-400/25 bg-emerald-400/[0.05]'
        : 'border-cyan-400/20 bg-cyan-400/[0.05]';

  const iconTone =
    tone === 'revision'
      ? 'text-violet-300'
      : tone === 'final'
        ? 'text-emerald-300'
        : 'text-cyan-300';

  return (
    <div className="group relative flex flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors duration-300 hover:border-white/[0.14] hover:bg-white/[0.04] md:flex-col md:items-center md:gap-2.5 md:p-4 md:text-center">
      <span
        className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border ${ring}`}
      >
        <Icon className={`h-[18px] w-[18px] ${iconTone}`} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-medium leading-tight text-slate-200">
          {agent.name}
        </span>
        {typeof index === 'number' && (
          <span className="mt-1 block font-mono text-[10.5px] tracking-widest text-slate-600">
            0{index + 1}
          </span>
        )}
      </span>
    </div>
  );
}

/** Horizontal on desktop, vertical on mobile, with a travelling pulse. */
function Connector() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto my-1 h-5 w-px flex-none overflow-hidden bg-gradient-to-b from-transparent via-white/25 to-transparent md:my-0 md:h-px md:w-6 md:bg-gradient-to-r lg:w-10"
    >
      <span className="absolute left-0 top-0 h-2 w-px animate-flow-down bg-cyan-300/80 md:hidden" />
      <span className="absolute left-0 top-0 hidden h-px w-2 animate-flow-right bg-cyan-300/80 md:block" />
    </div>
  );
}

export function PipelineVisualization() {
  return (
    <section id="pipeline" className="relative scroll-mt-24 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pipeline</span>
          <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-slate-100 sm:text-[32px]">
            Seven agents. Two quality gates. One finished video.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-slate-400">
            Each stage hands a structured artifact to the next. Nothing goes to generation until a
            review agent has audited it.
          </p>
        </div>

        <div className="glass mt-12 p-5 sm:p-7 lg:p-9">
          {/* Main track */}
          <div className="flex flex-col md:flex-row md:items-stretch">
            {CORE_AGENTS.map((agent, index) => (
              <div key={agent.id} className="contents">
                {index > 0 && (
                  <div className="flex md:items-center">
                    <Connector />
                  </div>
                )}
                <Node agent={agent} index={index} />
              </div>
            ))}
          </div>

          {/* Gate */}
          <div className="mt-8 flex flex-col items-center">
            <ArrowDown className="h-4 w-4 text-slate-700" aria-hidden="true" />
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
              <GitBranch className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[12.5px] text-slate-300">
                Quality gate — threshold {QUALITY_THRESHOLD}/100
              </span>
            </div>
          </div>

          {/* Branches */}
          <div className="mt-6 grid items-start gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03] p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-none text-emerald-300" />
                <span className="text-[13px] font-medium text-emerald-200">
                  Meets threshold — approved on first review
                </span>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-400">
                The package is released with its full review, and the run ends here.
              </p>
              <div className="mt-4">
                <Node
                  agent={{
                    ...REVISION_AGENTS[1],
                    name: 'Final Approval',
                    id: 'approval-direct',
                  }}
                  tone="final"
                />
              </div>
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
                <p className="text-[12.5px] leading-relaxed text-slate-400">
                  Creative direction, script, scene plan, generation prompts and the review are
                  returned together.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.03] p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-none text-violet-300" />
                <span className="text-[13px] font-medium text-violet-200">
                  Below threshold — automatic revision
                </span>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-400">
                The review findings are fed back in, the package is repaired and re-audited.
              </p>
              <div className="mt-4 flex flex-col md:flex-row md:items-stretch">
                {REVISION_AGENTS.map((agent, index) => (
                  <div key={agent.id} className="contents">
                    {index > 0 && (
                      <div className="flex md:items-center">
                        <Connector />
                      </div>
                    )}
                    <Node agent={agent} tone="revision" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                <UserCheck className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
                <p className="text-[12.5px] leading-relaxed text-slate-400">
                  Still short after revision? The project is escalated for human review instead of
                  being released.
                </p>
              </div>
            </div>
          </div>

          {/* Video production — where the approved package becomes the deliverable. */}
          <div className="mt-8 flex flex-col items-center">
            <ArrowDown className="h-4 w-4 text-slate-700" aria-hidden="true" />
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-1.5">
              <Film className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-[12.5px] text-cyan-100/90">
                Approved — the package goes to generation
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-stretch">
            {VIDEO_STAGES.map((stage, index) => (
              <div key={stage.id} className="contents">
                {index > 0 && (
                  <div className="flex md:items-center">
                    <Connector />
                  </div>
                )}
                <Node agent={stage} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] px-3.5 py-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
            <p className="text-[12.5px] leading-relaxed text-slate-400">
              The merged MP4 is returned to Verilyx, where you can watch it and download it. The
              number of clips follows the scene plan, so it varies from production to production.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
