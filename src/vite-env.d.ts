/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** n8n webhook that receives the production request. Required. */
  readonly VITE_N8N_WEBHOOK_URL?: string;
  /** Public origin of the video merger, for resolving relative video paths. Optional. */
  readonly VITE_VERILYX_VIDEO_BASE_URL?: string;
  /** Optional job-status endpoint; enables polling for the final video. */
  readonly VITE_VERILYX_STATUS_URL?: string;
  /** Optional: set to "true" to enable ?demo=first|revised|human|video|rendering. */
  readonly VITE_VERILYX_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
