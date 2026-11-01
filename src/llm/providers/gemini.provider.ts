import { GoogleGenAI } from '@google/genai';
import { Logger } from '@nestjs/common';
import { LlmProvider, LlmRequest } from '../interfaces/llm-provider.interface.js';

export class GeminiProvider implements LlmProvider {
  readonly providerName = 'gemini';

  private readonly logger = new Logger(GeminiProvider.name);
  private readonly client: GoogleGenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 90000,
      },
    });
  }

  async generateText(request: LlmRequest): Promise<string> {
    const startTime = Date.now();

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: request.userPrompt,
        config: {
          systemInstruction: request.systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      this.logger.log(`Request completed in ${Date.now() - startTime}ms`);

      if (!response.text) {
        throw new Error('Gemini returned an empty response');
      }

      return response.text;
    } catch (error) {
      const status = (error as { status?: number }).status;

      this.logger.error(
        `Gemini request failed${status ? ` (HTTP ${status})` : ''}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
