/**
 * The contract between the n8n workflow and the UI.
 *
 * Nothing in here describes the raw webhook payload — that shape is unstable by
 * design and is only ever touched by `utils/normalize.ts`. These are the stable
 * types every component reads.
 */

/** Exactly what is POSTed to the n8n webhook. Snake_case to match the workflow. */
export interface CreateProductionRequest {
  project_name: string;
  idea: string;
  /** Target runtime in seconds: 15, 30 or 60. */
  duration: number;
  /** Preset name, or the user's free-text style when "Custom" was chosen. */
  style: string;
  name: string;
  email: string;
  /** Normalized https URL, or '' when the user left it blank. */
  website: string;
}

/**
 * Canonical run outcome, derived from the backend status and then corrected by
 * the final review — see the honesty override in `normalizeProduction`.
 */
export type ProductionStatus = 'completed' | 'completed_after_revision' | 'needs_human_review';

/** A quality reviewer's verdict. 'UNKNOWN' means no verdict could be parsed. */
export type ReviewVerdict =
  | 'APPROVED'
  | 'READY WITH WARNINGS'
  | 'NEEDS REVISION'
  | 'NEEDS HUMAN REVIEW'
  | 'UNKNOWN';

/**
 * State of the final MP4.
 *
 * `ready` is only ever set when a URL actually resolved — the frontend never
 * invents a video. The other states are honest holding or failure positions:
 *   processing    — package is back, the render is still running
 *   unavailable   — a URL came back but could not be used
 *   failed        — the backend reported the render as failed
 *   not_expected  — the run needs a human, so no video is coming
 */
export type VideoState = 'processing' | 'ready' | 'unavailable' | 'failed' | 'not_expected';

export interface ProductionVideo {
  state: VideoState;
  /** Absolute, playable URL. '' unless `state` is 'ready'. */
  url: string;
  /** Suggested download filename. '' unless `state` is 'ready'. */
  fileName: string;
  /** Backend job id, used by the optional status-polling path. '' when absent. */
  jobId: string;
  /** Clips merged into the final cut, when the backend reports it. */
  clipCount: number | null;
  /** User-facing explanation for a non-ready state. '' when there is nothing to say. */
  message: string;
}

/**
 * The single object the UI renders. Every field is always present: text that
 * genuinely was not in the response is '', and a missing score is null — never
 * a guess and never a placeholder.
 */
export interface NormalizedProduction {
  success: boolean;
  status: ProductionStatus;
  /** The backend's own status string, kept for display and debugging. */
  rawStatus: string;
  video: ProductionVideo;

  /* --- the brief, echoed back or filled in from the form ---------------- */
  projectName: string;
  /** Seconds when numeric; the backend's own string when it isn't. */
  duration: string | number | null;
  visualStyle: string;
  email: string;
  submittedBy: string;
  website: string;
  idea: string;

  /* --- agent output ----------------------------------------------------- */
  creativeDirection: string;
  script: string;
  scenePlan: string;
  generationPrompts: string;

  /* --- first quality pass ----------------------------------------------- */
  initialReview: string;
  initialQualityScore: number | null;
  initialVerdict: ReviewVerdict;

  /* --- revision pass (empty when the Revision Agent never ran) ---------- */
  revisedPackage: string;
  finalReview: string;
  finalQualityScore: number | null;
  finalVerdict: ReviewVerdict;
  revised: boolean;

  agentsRun: number;
  agentsTotal: number;
  /** Status note from the workflow, when it sent one. */
  message: string;
  /** The untouched payload, for the debug view. */
  raw: unknown;
}

/** Why a submission failed. Each kind maps to its own hint list in `ErrorState`. */
export type AppErrorKind =
  | 'network'
  | 'cors'
  | 'server'
  | 'invalid_json'
  | 'empty'
  | 'not_configured'
  | 'unknown';

export interface AppError {
  kind: AppErrorKind;
  /** Short headline shown to the user. */
  title: string;
  /** Plain-language explanation, safe to show to anyone. */
  message: string;
  /** Technical detail for the collapsible section and the console. May contain server paths. */
  detail?: string;
}
