/**
 * Shapes exchanged with the n8n backend.
 *
 * The raw response is deliberately typed loosely: n8n workflows rename, nest and
 * stringify fields as they are edited, so the UI never consumes the raw payload.
 * `src/utils/normalize.ts` converts whatever arrives into `NormalizedProduction`,
 * which is the ONLY shape components are allowed to read.
 */

/** POST body sent to VITE_N8N_WEBHOOK_URL. */
export interface CreateProductionRequest {
  project_name: string;
  idea: string;
  duration: number;
  style: string;
  name: string;
  email: string;
  website: string;
}

/** Canonical run outcomes. */
export type ProductionStatus =
  | 'completed'
  | 'completed_after_revision'
  | 'needs_human_review';

/** Parsed "STATUS: …" / "FINAL VERDICT: …" verdict found inside a review. */
export type ReviewVerdict =
  | 'APPROVED'
  | 'READY WITH WARNINGS'
  | 'NEEDS REVISION'
  | 'NEEDS HUMAN REVIEW'
  | 'UNKNOWN';

/**
 * State of the finished MP4 — the actual deliverable.
 *
 *  ready         → a playable, absolute URL is available
 *  processing    → the package is back but Runway/merge is still running
 *  failed        → the backend reported that generation or merging failed
 *  unavailable   → a URL came back but cannot be used (relative with no base
 *                  configured, local-only address, expired/blocked link)
 *  not_expected  → this run will not produce a video (escalated to a human)
 */
export type VideoState = 'ready' | 'processing' | 'failed' | 'unavailable' | 'not_expected';

export interface ProductionVideo {
  state: VideoState;
  /** Absolute, playable URL. Empty unless state === 'ready'. */
  url: string;
  /** Suggested download filename. */
  fileName: string;
  /** Backend job/task id, when one was returned. Used by optional status polling. */
  jobId: string;
  /** How many clips were merged, when the backend says. */
  clipCount: number | null;
  /** Customer-facing explanation. Never raw backend text — details go to the console. */
  message: string;
}

/**
 * The single stable object every component reads.
 * Empty string means "the workflow did not return this"; never null-checked ad hoc.
 */
export interface NormalizedProduction {
  success: boolean;
  /** Canonical status after reconciling the backend field with the review verdict. */
  status: ProductionStatus;
  /** Exactly what the backend put in its status field, for display/debugging. */
  rawStatus: string;

  projectName: string;
  duration: string | number | null;
  visualStyle: string;
  email: string;
  submittedBy: string;
  website: string;
  idea: string;

  /** Agent outputs. */
  creativeDirection: string;
  script: string;
  scenePlan: string;
  generationPrompts: string;

  /** Review chain. */
  initialReview: string;
  initialQualityScore: number | null;
  initialVerdict: ReviewVerdict;
  revisedPackage: string;
  finalReview: string;
  finalQualityScore: number | null;
  finalVerdict: ReviewVerdict;

  /** The finished MP4 — the primary deliverable. */
  video: ProductionVideo;

  /** True only when the Revision Agent actually ran. */
  revised: boolean;
  /** Agents that ran, out of the seven in the chain. */
  agentsRun: number;
  agentsTotal: number;

  message: string;
  /** Untouched payload, kept for the error/debug panel only. */
  raw: unknown;
}

/** Categories of failure the UI can explain in plain language. */
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
  title: string;
  message: string;
  /** Raw detail — surfaced only in the console and an optional details panel. */
  detail?: string;
}

/** Top-level screen the app is showing. */
export type AppView = 'landing' | 'processing' | 'results' | 'human_review' | 'error';
