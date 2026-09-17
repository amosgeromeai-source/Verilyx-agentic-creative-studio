import { useCallback, useEffect } from 'react';
import { ErrorState, Footer, Header, HumanReviewScreen, ProcessingScreen, ResultsDashboard } from '@/components';
import { LandingPage } from '@/pages/LandingPage';
import { useProduction } from '@/hooks';
import { normalizeProduction, withRequestFallbacks } from '@/utils';
import type { CreateProductionRequest } from '@/types';

/** Optional demo mode: ?demo=first|revised|human renders a sample response
 *  without calling the backend. Only active when VITE_VERILYX_DEMO_MODE=true. */
const DEMO_ENABLED = import.meta.env.VITE_VERILYX_DEMO_MODE === 'true';

export default function App() {
  const production = useProduction();
  const { preview, view } = production;

  useEffect(() => {
    if (!DEMO_ENABLED) return;
    const scenario = new URLSearchParams(window.location.search).get('demo');
    if (!scenario) return;

    void (async () => {
      // Only the fixtures are code-split; the normalizer is part of the main bundle.
      const { DEMO_SCENARIOS, DEMO_REQUEST } = await import('@/utils/demoFixtures');
      const raw = DEMO_SCENARIOS[scenario];
      if (!raw) return;

      // Demo payloads go through the same normalizer as a live response.
      const normalized = normalizeProduction(raw);
      if (normalized) preview(withRequestFallbacks(normalized, DEMO_REQUEST), DEMO_REQUEST);
    })();
  }, [preview]);

  useEffect(() => {
    if (view === 'processing' || view === 'results' || view === 'human_review' || view === 'error') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [view]);

  const scrollToCreate = useCallback(() => {
    const target = document.getElementById('create');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => document.getElementById('projectName')?.focus(), 500);
    }
  }, []);

  const handleHeaderCta = useCallback(() => {
    if (production.view === 'landing') {
      scrollToCreate();
    } else {
      production.reset();
    }
  }, [production, scrollToCreate]);

  const handleSubmit = useCallback(
    (payload: CreateProductionRequest) => {
      void production.start(payload);
    },
    [production],
  );

  const headerVariant = production.view === 'landing' ? 'landing' : 'app';
  const headerCta = production.view === 'landing' ? 'Create Production' : 'New Project';

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        variant={headerVariant}
        onCreateClick={handleHeaderCta}
        ctaLabel={headerCta}
        showCta={production.view !== 'processing'}
      />

      <div className="flex-1">
        {production.view === 'landing' && (
          <LandingPage
            onSubmit={handleSubmit}
            onCreateClick={scrollToCreate}
            isSubmitting={production.isProcessing}
          />
        )}

        {production.view === 'processing' && <ProcessingScreen request={production.request} />}

        {production.view === 'results' && production.result && (
          <ResultsDashboard production={production.result} onStartNew={production.reset} />
        )}

        {production.view === 'human_review' && production.result && (
          <HumanReviewScreen
            production={production.result}
            onStartNew={production.reset}
            onReturnHome={production.reset}
          />
        )}

        {production.view === 'error' && production.error && (
          <ErrorState
            error={production.error}
            onRetry={production.retry}
            onReturnHome={production.reset}
            canRetry={production.request !== null}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
