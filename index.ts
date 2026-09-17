export { submitProduction } from './api';
export type { SubmitResult, SubmitOptions } from './api';

export {
  normalizeProduction,
  normalizeVideoStatus,
  withRequestFallbacks,
  statusBadgeLabel,
  collectFields,
} from './normalize';

export {
  resolveVideoUrl,
  videoFileName,
  isUrlLike,
  looksLikeVideo,
  hasVideoExtension,
} from './video';
export type { ResolvedUrl, ResolveFailure } from './video';

export { downloadVideo } from './downloadVideo';

export { parseQualityScore, parseReviewStatus, coerceScore, scoreTone } from './quality';

export { parseRichText, parseInline, formatElapsed, wordCount, copyText } from './format';
export type { Block, InlineToken } from './format';

export {
  CORE_AGENTS,
  REVISION_AGENTS,
  ALL_AGENTS,
  VIDEO_STAGES,
  FINAL_APPROVAL,
} from './pipeline';
export type { AgentSpec, StageState } from './pipeline';

export { validateProjectForm, normalizeWebsite } from './validation';
export type { ProjectFormValues, FormErrors } from './validation';

export { packageParts, buildPackageText, downloadPackage, slugify } from './exportPackage';
