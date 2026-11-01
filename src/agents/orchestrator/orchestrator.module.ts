import { Module } from '@nestjs/common';

import { OrchestratorAgent } from './orchestrator.agent.js';
import { ResolutionModule } from '../resolution/resolution.module.js';
import { InvestigationModule } from '../investigation/investigation.module.js';
import { ClassificationModule } from '../classification/classification.module.js';

@Module({
  imports: [ClassificationModule, InvestigationModule, ResolutionModule],
  providers: [OrchestratorAgent],
  exports: [OrchestratorAgent],
})
export class OrchestratorModule {}
