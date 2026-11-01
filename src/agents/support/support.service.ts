import { Inject, Injectable, Logger } from '@nestjs/common';

import { ClassificationAgent } from '../classification/classification.agent.js';
import { InvestigationAgent } from '../investigation/investigation.agent.js';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    private readonly classificationAgent: ClassificationAgent,
    private readonly investigationAgent: InvestigationAgent,
  ) {}

  async processRequest(message: string) {
    this.logger.log(
      `Processing request via "${ClassificationAgent.name}" provider`,
    );

    const classification = await this.classificationAgent.execute(message);

    this.logger.log(
      `Classification result: ${JSON.stringify(classification, null, 2)}`,
    );

    const investigation = await this.investigationAgent.execute(classification);

    this.logger.log(
      `Investigation result: ${JSON.stringify(investigation, null, 2)}`,
    );

    return { classification, investigation };
  }
}
