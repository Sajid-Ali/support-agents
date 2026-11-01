import OpenAI from 'openai';

import {
  LlmRequest,
  LlmProvider,
} from '../interfaces/llm-provider.interface.js';

export class OpenAiProvider implements LlmProvider {
  readonly providerName = 'openai';

  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async generateText(request: LlmRequest): Promise<string> {
    const response = await this.client.responses.create({
      model: this.model,
      instructions: request.systemPrompt,
      input: request.userPrompt,
    });

    return response.output_text;
  }
}
