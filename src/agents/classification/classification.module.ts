import { Module } from '@nestjs/common';

import { LlmModule } from '../../llm/llm.module.js';
import { ClassificationAgent } from './classification.agent.js';

@Module({
  imports: [LlmModule],
  providers: [ClassificationAgent],
  exports: [ClassificationAgent],
})
export class ClassificationModule {}
