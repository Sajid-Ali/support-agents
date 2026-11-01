import OpenAI from 'openai';
import { Logger } from '@nestjs/common';

import {
  LlmRequest,
  LlmProvider,
} from '../interfaces/llm-provider.interface.js';

export class OpenAiProvider implements LlmProvider {
  readonly providerName = 'openai';

  private readonly logger = new Logger(OpenAiProvider.name);
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async generateText(request: LlmRequest): Promise<string> {
    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions: request.systemPrompt,
        input: request.userPrompt,
      });

      return response.output_text;
    } catch (error) {
      this.logger.error(
        'OpenAI request failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
