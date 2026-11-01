import { Module } from '@nestjs/common';
import { LlmModule } from '../../llm/llm.module.js';
import { ResolutionAgent } from './resolution.agent.js';

@Module({
  imports: [LlmModule],
  providers: [ResolutionAgent],
  exports: [ResolutionAgent],
})
export class ResolutionModule {}
