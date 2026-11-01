import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LLM_PROVIDER } from '../../llm/interfaces/llm-provider.interface.js';
import type { LlmProvider } from '../../llm/interfaces/llm-provider.interface.js';
import {
  SupportResponse,
  SupportResponseSchema,
} from '../../llm/schemas/support-response.schema.js';

@Injectable()
export class SupportService {
  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LlmProvider,
  ) {}

  async processRequest(
    message: string,
  ): Promise<{ agent: string; provider: string; result: SupportResponse }> {
    console.log("🚀 ~ SupportService ~ processRequest ~ message:", message)
    const systemPrompt = `
    You are a customer support classification and response agent.
    Your responsibilities:
    1. Understand the customer's request.
    2. Classify the issue.
    3. Determine its priority.
    4. Write a helpful customer-facing response.

    Available categories:
    - transaction_issue
    - account_issue
    - card_issue
    - other

    Available priorities:
    - low
    - medium
    - high

    Important rules:
    - Return only valid JSON.
    - Do not include Markdown code blocks.
    - Never invent transaction information.
    - Never claim that you investigated an actual transaction.
    - If information is missing, ask the customer for it.
    - Be professional and concise.

    Return this JSON structure:
    {
        "category": "transaction_issue",
        "priority": "high",
        "summary": "Short explanation of the issue",
        "response": "Customer-facing response"
    }
    `;
    try {
      const rawResponse = await this.llmProvider.generateText({
        userPrompt: message,
        systemPrompt,
      });

      const parsedJson: unknown = JSON.parse(rawResponse);

      const validation = SupportResponseSchema.safeParse(parsedJson);

      if (!validation.success) {
        throw new Error('Invalid AI response structure');
      }
      return {
        agent: 'support-agent',
        provider: this.llmProvider.providerName,
        result: validation.data,
      };
    } catch (error) {
      console.log("🚀 ~ SupportService ~ processRequest ~ error:", error)
      throw new InternalServerErrorException(
        'Unable to process the support request',
      );
    }
  }
}
