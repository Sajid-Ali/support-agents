import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LLM_PROVIDER } from '../../llm/interfaces/llm-provider.interface.js';
import type { LlmProvider } from '../../llm/interfaces/llm-provider.interface.js';
import {
  SupportResponse,
  SupportResponseSchema,
} from '../../llm/schemas/support-response.schema.js';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LlmProvider,
  ) {}

  async processRequest(
    message: string,
  ): Promise<{ agent: string; provider: string; result: SupportResponse }> {
    this.logger.log(`Processing request via "${this.llmProvider.providerName}" provider`);

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

    let rawResponse: string;
    try {
      rawResponse = await this.llmProvider.generateText({
        userPrompt: message,
        systemPrompt,
      });
    } catch (error) {
      this.logger.error(
        `LLM provider "${this.llmProvider.providerName}" failed to generate a response`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'The support agent is temporarily unavailable. Please try again later.',
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawResponse);
    } catch {
      this.logger.error(`LLM returned non-JSON response: ${rawResponse}`);
      throw new UnprocessableEntityException(
        'The support agent returned an invalid response.',
      );
    }

    const validation = SupportResponseSchema.safeParse(parsedJson);

    if (!validation.success) {
      this.logger.error(
        `LLM response failed schema validation: ${JSON.stringify(validation.error.issues)}`,
      );
      throw new UnprocessableEntityException(
        'The support agent returned an invalid response.',
      );
    }

    this.logger.log(
      `Classified request as "${validation.data.category}" (${validation.data.priority} priority)`,
    );

    return {
      agent: 'support-agent',
      provider: this.llmProvider.providerName,
      result: validation.data,
    };
  }
}
