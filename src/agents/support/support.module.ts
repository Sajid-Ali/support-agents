import { Module } from '@nestjs/common';

import { SupportService } from './support.service.js';
import { SupportController } from './support.controller.js';
import { OrchestratorModule } from '../orchestrator/orchestrator.module.js';

@Module({
  imports: [OrchestratorModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
