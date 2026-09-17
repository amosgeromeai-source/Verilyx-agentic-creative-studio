import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clapperboard,
  Compass,
  Download,
  FileText,
  Film,
  Gauge,
  LayoutDashboard,
  PackageCheck,
  PenLine,
  Plus,
  ScanSearch,
  Terminal,
} from 'lucide-react';
import { CopyButton } from './CopyButton';
import { FinalVideo } from './FinalVideo';
import { QualityScore } from './QualityScore';
import { ResultSection } from './ResultSection';
import { ResultTabs, TabPanel, type TabDefinition } from './ResultTabs';
import { RevisionTimeline } from './RevisionTimeline';
import { StatusBadge, type BadgeKind } from './StatusBadge';
import { RichText } from './RichText';
import { ALL_AGENTS, CORE_AGENTS, buildPackageText, downloadPackage, statusBadgeLabel } from '@/utils';
import { useVideoStatus } from '@/hooks';
import type { NormalizedProduction } from '@/types';

interface ResultsDashboardProps {
  /** Already normalized — this component never sees a raw n8n payload. */
  production: NormalizedProduction;
  onStartNew: () => void;
}

function badgeKind(label: string): BadgeKind {
  if (label === 'Approved After Revision') return 'revised';
  if (label === 'Ready With Warnings' || label === 'Needs Revision') return 'warnings';
  if (label === 'Needs Human Review') return 'review';
  return 'approved';
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/[0.05] py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-40 flex-none text-[12px] font-medium uppercase tracking-widest2 text-slate-500">
        {label}
      </dt>
      <dd className="min-w-0 text-[14px] leading-relaxed text-slate-300">{value}</dd>
    </div>
  );
}

