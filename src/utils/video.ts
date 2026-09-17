/**
 * Final-video helpers: deciding whether a string is a usable video URL, and
 * turning whatever the backend returns into something a <video> tag can play.
 *
 * Kept pure and separate from the normalizer so it can be unit-tested and so the
 * rules for "is this URL safe to show a customer" live in one place.
 */

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v', '.mkv', '.ogv'];

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);

/** Strips query/hash so extension checks look at the path only. */
function pathPart(value: string): string {
  return value.split('#')[0].split('?')[0];
}

/** A bare relative path such as "video/final_abc.mp4" — no scheme, no leading slash. */
const BARE_RELATIVE_PATH = /^[\w.-]+(?:\/[\w.%~-]+)+$/;

/** True when the string is shaped like a URL or an absolute/relative path. */
export function isUrlLike(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 2048) return false;
  if (/\s/.test(trimmed)) return false;
  return (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    BARE_RELATIVE_PATH.test(pathPart(trimmed))
  );
}

/** Strict: the path ends in a known video extension. */
export function hasVideoExtension(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const path = pathPart(value.trim()).toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension));
}

/** Loose: a video extension, or a path segment that reads as a rendered output. */
export function looksLikeVideo(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  if (hasVideoExtension(value)) return true;
  const path = pathPart(value.trim()).toLowerCase();
  // Require something after the segment so a bare ".../videos/" index is ignored.
  return /\/(videos?|renders?|merged|productions?)\/[^/]+$/.test(path);
}

export type ResolveFailure = 'relative_without_base' | 'local_only' | 'invalid';

export type ResolvedUrl =
  | { ok: true; url: string }
  | { ok: false; reason: ResolveFailure; detail: string };

function currentOrigin(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;
  return window.location.origin;
}

function pageIsLocal(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;
  return LOCAL_HOSTS.has(window.location.hostname);
}

/**
 * Turn a raw URL from the backend into an absolute one a browser can load.
 *
 * - absolute http(s)      → used as-is
 * - protocol-relative //h → https://h
 * - relative /video/x.mp4 → joined with `base` (VITE_VERILYX_VIDEO_BASE_URL)
 *
 * A relative URL with no configured base is a configuration problem, not
 * something to paper over — it fails loudly in the console and the UI shows the
 * "link unavailable" state rather than a broken player.
 *
 * A localhost URL is accepted only while the page itself is on localhost, so a
 * developer's merger address is never shown to a real customer as a dead link.
 */
export function resolveVideoUrl(raw: unknown, base: string): ResolvedUrl {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return { ok: false, reason: 'invalid', detail: 'No URL string provided.' };
  }

  const value = raw.trim();
  let absolute: string;

  if (/^https?:\/\//i.test(value)) {
    absolute = value;
  } else if (value.startsWith('//')) {
    absolute = `https:${value}`;
  } else if (
    value.startsWith('/') ||
    value.startsWith('./') ||
    BARE_RELATIVE_PATH.test(pathPart(value))
  ) {
    const root = base.trim().replace(/\/+$/, '');
    if (root.length === 0) {
      return {
        ok: false,
        reason: 'relative_without_base',
        detail:
          `Backend returned the relative video path "${value}" but no video base URL is ` +
          'configured. Set VITE_VERILYX_VIDEO_BASE_URL to the public origin of the video ' +
          'merger service and rebuild.',
      };
    }
    absolute = `${root}/${value.replace(/^\.?\//, '')}`;
  } else {
    return { ok: false, reason: 'invalid', detail: `Not a URL or path: "${value}"` };
  }

  let parsed: URL;
  try {
    parsed = new URL(absolute);
  } catch {
    return { ok: false, reason: 'invalid', detail: `Could not parse URL: "${absolute}"` };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, reason: 'invalid', detail: `Unsupported protocol: ${parsed.protocol}` };
  }

  if (LOCAL_HOSTS.has(parsed.hostname) && !pageIsLocal()) {
    return {
      ok: false,
      reason: 'local_only',
      detail:
        `Backend returned a local-only video URL (${parsed.hostname}). This will not load for ` +
        'anyone but the machine running the merger — expose the merger publicly and return that address.',
    };
  }

  // Mixed content: an https page cannot load an http video.
  const origin = currentOrigin();
  if (origin?.startsWith('https://') && parsed.protocol === 'http:') {
    return {
      ok: false,
      reason: 'invalid',
      detail:
        `Backend returned an http:// video URL (${parsed.host}) but this page is served over ` +
        'https, so the browser will block it. Serve the video over https.',
    };
  }

  return { ok: true, url: parsed.toString() };
}

/** Best-effort download filename, e.g. "final_abc123.mp4". */
export function videoFileName(url: string, fallbackBase: string): string {
  try {
    const path = pathPart(url);
    const last = path.split('/').filter(Boolean).pop() ?? '';
    if (last.length > 0 && /\.[a-z0-9]{2,5}$/i.test(last)) return decodeURIComponent(last);
  } catch {
    /* fall through to the generated name */
  }

  const slug =
    fallbackBase
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .slice(0, 60) || 'verilyx-production';
  return `${slug}.mp4`;
}
