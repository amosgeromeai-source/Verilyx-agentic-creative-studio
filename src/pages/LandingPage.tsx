import { About, Hero, HowItWorks, PipelineVisualization, ProjectForm } from '@/components';
import type { CreateProductionRequest } from '@/types';

interface LandingPageProps {
  onSubmit: (payload: CreateProductionRequest) => void;
  onCreateClick: () => void;
  isSubmitting: boolean;
}

export function LandingPage({ onSubmit, onCreateClick, isSubmitting }: LandingPageProps) {
  return (
    <main>
      <Hero onCreateClick={onCreateClick} />
      <PipelineVisualization />
      <HowItWorks />
      <ProjectForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      <About onCreateClick={onCreateClick} />
    </main>
  );
}
