import { Module } from '@nestjs/common';

import { LlmModule } from '../../llm/llm.module.js';
import { SupportService } from './support.service.js';
import { SupportController } from './support.controller.js';

@Module({
  imports: [LlmModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
