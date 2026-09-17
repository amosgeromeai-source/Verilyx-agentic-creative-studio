import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IS_STATUS_POLLING_ENABLED,
  STATUS_POLL_INTERVAL_MS,
  STATUS_POLL_TIMEOUT_MS,
  VIDEO_STATUS_URL,
} from '@/config';
import { normalizeVideoStatus } from '@/utils';
import type { ProductionVideo } from '@/types';

/**
 * OPTIONAL polling for the finished video.
 *
 * ── Read this before wiring a backend ──────────────────────────────────────
 * The n8n workflow answers ONCE, over the webhook. There is no job-status API
 * today, so this hook is deliberately inert: with VITE_VERILYX_STATUS_URL unset
 * it never fires a request, never fakes progress, and simply reports the video
 * state that came back with the production package.
 *
 * To turn it on, expose an endpoint that takes a job id and returns JSON
 * containing any of the supported video URL fields (see README), then set
 * VITE_VERILYX_STATUS_URL. `{jobId}` in the URL is substituted; otherwise the id
 * is appended as `?job=<id>`.
 *
 * This is the single place that would need a backend change — nothing else in
 * the app assumes polling exists.
 */

export interface VideoStatusResult {
  video: ProductionVideo;
  /** True when a status endpoint is configured AND usable for this run. */
  pollingEnabled: boolean;
  /** True while a poll request is in flight or scheduled. */
  isPolling: boolean;
  /** Polling gave up after STATUS_POLL_TIMEOUT_MS. */
  timedOut: boolean;
  /** Manual re-check; no-op when polling is not enabled. */
  checkNow: () => void;
}

function buildStatusUrl(jobId: string): string | null {
  if (VIDEO_STATUS_URL.includes('{jobId}')) {
    if (!jobId) return null;
    return VIDEO_STATUS_URL.replace('{jobId}', encodeURIComponent(jobId));
  }
  if (!jobId) return VIDEO_STATUS_URL;
  const separator = VIDEO_STATUS_URL.includes('?') ? '&' : '?';
  return `${VIDEO_STATUS_URL}${separator}job=${encodeURIComponent(jobId)}`;
}

export function useVideoStatus(
  initial: ProductionVideo,
  projectName: string,
): VideoStatusResult {
  const [video, setVideo] = useState<ProductionVideo>(initial);
  const [isPolling, setIsPolling] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const controller = useRef<AbortController | null>(null);

  // A new production resets everything.
  useEffect(() => {
    setVideo(initial);
    setTimedOut(false);
    startedAt.current = Date.now();
  }, [initial]);

  const shouldPoll =
    IS_STATUS_POLLING_ENABLED &&
    video.state === 'processing' &&
    buildStatusUrl(video.jobId) !== null;

  const poll = useCallback(async () => {
    const url = buildStatusUrl(video.jobId);
    if (!url) return;

    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;

    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: abort.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const payload: unknown = await response.json();
      const update = normalizeVideoStatus(payload, projectName);
      if (update && update.state !== 'processing') setVideo(update);
    } catch (error) {
      if (!abort.signal.aborted) {
        // Transient status errors must never break the results page.
        console.warn('[Verilyx] video status check failed; will retry.', error);
      }
    }
  }, [video.jobId, projectName]);

  useEffect(() => {
    if (!shouldPoll) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    const id = window.setInterval(() => {
      if (Date.now() - startedAt.current > STATUS_POLL_TIMEOUT_MS) {
        setTimedOut(true);
        setIsPolling(false);
        window.clearInterval(id);
        return;
      }
      void poll();
    }, STATUS_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(id);
      controller.current?.abort();
    };
  }, [shouldPoll, poll]);

  const checkNow = useCallback(() => {
    if (shouldPoll) void poll();
  }, [shouldPoll, poll]);

  return {
    video,
    pollingEnabled: shouldPoll,
    isPolling,
    timedOut,
    checkNow,
  };
}
