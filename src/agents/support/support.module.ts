import { Module } from '@nestjs/common';

import { SupportService } from './support.service.js';
import { SupportController } from './support.controller.js';
import { ClassificationModule } from '../classification/classification.module.js';

@Module({
  imports: [ClassificationModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
