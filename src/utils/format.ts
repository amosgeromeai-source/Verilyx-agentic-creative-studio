/**
 * Long AI output arrives as loosely-structured markdown-ish text.
 * These helpers turn it into a small block model the UI can render nicely
 * instead of dumping a raw blob on the page.
 */

export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'code'; value: string };

export type Block =
  | { type: 'heading'; level: 1 | 2 | 3; tokens: InlineToken[] }
  | { type: 'paragraph'; tokens: InlineToken[] }
  | { type: 'field'; label: string; tokens: InlineToken[] }
  | { type: 'bullets'; items: InlineToken[][] }
  | { type: 'ordered'; items: InlineToken[][]; start: number }
  | { type: 'quote'; tokens: InlineToken[] }
  | { type: 'code'; value: string; lang?: string }
  | { type: 'divider' };

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*|__[^_]+__)/g;

/** Split a line into bold / italic / code / plain runs. */
export function parseInline(input: string): InlineToken[] {
  if (!input) return [];
  const tokens: InlineToken[] = [];
  let lastIndex = 0;

  for (const match of input.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ type: 'text', value: input.slice(lastIndex, index) });
    }
    const raw = match[0];
    if (raw.startsWith('**') && raw.endsWith('**')) {
      tokens.push({ type: 'bold', value: raw.slice(2, -2) });
    } else if (raw.startsWith('__') && raw.endsWith('__')) {
      tokens.push({ type: 'bold', value: raw.slice(2, -2) });
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      tokens.push({ type: 'code', value: raw.slice(1, -1) });
    } else {
      tokens.push({ type: 'italic', value: raw.slice(1, -1) });
    }
    lastIndex = index + raw.length;
  }

  if (lastIndex < input.length) {
    tokens.push({ type: 'text', value: input.slice(lastIndex) });
  }
  return tokens.length > 0 ? tokens : [{ type: 'text', value: input }];
}

