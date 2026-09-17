import { useMemo } from 'react';
import { CORE_AGENTS, type StageState } from '@/utils';

/**
 * The frontend gets no realtime stage updates from n8n, so progression here is
 * an *estimate* driven by elapsed time. Three rules keep it honest:
 *
 *  1. The last core stage never auto-completes — only a real response does that.
 *  2. The UI labels this as estimated progress rather than confirmed state.
 *  3. Once the estimate runs out, Verilyx stops naming a specific stage. Past
 *     that point the Revision Agent, the Final Quality Reviewer or video
 *     generation may be the one running, and claiming "Quality Reviewer"
 *     indefinitely would be a lie.
 */

/** Cumulative seconds at which each stage hands off to the next. */
const HANDOFF_SECONDS = [20, 48, 82, 118];

/** After this the estimate has run out and wording goes deliberately generic. */
const UNCERTAIN_AFTER_SECONDS = 150;

export interface SimulatedPipeline {
  /** Index of the stage currently shown as active (0-based). */
  activeIndex: number;
  states: StageState[];
  /** Present-tense line for the active stage. */
  activityLine: string;
  /** True once the run has been going long enough to reassure the user. */
  isLongRunning: boolean;
  /** True once Verilyx can no longer justify naming a specific stage. */
  isUncertain: boolean;
}

const UNCERTAIN_LINE =
  'Quality review, automatic revision or video generation may be in progress…';

export function useStageSimulation(elapsedSeconds: number): SimulatedPipeline {
  return useMemo(() => {
    let activeIndex = 0;
    for (let i = 0; i < HANDOFF_SECONDS.length; i += 1) {
      if (elapsedSeconds >= HANDOFF_SECONDS[i]) activeIndex = i + 1;
    }
    activeIndex = Math.min(activeIndex, CORE_AGENTS.length - 1);

    const isUncertain = elapsedSeconds >= UNCERTAIN_AFTER_SECONDS;

    const states: StageState[] = CORE_AGENTS.map((_, index) => {
      if (index < activeIndex) return 'complete';
      if (index === activeIndex) return 'active';
      return 'waiting';
    });

    return {
      activeIndex,
      states,
      activityLine: isUncertain ? UNCERTAIN_LINE : CORE_AGENTS[activeIndex].activity,
      isLongRunning: elapsedSeconds >= UNCERTAIN_AFTER_SECONDS,
      isUncertain,
    };
  }, [elapsedSeconds]);
}
