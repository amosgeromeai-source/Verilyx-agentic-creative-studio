import type { ReviewVerdict } from '@/types';

/**
 * Quality scores and verdicts arrive two ways: as a numeric API field, or buried
 * in the prose an agent wrote. These parsers cover the prose case.
 */

/**
 * Ordered by specificity — "FINAL QUALITY SCORE" must win over a bare "SCORE"
 * that appears later in the same document.
 *
 * Each pattern tolerates the punctuation LLMs actually emit around a label:
 * `:` `-` `–` `—` `=`, markdown bold stars, and a line break instead of a space.
 * Matches:
 *   QUALITY SCORE: 94          QUALITY SCORE: 94/100
 *   Quality Score: 94          Quality Score: 94/100
 *   **QUALITY SCORE:** 94      FINAL QUALITY SCORE — 92
 *   Quality Score
 *   94/100                     Overall score of 88
 */
const SCORE_PATTERNS: RegExp[] = [
  /final\s*quality\s*score\s*\**\s*[:\-–—=]*\s*\**\s*(\d{1,3})\s*(?:\/\s*100)?/i,
  /quality\s*score\s*\**\s*[:\-–—=]*\s*\**\s*(\d{1,3})\s*(?:\/\s*100)?/i,
  /overall\s*(?:quality\s*)?score\s*\**\s*[:\-–—=]*\s*\**\s*(\d{1,3})\s*(?:\/\s*100)?/i,
  /\bscore\s*\**\s*[:\-–—=]*\s*\**\s*(\d{1,3})\s*(?:\/\s*100)?/i,
  /\bscore\s+(?:of|is|was|=)\s+\**\s*(\d{1,3})\b/i,
  /\b(\d{1,3})\s*\/\s*100\b/,
  /\b(\d{1,3})\s*(?:points?|pts)\s*(?:out\s+of\s+100)\b/i,
];

function clampScore(value: number): number | null {
  if (!Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 0 || rounded > 100) return null;
  return rounded;
}

/**
 * Pull a 0–100 quality score out of free-form review text.
 * Returns null when nothing plausible is present.
 */
export function parseQualityScore(text: unknown): number | null {
  if (typeof text !== 'string' || text.trim().length === 0) return null;

  for (const pattern of SCORE_PATTERNS) {
    const match = pattern.exec(text);
    if (match?.[1]) {
      const score = clampScore(Number.parseInt(match[1], 10));
      if (score !== null) return score;
    }
  }
  return null;
}

/** Coerce a numeric-ish API field into a valid 0–100 score, or null. */
export function coerceScore(value: unknown): number | null {
  if (typeof value === 'number') return clampScore(value);
  if (typeof value === 'string') {
    const direct = Number.parseFloat(value.trim());
    if (Number.isFinite(direct)) {
      const score = clampScore(direct);
      if (score !== null) return score;
    }
    // "94/100" or "Score: 94" handed over as a string field.
    return parseQualityScore(value);
  }
  return null;
}

/**
 * Verdict labels, longest-first so "NEEDS HUMAN REVIEW" is never truncated to
 * "NEEDS REVISION" and "APPROVED WITH WARNINGS" is never read as "APPROVED".
 */
const VERDICT_ALTERNATION =
  '(' +
  [
    'needs\\s+human\\s+review',
    'requires\\s+human\\s+review',
    'human\\s+review\\s+required',
    'escalated?\\s+(?:for\\s+)?human\\s+review',
    'approved\\s+with\\s+warnings',
    'ready\\s+with\\s+warnings',
    'needs\\s+revision',
    'requires\\s+revision',
    'revision\\s+required',
    'not\\s+approved',
    'rejected',
    'approved',
    'passed',
    'pass',
    'failed',
    'fail',
  ].join('|') +
  ')';

const VERDICT_PATTERNS: RegExp[] = [
  new RegExp(`final\\s*verdict\\s*\\**\\s*[:\\-–—=]*\\s*\\**\\s*${VERDICT_ALTERNATION}`, 'i'),
  new RegExp(`\\bstatus\\s*\\**\\s*[:\\-–—=]*\\s*\\**\\s*${VERDICT_ALTERNATION}`, 'i'),
  new RegExp(`\\bverdict\\s*\\**\\s*[:\\-–—=]*\\s*\\**\\s*${VERDICT_ALTERNATION}`, 'i'),
  new RegExp(`\\brecommendation\\s*\\**\\s*[:\\-–—=]*\\s*\\**\\s*${VERDICT_ALTERNATION}`, 'i'),
];

function toVerdict(raw: string): ReviewVerdict {
  const normalized = raw.replace(/\s+/g, ' ').trim().toUpperCase();

  if (normalized.includes('HUMAN REVIEW')) return 'NEEDS HUMAN REVIEW';
  if (normalized.includes('WARNINGS')) return 'READY WITH WARNINGS';
  if (/REVISION|REJECTED|NOT APPROVED|^FAIL/.test(normalized)) return 'NEEDS REVISION';
  if (/^APPROVED$|^PASS/.test(normalized)) return 'APPROVED';
  return 'UNKNOWN';
}

/** Pull a verdict out of free-form review text. */
export function parseReviewStatus(text: unknown): ReviewVerdict {
  if (typeof text !== 'string' || text.trim().length === 0) return 'UNKNOWN';

  for (const pattern of VERDICT_PATTERNS) {
    // The verdict itself is captured in group 1, so the label never
    // contaminates the classification.
    const verdict = toVerdict(pattern.exec(text)?.[1] ?? '');
    if (verdict !== 'UNKNOWN') return verdict;
  }
  return 'UNKNOWN';
}

/** Accent color family for a score, used by the ring and badges. */
export function scoreTone(score: number | null): 'cyan' | 'emerald' | 'amber' | 'slate' {
  if (score === null) return 'slate';
  if (score >= 90) return 'emerald';
  if (score >= 80) return 'cyan';
  return 'amber';
}