const BULLET_RE = /^\s*(?:[-*•–—]|•)\s+(.*)$/;
const ORDERED_RE = /^\s*(\d{1,3})[.)]\s+(.*)$/;
const ATX_HEADING_RE = /^\s*(#{1,6})\s+(.*)$/;
const DIVIDER_RE = /^\s*(?:-{3,}|={3,}|_{3,}|\*{3,})\s*$/;
const QUOTE_RE = /^\s*>\s?(.*)$/;
const FENCE_RE = /^\s*```\s*([A-Za-z0-9+#-]*)\s*$/;

/**
 * A short all-caps / Title-Case line ending in a colon, or wrapped in **,
 * reads as a section heading in this kind of AI output.
 */
function looksLikeHeading(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.length > 90) return false;

  const boldWhole = /^\*\*(.+)\*\*:?$/.exec(trimmed);
  if (boldWhole) return true;

  if (!/[A-Za-z]/.test(trimmed)) return false;

  // ALL CAPS line, optionally ending with a colon.
  const withoutPunct = trimmed.replace(/[:.\s]+$/, '');
  const letters = withoutPunct.replace(/[^A-Za-z]/g, '');
  if (letters.length >= 3 && withoutPunct === withoutPunct.toUpperCase()) return true;

  // "Scene 3:" / "Creative Direction:" — short label line ending in a colon.
  if (/:$/.test(trimmed) && withoutPunct.split(/\s+/).length <= 7) return true;

  return false;
}

/**
 * Script and scene-plan output is full of labelled lines —
 * "VISUAL: …", "VO: …", "Camera: …", "ON SCREEN: …".
 * Detecting them keeps each on its own row instead of merging into a paragraph.
 */
const FIELD_RE = /^\s*\**([A-Za-z][A-Za-z0-9 ./_-]{0,24}?)\**\s*:\s+(\S.*)$/;

function isFieldLabel(label: string): boolean {
  const trimmed = label.trim();
  if (trimmed.length === 0 || trimmed.length > 26) return false;
  if (trimmed.split(/\s+/).length > 3) return false;
  if (!/^[A-Z]/.test(trimmed)) return false;

  // ALL CAPS labels, e.g. VISUAL, VO, ON SCREEN, SFX.
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return true;
  // Single Capitalised word, e.g. Shot, Camera, Lighting, Continuity.
  return /^[A-Z][a-z]{2,}$/.test(trimmed);
}

function stripHeadingDecoration(line: string): string {
  return line
    .trim()
    .replace(/^\*\*(.+?)\*\*:?$/, '$1')
    .replace(/:$/, '')
    .trim();
}

/** Turn a block of AI text into renderable blocks. */
export function parseRichText(input: string | undefined | null): Block[] {
  if (!input || typeof input !== 'string') return [];

  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let bullets: string[] = [];
  let ordered: { start: number; items: string[] } | null = null;
  let fence: { lang?: string; lines: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', tokens: parseInline(paragraph.join(' ').trim()) });
      paragraph = [];
    }
  };
  const flushBullets = () => {
    if (bullets.length > 0) {
      blocks.push({ type: 'bullets', items: bullets.map(parseInline) });
      bullets = [];
    }
  };
  const flushOrdered = () => {
    if (ordered && ordered.items.length > 0) {
      blocks.push({
        type: 'ordered',
        start: ordered.start,
        items: ordered.items.map(parseInline),
      });
    }
    ordered = null;
  };
  const flushAll = () => {
    flushParagraph();
    flushBullets();
    flushOrdered();
  };

  for (const rawLine of lines) {
    const fenceMatch = FENCE_RE.exec(rawLine);

    if (fence) {
      if (fenceMatch) {
        blocks.push({ type: 'code', value: fence.lines.join('\n'), lang: fence.lang });
        fence = null;
      } else {
        fence.lines.push(rawLine);
      }
      continue;
    }

    if (fenceMatch) {
      flushAll();
      fence = { lang: fenceMatch[1] || undefined, lines: [] };
      continue;
    }

    const line = rawLine.trimEnd();

    if (line.trim() === '') {
      flushAll();
      continue;
    }

    if (DIVIDER_RE.test(line)) {
      flushAll();
      blocks.push({ type: 'divider' });
      continue;
    }

    const atx = ATX_HEADING_RE.exec(line);
    if (atx) {
      flushAll();
      const hashes = atx[1].length;
      const level = (hashes <= 1 ? 1 : hashes === 2 ? 2 : 3) as 1 | 2 | 3;
      blocks.push({ type: 'heading', level, tokens: parseInline(stripHeadingDecoration(atx[2])) });
      continue;
    }

    const quote = QUOTE_RE.exec(line);
    if (quote) {
      flushAll();
      blocks.push({ type: 'quote', tokens: parseInline(quote[1]) });
      continue;
    }

    const bullet = BULLET_RE.exec(line);
    if (bullet) {
      flushParagraph();
      flushOrdered();
      bullets.push(bullet[1]);
      continue;
    }

    const numbered = ORDERED_RE.exec(line);
    if (numbered) {
      flushParagraph();
      flushBullets();
      const value = Number.parseInt(numbered[1], 10);
      if (!ordered) ordered = { start: Number.isFinite(value) ? value : 1, items: [] };
      ordered.items.push(numbered[2]);
      continue;
    }

    if (looksLikeHeading(line)) {
      flushAll();
      blocks.push({ type: 'heading', level: 3, tokens: parseInline(stripHeadingDecoration(line)) });
      continue;
    }

    const field = FIELD_RE.exec(line);
    if (field && isFieldLabel(field[1])) {
      flushAll();
      blocks.push({
        type: 'field',
        label: field[1].trim(),
        tokens: parseInline(field[2].trim()),
      });
      continue;
    }

    flushBullets();
    flushOrdered();
    paragraph.push(line.trim());
  }

  if (fence) {
    blocks.push({ type: 'code', value: fence.lines.join('\n'), lang: fence.lang });
  }
  flushAll();

  return blocks;
}

/** Seconds → "02:34" (or "1:02:34" past an hour). */
export function formatElapsed(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/** Rough word count used for the section meta line. */
export function wordCount(text: string | undefined | null): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/** Clipboard write with a document.execCommand fallback for older browsers. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn('[Verilyx] Clipboard API failed, falling back.', error);
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch (error) {
    console.error('[Verilyx] Copy failed.', error);
    return false;
  }
}
