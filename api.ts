import { IS_WEBHOOK_CONFIGURED, N8N_WEBHOOK_URL } from '@/config';
import { normalizeProduction, withRequestFallbacks } from './normalize';
import type { AppError, CreateProductionRequest, NormalizedProduction } from '@/types';

/**
 * Client for the n8n webhook.
 *
 * Deliberately has NO request timeout: the agent chain can legitimately run for
 * several minutes. The request is only aborted if the user leaves the screen.
 *
 * The client does not interpret the payload — it hands whatever came back to
 * `normalizeProduction`, the single place that understands n8n's field names.
 */

function makeError(error: AppError): AppError {
  console.error(`[Verilyx] ${error.kind}:`, error.detail ?? error.message);
  return error;
}

const GENERIC_MESSAGE =
  "Verilyx couldn't complete this request. Your project was not lost. Please try again.";

export interface SubmitOptions {
  signal?: AbortSignal;
}

export type SubmitResult =
  | { ok: true; data: NormalizedProduction }
  | { ok: false; error: AppError };

export async function submitProduction(
  payload: CreateProductionRequest,
  options: SubmitOptions = {},
): Promise<SubmitResult> {
  if (!IS_WEBHOOK_CONFIGURED) {
    return {
      ok: false,
      error: makeError({
        kind: 'not_configured',
        title: 'Backend not configured',
        message:
          'No n8n webhook URL is set for this build. Add VITE_N8N_WEBHOOK_URL to your environment and redeploy.',
        detail: `VITE_N8N_WEBHOOK_URL resolved to "${N8N_WEBHOOK_URL}"`,
      }),
    };
  }

  let response: Response;
  try {
    response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      // No timeout — the agent chain may run for minutes.
      signal: options.signal,
    });
  } catch (error) {
    if (options.signal?.aborted) {
      return {
        ok: false,
        error: makeError({
          kind: 'network',
          title: 'Request cancelled',
          message: 'The request was cancelled before Verilyx received a response.',
          detail: String(error),
        }),
      };
    }

    // A browser-level fetch rejection is either a dropped connection or a
    // blocked cross-origin request; both look identical from JavaScript.
    return {
      ok: false,
      error: makeError({
        kind: 'cors',
        title: "Couldn't reach the Verilyx backend",
        message: GENERIC_MESSAGE,
        detail:
          `${String(error)} — the network request failed before a response arrived. ` +
          'Common causes: the n8n workflow is not active, the URL is wrong, or the ' +
          'webhook response is missing CORS headers for this origin.',
      }),
    };
  }

  let rawBody = '';
  try {
    rawBody = await response.text();
  } catch (error) {
    return {
      ok: false,
      error: makeError({
        kind: 'empty',
        title: 'Empty response',
        message: GENERIC_MESSAGE,
        detail: `Could not read response body: ${String(error)}`,
      }),
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: makeError({
        kind: 'server',
        title: `Backend returned ${response.status}`,
        message: GENERIC_MESSAGE,
        detail: `HTTP ${response.status} ${response.statusText} — ${rawBody.slice(0, 800)}`,
      }),
    };
  }

  if (rawBody.trim().length === 0) {
    return {
      ok: false,
      error: makeError({
        kind: 'empty',
        title: 'The backend returned nothing',
        message:
          "Verilyx reached the workflow but received an empty response. Your project was not lost — check that the n8n workflow ends with a 'Respond to Webhook' node, then try again.",
        detail: 'Response body was empty.',
      }),
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch (error) {
    return {
      ok: false,
      error: makeError({
        kind: 'invalid_json',
        title: 'Unreadable response',
        message: GENERIC_MESSAGE,
        detail: `JSON parse failed: ${String(error)} — body starts: ${rawBody.slice(0, 400)}`,
      }),
    };
  }

  const normalized = normalizeProduction(parsed);
  if (!normalized) {
    return {
      ok: false,
      error: makeError({
        kind: 'invalid_json',
        title: 'Nothing usable in the response',
        message: GENERIC_MESSAGE,
        detail:
          'The workflow replied, but the payload contained no recognisable agent output ' +
          `and no status field: ${rawBody.slice(0, 800)}`,
      }),
    };
  }

  // Log what was actually mapped — the fastest way to spot a renamed n8n field.
  console.info('[Verilyx] normalized response', {
    status: normalized.status,
    rawStatus: normalized.rawStatus,
    revised: normalized.revised,
    initialQualityScore: normalized.initialQualityScore,
    finalQualityScore: normalized.finalQualityScore,
    populated: {
      creativeDirection: normalized.creativeDirection.length,
      script: normalized.script.length,
      scenePlan: normalized.scenePlan.length,
      generationPrompts: normalized.generationPrompts.length,
      initialReview: normalized.initialReview.length,
      revisedPackage: normalized.revisedPackage.length,
      finalReview: normalized.finalReview.length,
    },
  });

  return { ok: true, data: withRequestFallbacks(normalized, payload) };
}
