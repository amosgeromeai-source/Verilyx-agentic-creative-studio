import {
  BadgeCheck,
  Clapperboard,
  Compass,
  Film,
  Layers,
  PenLine,
  ScanSearch,
  Send,
  Terminal,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** Shared definition of the agent chain, used by the landing page,
 *  the processing screen and the About section. */
export interface AgentSpec {
  id: string;
  name: string;
  role: string;
  /** Longer description for the About cards. */
  detail: string;
  /** Present-tense line shown while this stage is the active one. */
  activity: string;
  icon: LucideIcon;
  /** Conditional stages only run when the first review falls short. */
  conditional?: boolean;
}

export const CORE_AGENTS: AgentSpec[] = [
  {
    id: 'creative-director',
    name: 'Creative Director',
    role: 'Defines concept and creative direction.',
    detail:
      'Interprets the brief into a concrete creative position — tone, audience, visual language and the idea the production is actually built around.',
    activity: 'Creative direction in progress…',
    icon: Compass,
  },
  {
    id: 'script-architect',
    name: 'Script Architect',
    role: 'Creates timing and narrative structure.',
    detail:
      'Turns the direction into a timed script: beats, pacing, voiceover and on-screen copy that fit the requested duration.',
    activity: 'Structuring narrative…',
    icon: PenLine,
  },
  {
    id: 'scene-planner',
    name: 'Scene Planner',
    role: 'Converts the script into detailed production shots.',
    detail:
      'Breaks the script into shot-level scenes with framing, camera movement, lighting, transitions and continuity notes.',
    activity: 'Planning production scenes…',
    icon: Clapperboard,
  },
  {
    id: 'prompt-engineer',
    name: 'Prompt Engineer',
    role: 'Creates generation-ready AI production instructions.',
    detail:
      'Writes the generation prompts each scene needs, with the parameters and constraints that keep output consistent across shots.',
    activity: 'Preparing generation package…',
    icon: Terminal,
  },
  {
    id: 'quality-reviewer',
    name: 'Quality Reviewer',
    role: 'Audits continuity, feasibility, timing, audio, branding and production risk.',
    detail:
      'Scores the package against production criteria and returns a written review. Falling short of the threshold routes the package to revision instead of approval.',
    activity: 'Running quality analysis…',
    icon: ScanSearch,
  },
];

export const REVISION_AGENTS: AgentSpec[] = [
  {
    id: 'revision-agent',
    name: 'Revision Agent',
    role: 'Repairs failed quality checks.',
    detail:
      'Takes the review findings and rebuilds the weak parts of the package — continuity gaps, timing overruns, unusable prompts — without discarding what already worked.',
    activity: 'Applying automatic revisions…',
    icon: Wrench,
    conditional: true,
  },
  {
    id: 'final-reviewer',
    name: 'Final Quality Reviewer',
    role: 'Verifies the corrected package.',
    detail:
      'Re-audits the revised package. If it still misses the threshold, the project is escalated for human review rather than shipped.',
    activity: 'Verifying revised package…',
    icon: BadgeCheck,
    conditional: true,
  },
];

export const ALL_AGENTS: AgentSpec[] = [...CORE_AGENTS, ...REVISION_AGENTS];

/**
 * After the package clears review, the approved prompts go out for generation
 * and the returned clips are merged into the final MP4. The clip count is
 * decided by the scene plan, so it varies from run to run — the frontend never
 * assumes a number, it just waits for the merged result.
 */
export const VIDEO_STAGES: AgentSpec[] = [
  {
    id: 'generation-submitted',
    name: 'Video generation submitted',
    role: 'Approved prompts are sent for generation.',
    detail:
      'Each approved scene prompt is submitted as its own generation job. How many jobs depends on the scene plan.',
    activity: 'Submitting generation jobs…',
    icon: Send,
  },
  {
    id: 'clips-generating',
    name: 'Generating video clips',
    role: 'Clips render scene by scene.',
    detail:
      'Generation runs per scene and is the slowest part of the pipeline. Verilyx collects each clip as it finishes.',
    activity: 'Generating video clips…',
    icon: Film,
  },
  {
    id: 'final-merge',
    name: 'Building final production',
    role: 'Clips are merged into the final video.',
    detail:
      'The completed clips are merged in scene order into a single MP4 — the file delivered to you.',
    activity: 'Merging clips into your final video…',
    icon: Layers,
  },
];

export const FINAL_APPROVAL: AgentSpec = {
  id: 'final-approval',
  name: 'Final Approval',
  role: 'Production package released.',
  detail: 'The approved package is returned with its review and score.',
  activity: 'Finalising package…',
  icon: BadgeCheck,
};

export type StageState = 'waiting' | 'active' | 'complete';
