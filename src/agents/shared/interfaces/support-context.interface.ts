import type { ClassificationResult } from '../../classification/classification.schema.js';
import type { InvestigationResult } from '../../investigation/investigation.schema.js';
import type { ResolutionResult } from '../../resolution/resolution.schema.js';

export type SupportStep = 'classification' | 'investigation' | 'resolution';

export interface SupportContext {
  requestId: string;
  customerMessage: string;

  currentStep: SupportStep | 'completed';
  completedSteps: SupportStep[];

  classification?: ClassificationResult;
  investigation?: InvestigationResult;
  resolution?: ResolutionResult;

  requiresHumanReview: boolean;
}
