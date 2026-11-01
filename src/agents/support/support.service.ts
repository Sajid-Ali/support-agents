import { Injectable, Logger } from '@nestjs/common';

import { OrchestratorAgent } from '../orchestrator/orchestrator.agent.js';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(private readonly orchestratorAgent: OrchestratorAgent) {}

  async processRequest(message: string) {
    this.logger.log(
      `Processing request via ${OrchestratorAgent.name} provider`,
    );

    const result = await this.orchestratorAgent.execute(message);

    this.logger.log(`Request processed via ${OrchestratorAgent.name} provider`);

    return result;
  }
}
