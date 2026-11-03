import type { FunctionDeclaration } from '@google/genai';

export interface LlmRequest {
  systemPrompt: string;
  userPrompt: string;
  responseSchema?: Record<string, unknown>;
}

export interface LlmFunctionCall {
  name: string;
  args: unknown;
}

export interface LlmToolResponse {
  text?: string;
  functionCalls: LlmFunctionCall[];
}

export interface LlmProvider {
  readonly providerName: string;

  generateText(request: LlmRequest): Promise<string>;

  generateWithTools?(
    request: LlmRequest,
    tools: FunctionDeclaration[],
  ): Promise<LlmToolResponse>;
}

export const LLM_PROVIDER = 'LLM_PROVIDER';
