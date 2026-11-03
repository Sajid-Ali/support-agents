import { GoogleGenAI, FunctionCallingConfigMode } from '@google/genai';
import { Logger } from '@nestjs/common';

import type { FunctionDeclaration } from '@google/genai';
import {
  LlmProvider,
  LlmRequest,
  LlmFunctionCall,
  LlmToolResponse,
} from '../interfaces/llm-provider.interface.js';

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
      this.logger.log(
        '[Gemini] Schema properties:',
        Object.keys(
          (request.responseSchema?.properties as Record<string, unknown>) ?? {},
        ),
      );
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: request.userPrompt,
        config: {
          systemInstruction: request.systemPrompt,
          responseMimeType: 'application/json',
          responseJsonSchema: request.responseSchema,
          temperature: 0.1,
          maxOutputTokens: 512,
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

  async generateWithTools(
    request: LlmRequest,
    tools: FunctionDeclaration[],
  ): Promise<LlmToolResponse> {
    const startTime = Date.now();

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: request.userPrompt,
        config: {
          systemInstruction: request.systemPrompt,
          tools: [
            {
              functionDeclarations: tools,
            },
          ],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
          temperature: 0.1,
          maxOutputTokens: 512,
        },
      });

      this.logger.log(
        `[Gemini] Tool request completed in ${Date.now() - startTime}ms`,
      );

      const functionCalls: LlmFunctionCall[] = (
        response.functionCalls ?? []
      ).flatMap((call) => {
        if (!call.name) {
          return [];
        }

        return [
          {
            name: call.name,
            args: call.args ?? {},
          },
        ];
      });

      return {
        text: response.text,
        functionCalls,
      };
    } catch (error) {
      const status = (error as { status?: number }).status;

      this.logger.error(
        `Gemini tool request failed${status ? ` (HTTP ${status})` : ''}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
