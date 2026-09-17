import { Layers, UserCheck } from 'lucide-react';
import { CORE_AGENTS, REVISION_AGENTS, type AgentSpec } from '@/utils';

function AgentCard({ agent, index }: { agent: AgentSpec; index: number }) {
  const Icon = agent.icon;
  const conditional = agent.conditional === true;

  return (
    <article
      className={`glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] sm:p-6 ${
        conditional ? 'border-violet-400/[0.14]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl border transition-colors duration-300 ${
            conditional
              ? 'border-violet-400/25 bg-violet-400/[0.06] text-violet-300'
              : 'border-cyan-400/20 bg-cyan-400/[0.05] text-cyan-300'
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-mono text-[11px] tracking-widest text-slate-700">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight text-slate-100">
        {agent.name}
      </h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-400">{agent.role}</p>
      <p className="mt-3 text-[13px] leading-[1.7] text-slate-500">{agent.detail}</p>

      {conditional && (
        <span className="mt-4 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-widest2 text-violet-200/90">
          Conditional
        </span>
      )}
    </article>
  );
}

export function HowItWorks() {
  const agents = [...CORE_AGENTS, ...REVISION_AGENTS];

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 border-t border-white/[0.05] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-24">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight text-slate-100 sm:text-[32px]">
              Verilyx is not one giant prompt.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-slate-400">
              A single model call asked to &ldquo;make an ad&rdquo; produces something plausible and
              unproducible — timings that don&rsquo;t add up, shots that can&rsquo;t be shot, prompts
              that drift between scenes.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-slate-400">
              Verilyx splits the work across specialists. Each agent receives a structured artifact
              from the one before it, does a narrow job well, and passes something more concrete
              along. A reviewer audits the result against production criteria — and only once it
              clears that gate do the prompts go out for generation and get merged into your video.
            </p>

            <div className="glass mt-7 flex items-start gap-3.5 p-5">
              <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <UserCheck className="h-4 w-4 text-cyan-300" />
              </span>
              <div>
                <p className="text-[14px] font-medium text-slate-100">
                  Human-in-the-loop when automation isn&rsquo;t enough.
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
                  If the revised package still misses the threshold, Verilyx escalates rather than
                  releasing work it can&rsquo;t stand behind.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-[12.5px] text-slate-500">
              <Layers className="h-3.5 w-3.5" />
              Orchestrated as an n8n workflow — planning and review, then generation and the final merge.
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {agents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
