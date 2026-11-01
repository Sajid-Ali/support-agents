import { GoogleGenAI } from '@google/genai';
import { LlmProvider, LlmRequest } from '../interfaces/llm-provider.interface.js';


export class GeminiProvider implements LlmProvider {
  readonly providerName = 'gemini';

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
    console.log('[Gemini] Starting request');
    console.log('[Gemini] Model:', this.model);
    console.log('[Gemini] API key configured:', Boolean(this.client));

    try {
      const startTime = Date.now();

      const response = await this.client.models.generateContent({
        model: this.model,
        contents: request.userPrompt,
        config: {
          systemInstruction: request.systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      console.log('[Gemini] Request completed');
      console.log('[Gemini] Duration:', Date.now() - startTime, 'ms');
      console.log('[Gemini] Response:', response.text);

      if (!response.text) {
        throw new Error('Gemini returned an empty response');
      }

      return response.text;
    } catch (error) {
      console.error('[Gemini] API request failed');

      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      const apiError = error as {
        status?: number;
        message?: string;
      };

      console.error('HTTP status:', apiError.status);

      throw error;
    }
  }
}
