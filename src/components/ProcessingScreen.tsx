import { Check, Clock, Info, Loader2 } from 'lucide-react';
import { useElapsed, useStageSimulation } from '@/hooks';
import { CORE_AGENTS, REVISION_AGENTS, VIDEO_STAGES, formatElapsed, type StageState } from '@/utils';
import type { CreateProductionRequest } from '@/types';

interface ProcessingScreenProps {
  request: CreateProductionRequest | null;
}

function StageRow({
  index,
  name,
  activity,
  state,
  isLast,
  showActivity,
}: {
  index: number;
  name: string;
  activity: string;
  state: StageState;
  isLast: boolean;
  showActivity: boolean;
}) {
  const complete = state === 'complete';
  const active = state === 'active';

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <span
          aria-hidden="true"
          className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px ${
            complete ? 'bg-cyan-400/30' : 'bg-white/[0.08]'
          }`}
        />
      )}

      <span
        className={`relative z-10 inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border transition-all duration-500 ${
          complete
            ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
            : active
              ? 'animate-pulse-ring border-cyan-400/50 bg-cyan-400/[0.08] text-cyan-200'
              : 'border-white/[0.08] bg-white/[0.02] text-slate-700'
        }`}
      >
        {complete ? (
          <Check className="h-[18px] w-[18px]" />
        ) : active ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        ) : (
          <span className="font-mono text-[11px]">{String(index + 1).padStart(2, '0')}</span>
        )}
      </span>

      <div className="min-w-0 pt-1.5">
        <p
          className={`text-[14.5px] font-medium transition-colors duration-500 ${
            complete ? 'text-slate-300' : active ? 'text-slate-50' : 'text-slate-600'
          }`}
        >
          {name}
        </p>
        {active && showActivity && (
          <p className="mt-1 animate-fade-in text-[13px] text-cyan-300/80">{activity}</p>
        )}
        {complete && <p className="mt-1 text-[12.5px] text-slate-600">Handed off</p>}
      </div>
    </li>
  );
}

export function ProcessingScreen({ request }: ProcessingScreenProps) {
  const elapsed = useElapsed(true);
  const { states, activityLine, isUncertain } = useStageSimulation(elapsed);

  return (
    <main className="relative px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] max-w-full -translate-x-1/2 rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: 'radial-gradient(closest-side, #22d3ee, transparent 72%)' }}
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <span className="chip animate-fade-in border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-200/90">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            <span className="tracking-widest2">IN PRODUCTION</span>
          </span>

          <h1 className="animate-fade-up mt-6 text-[26px] font-semibold tracking-tight text-slate-50 sm:text-[32px]">
            {isUncertain
              ? 'Your production is still being created…'
              : 'Verilyx is creating your production…'}
          </h1>
          <p className="animate-fade-up anim-delay-1 mt-3 text-[15px] leading-relaxed text-slate-400">
            Creative direction, script, scene plan and prompts are reviewed first — then the clips
            are generated and merged into your final video.
          </p>

          <div className="animate-fade-in anim-delay-2 mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[13px] text-slate-300">
              Processing for{' '}
              <span className="font-mono tabular-nums text-slate-100">{formatElapsed(elapsed)}</span>
            </span>
          </div>
        </div>

        {request && (
          <div className="animate-fade-up anim-delay-3 mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="chip">{request.project_name}</span>
            <span className="chip">{request.duration}s</span>
            <span className="chip">{request.style}</span>
          </div>
        )}

        <div className="glass animate-fade-up anim-delay-3 mt-8 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[13px] font-medium uppercase tracking-widest2 text-slate-400">
              Planning &amp; review
            </h2>
            <span className="text-[11.5px] text-slate-600">
              {isUncertain ? 'Stage unknown' : 'Estimated progress'}
            </span>
          </div>

          <ol className="mt-7">
            {CORE_AGENTS.map((agent, index) => (
              <StageRow
                key={agent.id}
                index={index}
                name={agent.name}
                activity={agent.activity}
                state={states[index]}
                isLast={index === CORE_AGENTS.length - 1}
                // Past the estimate, stop asserting that this exact agent is running.
                showActivity={!isUncertain}
              />
            ))}
          </ol>

          <div className="divider my-6" />

          <p className="text-[12px] font-medium uppercase tracking-widest2 text-slate-600">
            {isUncertain ? 'May be running now' : 'Runs only if the review falls short'}
          </p>
          <ul className="mt-4 space-y-3">
            {REVISION_AGENTS.map((agent) => {
              const Icon = agent.icon;
              return (
                <li key={agent.id} className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg border transition-colors duration-500 ${
                      isUncertain
                        ? 'border-cyan-400/20 bg-cyan-400/[0.05]'
                        : 'border-white/[0.07] bg-white/[0.02]'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors duration-500 ${
                        isUncertain ? 'text-cyan-300/70' : 'text-slate-700'
                      }`}
                    />
                  </span>
                  <span
                    className={`text-[13.5px] transition-colors duration-500 ${
                      isUncertain ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {agent.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Video production: the longest part, and the part we get no events for.
            Never ticked off — only the finished result proves it happened. */}
        <div className="glass animate-fade-up anim-delay-4 mt-6 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[13px] font-medium uppercase tracking-widest2 text-slate-400">
              Video production
            </h2>
            <span className="text-[11.5px] text-slate-600">After review passes</span>
          </div>

          <ul className="mt-6 space-y-4">
            {VIDEO_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <li key={stage.id} className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg border transition-colors duration-500 ${
                      isUncertain
                        ? 'border-cyan-400/20 bg-cyan-400/[0.05]'
                        : 'border-white/[0.07] bg-white/[0.02]'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors duration-500 ${
                        isUncertain ? 'text-cyan-300/70' : 'text-slate-700'
                      }`}
                    />
                  </span>
                  <div className="min-w-0 pt-1">
                    <p
                      className={`text-[13.5px] transition-colors duration-500 ${
                        isUncertain ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {stage.name}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-slate-600">
                      {stage.role}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="animate-fade-in anim-delay-5 mt-6 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <Info className="mt-0.5 h-4 w-4 flex-none text-slate-500" />
          <div className="text-[13px] leading-relaxed text-slate-400">
            <p>
              Your production is being created. AI video generation may take several minutes.
            </p>
            <p className="mt-1.5 text-slate-500">
              {isUncertain
                ? `Verilyx receives no per-stage updates from the workflow, so it can't say which step is running right now. ${activityLine}`
                : `Stage timing shown here is estimated — the workflow reports back once, when your production is ready. Current step: ${activityLine.toLowerCase()}`}
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-[12.5px] text-slate-600">
          Keep this tab open. Closing it ends the request.
        </p>
      </div>
    </main>
  );
}
