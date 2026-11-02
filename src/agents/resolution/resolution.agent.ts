import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  ResolutionResult,
  ResolutionSchema,
  ResolutionJsonSchema,
} from './resolution.schema.js';
import { LLM_PROVIDER } from '../../llm/interfaces/llm-provider.interface.js';
import type { LlmProvider } from '../../llm/interfaces/llm-provider.interface.js';
import { SupportContext } from '../shared/interfaces/support-context.interface.js';

@Injectable()
export class ResolutionAgent implements OnModuleInit {
  private systemPrompt: string;

  constructor(
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LlmProvider,
  ) {}

  async onModuleInit() {
    const definitionFile = join(
      process.cwd(),
      'src',
      'agents',
      'resolution',
      'resolution.agent.md',
    );
    this.systemPrompt = (await readFile(definitionFile, 'utf8')).trim();

    if (!this.systemPrompt) {
      throw new Error('Resolution agent definition is empty.');
    }
  }

  async execute(context: SupportContext): Promise<ResolutionResult> {
    const classification = context.classification;
    const investigation = context.investigation;

    if (!classification || !investigation) {
      throw new Error(
        'Classification or investigation result is missing from support context.',
      );
    }

    const response = await this.llmProvider.generateText({
      systemPrompt: this.systemPrompt,
      userPrompt: JSON.stringify({
        customer_message: context.customerMessage,
        classification,
        investigation,
      }),
      responseSchema: ResolutionJsonSchema,
    });

    const parsedResponse: unknown = JSON.parse(response);

    return ResolutionSchema.parse(parsedResponse);
  }
}
