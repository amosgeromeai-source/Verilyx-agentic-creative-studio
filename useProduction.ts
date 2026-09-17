import { useCallback, useEffect, useRef, useState } from 'react';
import { submitProduction } from '@/utils';
import type { AppError, AppView, CreateProductionRequest, NormalizedProduction } from '@/types';

interface ProductionState {
  view: AppView;
  request: CreateProductionRequest | null;
  /** Always the normalized object — never a raw n8n payload. */
  result: NormalizedProduction | null;
  error: AppError | null;
}

const INITIAL: ProductionState = {
  view: 'landing',
  request: null,
  result: null,
  error: null,
};

/** Owns the submit → processing → result lifecycle for a single production run. */
export function useProduction() {
  const [state, setState] = useState<ProductionState>(INITIAL);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);

  const isProcessing = state.view === 'processing';

  const start = useCallback(async (payload: CreateProductionRequest) => {
    if (controller.current) controller.current.abort();
    const abort = new AbortController();
    controller.current = abort;

    setState({ view: 'processing', request: payload, result: null, error: null });

    const outcome = await submitProduction(payload, { signal: abort.signal });
    if (!mounted.current || abort.signal.aborted) return;

    if (!outcome.ok) {
      setState((prev) => ({ ...prev, view: 'error', error: outcome.error }));
      return;
    }

    setState((prev) => ({
      ...prev,
      view: outcome.data.status === 'needs_human_review' ? 'human_review' : 'results',
      result: outcome.data,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    setState(INITIAL);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const retry = useCallback(() => {
    if (state.request) void start(state.request);
  }, [start, state.request]);

  /** Development/demo helper: render a known response without calling the API. */
  const preview = useCallback(
    (data: NormalizedProduction, request: CreateProductionRequest) => {
      setState({
        view: data.status === 'needs_human_review' ? 'human_review' : 'results',
        request,
        result: data,
        error: null,
      });
    },
    [],
  );

  return {
    ...state,
    isProcessing,
    start,
    reset,
    retry,
    preview,
  };
}
