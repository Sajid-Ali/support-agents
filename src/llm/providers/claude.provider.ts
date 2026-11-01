import Anthropic from '@anthropic-ai/sdk';
import { Logger } from '@nestjs/common';

import {
  LlmRequest,
  LlmProvider,
} from '../interfaces/llm-provider.interface.js';

export class ClaudeProvider implements LlmProvider {
  readonly providerName = 'claude';

  private readonly logger = new Logger(ClaudeProvider.name);
  private readonly client: Anthropic;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async generateText(request: LlmRequest): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: request.systemPrompt,
        messages: [
          {
            role: 'user',
            content: request.userPrompt,
          },
        ],
      });

      const textBlock = response.content.find(
        (block) => block.type === 'text',
      );

      if (!textBlock) {
        throw new Error('Claude returned an empty response');
      }

      return textBlock.text;
    } catch (error) {
      this.logger.error(
        'Claude request failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
