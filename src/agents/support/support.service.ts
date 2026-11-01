import { Inject, Injectable, Logger } from '@nestjs/common';

import { ClassificationAgent } from '../classification/classification.agent.js';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(private readonly classificationAgent: ClassificationAgent) {}

  async processRequest(message: string) {
    this.logger.log(
      `Processing request via "${ClassificationAgent.name}" provider`,
    );

    const classification = await this.classificationAgent.execute(message);

    this.logger.log(
      `Classification result: ${JSON.stringify(classification, null, 2)}`,
    );

    return classification;
  }
}
