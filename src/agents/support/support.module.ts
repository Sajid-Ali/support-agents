import { Module } from '@nestjs/common';

import { SupportService } from './support.service.js';
import { SupportController } from './support.controller.js';
import { ClassificationModule } from '../classification/classification.module.js';
import { InvestigationModule } from '../investigation/investigation.module.js';
import { ResolutionModule } from '../resolution/resolution.module.js';

@Module({
  imports: [ClassificationModule, InvestigationModule, ResolutionModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
