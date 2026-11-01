import { Injectable } from '@nestjs/common';

import { TransactionService } from '../../tools/transactions/transaction.service.js';
import { ClassificationResult } from '../classification/classification.schema.js';
import {
  InvestigationResult,
  InvestigationSchema,
} from './investigation.schema.js';

@Injectable()
export class InvestigationAgent {
  constructor(private readonly transactionService: TransactionService) {}

  async execute(
    classification: ClassificationResult,
  ): Promise<InvestigationResult> {
    const transactionId = classification.entities.transaction_id;

    if (!classification.requires_investigation) {
      return this.createResult({
        status: 'not_required',
        findings: 'No transaction investigation is required.',
        nextAction: 'Continue with the support workflow.',
      });
    }

    if (!transactionId) {
      return this.createResult({
        status: 'needs_more_information',
        findings: 'A transaction ID is required to investigate this request.',
        nextAction: 'Ask the customer to provide their transaction ID.',
      });
    }

    const transaction = await this.transactionService.findById(transactionId);

    if (!transaction) {
      return this.createResult({
        status: 'not_found',
        findings: 'No transaction was found for the provided transaction ID.',
        nextAction: 'Verify the transaction ID with the customer.',
      });
    }

    const result: InvestigationResult = {
      status: 'investigated',
      transaction: {
        transaction_id: transaction.transactionId,
        transaction_status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        transaction_type: transaction.transactionType,
      },
      findings: `Transaction was found with status: ${transaction.status}.`,
      next_action: this.getNextAction(transaction.status),
      requires_human_review: transaction.status === 'failed',
    };

    return InvestigationSchema.parse(result);
  }

  private createResult(params: {
    status: InvestigationResult['status'];
    findings: string;
    nextAction: string;
  }): InvestigationResult {
    return InvestigationSchema.parse({
      status: params.status,
      transaction: {
        transaction_id: null,
        transaction_status: 'unknown',
        amount: null,
        currency: null,
        transaction_type: 'unknown',
      },
      findings: params.findings,
      next_action: params.nextAction,
      requires_human_review: false,
    });
  }

  private getNextAction(status: 'completed' | 'pending' | 'failed'): string {
    switch (status) {
      case 'completed':
        return 'Inform the customer that the transaction was completed.';

      case 'pending':
        return 'Check the transaction processing timeline and provide the customer with an update.';

      case 'failed':
        return 'Escalate the failed transaction for human review.';
    }
  }
}
