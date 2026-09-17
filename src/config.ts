/**
 * Verilyx — single place for the handful of values you'll want to change.
 * Everything here is safe to edit and commit; secrets belong in .env, and
 * anything secret (Runway, OpenAI, n8n credentials) stays on the backend.
 */

/** Your business website. Replace before deploying. */
export const PERSONAL_WEBSITE_URL = 'https://verilyxautomation.org';

/** Public GitHub profile or repository link shown in the footer. */
export const GITHUB_URL = 'https://github.com/amosgerome03-byte';

/** Product naming used across the UI. */
export const BRAND = {
  name: 'Verilyx',
  tagline: 'Creative Studio',
  positioning: 'AI Creative Production, From Brief to Final Video.',
  footerNote: 'AI creative production — planned, reviewed, generated and delivered.',
} as const;

/**
 * n8n webhook that receives the production request.
 * Set VITE_N8N_WEBHOOK_URL in .env (local) and in Netlify → Site settings →
 * Environment variables (production). Vite inlines it at build time.
 */
export const N8N_WEBHOOK_URL: string = import.meta.env.VITE_N8N_WEBHOOK_URL ?? '';

/** True when the webhook URL has actually been configured. */
export const IS_WEBHOOK_CONFIGURED: boolean =
  typeof N8N_WEBHOOK_URL === 'string' &&
  N8N_WEBHOOK_URL.trim().length > 0 &&
  !N8N_WEBHOOK_URL.includes('YOUR-N8N-DOMAIN');

/**
 * Public origin of the video merger service, used to turn a relative video path
 * (for example "/video/final_abc.mp4") into an absolute URL.
 *
 * Only needed when the backend returns relative paths. If it returns absolute
 * URLs, leave this unset. Never point it at localhost for a deployed site.
 */
export const VIDEO_BASE_URL: string = (import.meta.env.VITE_VERILYX_VIDEO_BASE_URL ?? '').trim();

/**
 * OPTIONAL job-status endpoint.
 *
 * The n8n workflow currently answers once, over the webhook, and there is no
 * per-job status API — so the frontend does NOT poll by default. If you later
 * expose an endpoint that takes a job id and returns the finished video, set
 * this and the results page will poll it while the video is still rendering.
 *
 * Expected contract (see README): GET `${VIDEO_STATUS_URL}?job=<id>` returning
 * JSON containing any of the supported video URL fields, or a status field.
 * The `{jobId}` placeholder is substituted when present.
 */
export const VIDEO_STATUS_URL: string = (import.meta.env.VITE_VERILYX_STATUS_URL ?? '').trim();

/** True when the optional polling path above is wired up. */
export const IS_STATUS_POLLING_ENABLED: boolean = VIDEO_STATUS_URL.length > 0;

/** How often to poll the status endpoint, and for how long, when enabled. */
export const STATUS_POLL_INTERVAL_MS = 15_000;
export const STATUS_POLL_TIMEOUT_MS = 30 * 60_000;

/** Duration choices offered in the create form. */
export const DURATION_OPTIONS = [
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '60 seconds' },
] as const;

/** Visual style presets. "Custom" reveals a free-text input. */
export const STYLE_OPTIONS = [
  'Cinematic Futuristic',
  'Luxury Minimal',
  'Cyberpunk',
  'Corporate Premium',
  'Documentary',
  'Editorial',
  'Photorealistic',
  'Technology',
  'Custom',
] as const;

/** Quality threshold the backend uses before a package is approved. */
export const QUALITY_THRESHOLD = 85;
