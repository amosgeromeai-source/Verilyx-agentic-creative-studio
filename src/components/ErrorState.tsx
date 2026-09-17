import { useState } from 'react';
import { ArrowLeft, ChevronDown, PlugZap, RefreshCw, TriangleAlert, WifiOff } from 'lucide-react';
import type { AppError } from '@/types';

interface ErrorStateProps {
  error: AppError;
  onRetry: () => void;
  onReturnHome: () => void;
  /** Hidden when the original request is no longer available. */
  canRetry?: boolean;
}

const HINTS: Record<AppError['kind'], string[]> = {
  network: ['Check your internet connection.', 'Then try submitting again.'],
  cors: [
    'The n8n workflow may be inactive — activate it and try again.',
    'The webhook URL in this build may be wrong or out of date.',
    'The webhook response may be missing CORS headers for this site.',
  ],
  server: [
    'The workflow started but returned an error.',
    'Check the n8n execution log for the failing node.',
  ],
  invalid_json: [
    'The workflow responded with something Verilyx could not read.',
    "Make sure the final 'Respond to Webhook' node returns JSON.",
  ],
  empty: [
    "The workflow finished without sending a response body.",
    "Add or check the 'Respond to Webhook' node at the end of the flow.",
  ],
  not_configured: [
    'Set VITE_N8N_WEBHOOK_URL in your environment.',
    'On Netlify: Site settings → Environment variables, then redeploy.',
  ],
  unknown: ['Try submitting the project again.'],
};

const ICONS: Record<AppError['kind'], typeof TriangleAlert> = {
  network: WifiOff,
  cors: PlugZap,
  server: TriangleAlert,
  invalid_json: TriangleAlert,
  empty: TriangleAlert,
  not_configured: PlugZap,
  unknown: TriangleAlert,
};

export function ErrorState({ error, onRetry, onReturnHome, canRetry = true }: ErrorStateProps) {
  const [showDetail, setShowDetail] = useState(false);
  const Icon = ICONS[error.kind];
  const hints = HINTS[error.kind];

  return (
    <main className="relative px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-xl">
        <div className="glass-strong animate-fade-up p-7 sm:p-9">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/[0.07]">
            <Icon className="h-5 w-5 text-amber-300" />
          </span>

          <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-slate-50 sm:text-[26px]">
            {error.title}
          </h1>
          <p className="mt-3 text-[15px] leading-[1.8] text-slate-400">{error.message}</p>

          {hints.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {hints.map((hint) => (
                <li key={hint} className="flex gap-3 text-[13.5px] leading-relaxed text-slate-400">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55rem] h-1 w-1 flex-none rounded-full bg-slate-600"
                  />
                  {hint}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {canRetry && error.kind !== 'not_configured' && (
              <button type="button" onClick={onRetry} className="btn-primary px-5 py-2.5">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}
            <button type="button" onClick={onReturnHome} className="btn-ghost px-5 py-2.5">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </button>
          </div>

          {error.detail && (
            <div className="mt-7 border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={() => setShowDetail((open) => !open)}
                className="btn-quiet px-0 py-1 text-[12.5px]"
                aria-expanded={showDetail}
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    showDetail ? 'rotate-180' : ''
                  }`}
                />
                {showDetail ? 'Hide technical details' : 'Technical details'}
              </button>
              {showDetail && (
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/[0.07] bg-ink-950/80 p-3.5 font-mono text-[11.5px] leading-relaxed text-slate-500">
                  {error.detail}
                </pre>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[12.5px] text-slate-600">
          Nothing was lost — resubmitting starts a fresh run with the same brief.
        </p>
      </div>
    </main>
  );
}
