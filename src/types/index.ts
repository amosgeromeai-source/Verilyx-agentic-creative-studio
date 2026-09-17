export type {
  AppError,
  AppErrorKind,
  CreateProductionRequest,
  NormalizedProduction,
  ProductionStatus,
  ProductionVideo,
  ReviewVerdict,
  VideoState,
} from './api';

/** Which screen the app is showing. One production run moves through these in order. */
export type AppView = 'landing' | 'processing' | 'results' | 'human_review' | 'error';
