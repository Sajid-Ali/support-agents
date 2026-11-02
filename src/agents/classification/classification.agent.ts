import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  ClassificationResult,
  ClassificationSchema,
  ClassificationJsonSchema,
} from './classification.schema.js';
import { LLM_PROVIDER } from '../../llm/interfaces/llm-provider.interface.js';
import type { LlmProvider } from '../../llm/interfaces/llm-provider.interface.js';
import { SupportContext } from '../shared/interfaces/support-context.interface.js';

@Injectable()
export class ClassificationAgent implements OnModuleInit {
  private systemPrompt: string;
  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LlmProvider,
  ) {}

  async onModuleInit() {
    const definitionFile = join(
      process.cwd(),
      'src',
      'agents',
      'classification',
      'classification.agent.md',
    );
    this.systemPrompt = (await readFile(definitionFile, 'utf8')).trim();

    if (!this.systemPrompt) {
      throw new Error('Classification agent definition is empty.');
    }
  }

  async execute(context: SupportContext): Promise<ClassificationResult> {
    const response = await this.llmProvider.generateText({
      systemPrompt: this.systemPrompt,
      userPrompt: context.customerMessage,
      responseSchema: ClassificationJsonSchema,
    });

    const parsedResponse: unknown = JSON.parse(response);

    return ClassificationSchema.parse(parsedResponse);
  }
}
