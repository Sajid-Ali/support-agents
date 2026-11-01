import { Injectable } from '@nestjs/common';

import { ResolutionAgent } from '../resolution/resolution.agent.js';
import { InvestigationAgent } from '../investigation/investigation.agent.js';
import { InvestigationResult } from '../investigation/investigation.schema.js';
import { ClassificationAgent } from '../classification/classification.agent.js';
import { ClassificationResult } from '../classification/classification.schema.js';

@Injectable()
export class OrchestratorAgent {
  constructor(
    private readonly classificationAgent: ClassificationAgent,
    private readonly investigationAgent: InvestigationAgent,
    private readonly resolutionAgent: ResolutionAgent,
  ) {}

  async execute(message: string) {
    // Step 1: Understand the customer's request.
    const classification = await this.classificationAgent.execute(message);

    // Step 2: Investigate only when required.
    let investigation: InvestigationResult;

    const requiresInvestigation =
      classification.requires_investigation ||
      this.requiresInvestigationForIntent(classification.intent);

    if (requiresInvestigation) {
      investigation = await this.investigationAgent.execute(classification);
    } else {
      investigation = this.createNotRequiredInvestigation();
    }

    // Step 3: Generate the customer-facing response.
    const resolution = await this.resolutionAgent.execute(
      message,
      classification,
      investigation,
    );

    // Step 4: Return the complete workflow result.
    return {
      classification,
      investigation,
      resolution: {
        ...resolution,
        requires_human_review: investigation.requires_human_review,
      },
    };
  }

  private requiresInvestigationForIntent(
    intent: ClassificationResult['intent'],
  ): boolean {
    switch (intent) {
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
