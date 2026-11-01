import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { ResolutionAgent } from '../resolution/resolution.agent.js';
import { InvestigationAgent } from '../investigation/investigation.agent.js';
import { ClassificationAgent } from '../classification/classification.agent.js';

import type { InvestigationResult } from '../investigation/investigation.schema.js';
import type { ClassificationResult } from '../classification/classification.schema.js';
import type { SupportContext } from '../shared/interfaces/support-context.interface.js';

@Injectable()
export class OrchestratorAgent {
  constructor(
    private readonly classificationAgent: ClassificationAgent,
    private readonly investigationAgent: InvestigationAgent,
    private readonly resolutionAgent: ResolutionAgent,
  ) {}

  async execute(message: string) {
    const context: SupportContext = {
      requestId: randomUUID(),
      customerMessage: message,
      currentStep: 'classification',
      completedSteps: [],
      requiresHumanReview: false,
    };
    // Step 1: Classification
    context.currentStep = 'classification';
    context.classification = await this.classificationAgent.execute(context);
    context.completedSteps.push('classification');

    // Step 2: Investigation
    context.currentStep = 'investigation';
    if (this.requiresInvestigation(context.classification)) {
      context.investigation = await this.investigationAgent.execute(context);
    } else {
      context.investigation = this.createNotRequiredInvestigation();
    }
    context.completedSteps.push('investigation');

    // Step 3: Resolution
    context.currentStep = 'resolution';
    context.resolution = await this.resolutionAgent.execute(context);
    context.completedSteps.push('resolution');

    // Step 4: Finalize workflow
    context.requiresHumanReview = context.investigation.requires_human_review;
    context.currentStep = 'completed';

    return {
      request_id: context.requestId,
      classification: context.classification,
      investigation: context.investigation,
      resolution: {
        ...context.resolution,
        requires_human_review: context.requiresHumanReview,
      },
    };
  }

  private requiresInvestigation(classification: ClassificationResult): boolean {
    if (classification.requires_investigation) {
      return true;
    }

    switch (classification.intent) {
      case 'check_transaction_status':
      case 'report_failed_transaction':
      case 'report_duplicate_transaction':
      case 'request_refund':
        return true;

      default:
        return false;
    }
  }

  private createNotRequiredInvestigation(): InvestigationResult {
    return {
      status: 'not_required',
      transaction: {
        transaction_id: null,
        transaction_status: 'unknown',
        amount: null,
        currency: null,
        transaction_type: 'unknown',
      },
      findings: 'Investigation is not required for this request.',
      next_action: 'Respond based on the customer request.',
      requires_human_review: false,
    };
  }
}
