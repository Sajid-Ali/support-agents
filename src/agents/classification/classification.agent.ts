import { Inject, Injectable } from '@nestjs/common';
import { LLM_PROVIDER } from '../../llm/interfaces/llm-provider.interface.js';
import type { LlmProvider } from '../../llm/interfaces/llm-provider.interface.js';
import {
    ClassificationResult,
    ClassificationSchema,
    ClassificationJsonSchema,
} from './classification.schema.js';

@Injectable()
export class ClassificationAgent {
  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LlmProvider,
  ) {}

  async execute(message: string): Promise<ClassificationResult> {
    const response = await this.llmProvider.generateText({
      systemPrompt: this.getSystemPrompt(),
      userPrompt: message,
      responseSchema: ClassificationJsonSchema,
    });

    const parsedResponse: unknown = JSON.parse(response);

    return ClassificationSchema.parse(parsedResponse);
  }

  private getSystemPrompt(): string {
    return `
      You are a banking customer support classification agent.

      Your responsibility is to understand customer messages
      and classify their intent.

      Rules:
      - Do not attempt to resolve customer issues.
      - Do not invent transaction details.
      - Extract transaction information when available.
      - Use null when an entity is missing.
      - Use "unknown" when transaction type is unclear.
      - Set requires_investigation to true when transaction
        verification is needed.
      - Identify missing information needed for the next step.
      - Return valid JSON only.
      - Follow the required output schema exactly.
    `;
  }
}