export function ResultsDashboard({ production, onStartNew }: ResultsDashboardProps) {
  const label = useMemo(() => statusBadgeLabel(production), [production]);
  const revised = production.revised;

  // Inert unless a status endpoint is configured; see useVideoStatus.
  const videoStatus = useVideoStatus(production.video, production.projectName);

  /**
   * A tab only exists when its agent actually produced something, so an agent
   * that did not run leaves no empty panel behind.
   */
  const tabs = useMemo<TabDefinition[]>(() => {
    const list: TabDefinition[] = [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }];

    const add = (id: string, tabLabel: string, icon: TabDefinition['icon'], content: string) => {
      if (content.trim().length > 0) list.push({ id, label: tabLabel, icon });
    };

    if (revised) {
      add('revised-package', 'Revised Package', PackageCheck, production.revisedPackage);
      add('original-review', 'Original Review', ScanSearch, production.initialReview);
      add('final-review', 'Final Review', Gauge, production.finalReview);
    }

    add('creative-direction', 'Creative Direction', Compass, production.creativeDirection);
    add('script', 'Script', PenLine, production.script);
    add('scene-plan', 'Scene Plan', Clapperboard, production.scenePlan);
    add('generation-prompts', 'Generation Prompts', Terminal, production.generationPrompts);

    if (!revised) {
      add('quality-review', 'Quality Review', ScanSearch, production.finalReview);
    }

    return list;
  }, [revised, production]);

  const [activeTab, setActiveTab] = useState('overview');
  const currentTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : 'overview';

  const ranAgents = revised ? ALL_AGENTS : CORE_AGENTS;

  return (
    <main className="px-5 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="animate-fade-up flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge kind={badgeKind(label)} label={label} />
              {revised && (
                <span className="chip border-violet-400/20 bg-violet-400/[0.06] text-violet-200/90">
                  Automatically revised
                </span>
              )}
              {videoStatus.video.state === 'ready' && (
                <span className="chip border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200/90">
                  <Film className="h-3 w-3" />
                  Video ready
                </span>
              )}
              {videoStatus.video.state === 'processing' && (
                <span className="chip border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-200/90">
                  <Film className="h-3 w-3" />
                  Video rendering
                </span>
              )}
            </div>
            <h1 className="mt-4 text-balance text-[28px] font-semibold leading-tight tracking-tight text-slate-50 sm:text-[36px]">
              {production.projectName || 'Production package'}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {production.duration !== null && <span className="chip">{production.duration}s</span>}
              {production.visualStyle && <span className="chip">{production.visualStyle}</span>}
              <span className="chip">
                {production.agentsRun} of {production.agentsTotal} agents ·{' '}
                {revised ? '2 quality gates' : '1 quality gate'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:flex-none lg:justify-end">
            <CopyButton
              getText={() => buildPackageText(production)}
              label="Copy All"
              className="px-3.5 py-2 text-[13px]"
            />
            <button
              type="button"
              onClick={() => downloadPackage(production)}
              className="btn-ghost px-3.5 py-2 text-[13px]"
              title="Downloads the written production package as markdown, not the video"
            >
              <Download className="h-3.5 w-3.5" />
              Download Package
            </button>
            <button type="button" onClick={onStartNew} className="btn-primary px-3.5 py-2 text-[13px]">
              <Plus className="h-3.5 w-3.5" />
              Start New Project
            </button>
          </div>
        </div>

        {/* The finished MP4 is the deliverable — it leads the page. */}
        <div className="animate-fade-up anim-delay-1 mt-8">
          <FinalVideo production={production} status={videoStatus} onStartNew={onStartNew} />
        </div>

        <div className="mt-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-widest2 text-slate-500">
            Production details
          </p>
          <ResultTabs tabs={tabs} activeId={currentTab} onChange={setActiveTab} />
        </div>

        <div className="mt-8 space-y-6">
          <TabPanel id="overview" activeId={currentTab}>
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
                <div className="glass-strong flex flex-col items-center justify-center p-7">
                  <QualityScore
                    score={production.finalQualityScore}
                    caption={
                      production.finalQualityScore === null
                        ? 'No score in the response'
                        : revised
                          ? 'From the Final Quality Reviewer'
                          : 'From the Quality Reviewer'
                    }
                  />

                  {!revised && production.finalQualityScore !== null && (
                    <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="text-[12.5px] text-emerald-200">
                        Passed Initial Quality Review
                      </span>
                    </div>
                  )}
                </div>

                <div className="glass p-5 sm:p-7">
                  <h2 className="text-[13px] font-medium uppercase tracking-widest2 text-slate-400">
                    Run summary
                  </h2>
                  <dl className="mt-4">
                    <MetaRow label="Status" value={label} />
                    {production.duration !== null && (
                      <MetaRow label="Duration" value={`${production.duration} seconds`} />
                    )}
                    {production.visualStyle && (
                      <MetaRow label="Visual style" value={production.visualStyle} />
                    )}
                    {production.finalVerdict !== 'UNKNOWN' && (
                      <MetaRow label="Review verdict" value={production.finalVerdict} />
                    )}
                    {/* "Delivered" would be a claim we can't verify — the workflow
                        does not report whether the email was actually sent. */}
                    {production.email && (
                      <MetaRow label="Notification email" value={production.email} />
                    )}
                    <MetaRow
                      label="Agents run"
                      value={`${production.agentsRun} of ${production.agentsTotal}`}
                    />
                  </dl>
                </div>
              </div>

              {revised && (
                <RevisionTimeline
                  initialScore={production.initialQualityScore}
                  finalScore={production.finalQualityScore}
                />
              )}

              <div className="glass p-5 sm:p-7">
                <h2 className="text-[13px] font-medium uppercase tracking-widest2 text-slate-400">
                  Agents that ran
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {ranAgents.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <li
                        key={agent.id}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
                      >
                        <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                          <Icon className="h-4 w-4 text-cyan-300/80" />
                        </span>
                        <span className="min-w-0 flex-1 text-[13.5px] text-slate-300">
                          {agent.name}
                        </span>
                        <CheckCircle2 className="h-4 w-4 flex-none text-emerald-400/70" />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {production.finalReview.trim().length > 0 && (
                <ResultSection
                  title={revised ? 'Final Quality Review' : 'Quality Review'}
                  description={
                    revised
                      ? 'The audit that cleared the revised package.'
                      : 'Continuity, feasibility, timing, audio, branding and production risk.'
                  }
                  icon={revised ? Gauge : ScanSearch}
                  content={production.finalReview}
                />
              )}
            </div>
          </TabPanel>

          {revised && (
            <>
              <TabPanel id="revised-package" activeId={currentTab}>
                <ResultSection
                  title="Revised Production Package"
                  description="The package after the Revision Agent addressed the first review's findings."
                  icon={PackageCheck}
                  content={production.revisedPackage}
                />
              </TabPanel>

              <TabPanel id="original-review" activeId={currentTab}>
                <ResultSection
                  title="Original Quality Review"
                  description="The first-pass audit — the findings that triggered the automatic revision."
                  icon={ScanSearch}
                  tone="muted"
                  content={production.initialReview}
                  aside={
                    production.initialQualityScore !== null ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3.5 py-1.5">
                        <span className="text-[12.5px] text-amber-200">
                          Initial score {production.initialQualityScore}/100 — below threshold
                        </span>
                      </div>
                    ) : null
                  }
                />
              </TabPanel>

              <TabPanel id="final-review" activeId={currentTab}>
                <ResultSection
                  title="Final Quality Review"
                  description="The second audit, run against the revised package."
                  icon={Gauge}
                  content={production.finalReview}
                  aside={
                    production.finalQualityScore !== null ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                        <span className="text-[12.5px] text-emerald-200">
                          Final score {production.finalQualityScore}/100
                        </span>
                      </div>
                    ) : null
                  }
                />
              </TabPanel>
            </>
          )}

          <TabPanel id="creative-direction" activeId={currentTab}>
            <ResultSection
              title="Creative Direction"
              description="Concept, tone, audience and visual language."
              icon={Compass}
              content={production.creativeDirection}
            />
          </TabPanel>

          <TabPanel id="script" activeId={currentTab}>
            <ResultSection
              title="Script"
              description="Timed beats, voiceover and on-screen copy."
              icon={PenLine}
              content={production.script}
            />
          </TabPanel>

          <TabPanel id="scene-plan" activeId={currentTab}>
            <ResultSection
              title="Scene Plan"
              description="Shot-level framing, movement, lighting and continuity."
              icon={Clapperboard}
              content={production.scenePlan}
            />
          </TabPanel>

          <TabPanel id="generation-prompts" activeId={currentTab}>
            <ResultSection
              title="Generation Prompts"
              description="Generation-ready instructions, scene by scene."
              icon={Terminal}
              content={production.generationPrompts}
            />
          </TabPanel>

          <TabPanel id="quality-review" activeId={currentTab}>
            <ResultSection
              title="Quality Review"
              description="Continuity, feasibility, timing, audio, branding and production risk."
              icon={ScanSearch}
              content={production.finalReview}
              aside={
                production.finalQualityScore !== null ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    <span className="text-[12.5px] text-emerald-200">
                      Score {production.finalQualityScore}/100
                    </span>
                  </div>
                ) : null
              }
            />
          </TabPanel>
        </div>

        {production.idea && currentTab === 'overview' && (
          <section className="glass mt-6 p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <FileText className="h-4 w-4 text-cyan-300" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold tracking-tight text-slate-100">
                  Original brief
                </h3>
                <RichText content={production.idea} className="mt-3" />
              </div>
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/[0.06] pt-8 sm:flex-row sm:justify-between">
          <p className="text-[12.5px] text-slate-600">
            AI-assisted output, quality reviewed. Review before production use.
          </p>
          <button type="button" onClick={onStartNew} className="btn-ghost px-4 py-2 text-[13px]">
            <Plus className="h-3.5 w-3.5" />
            Start New Project
          </button>
        </div>
      </div>
    </main>
  );
}
