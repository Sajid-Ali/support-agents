export interface LlmRequest {
  systemPrompt: string;
  userPrompt: string;
  responseSchema?: Record<string, unknown>;
}

export interface LlmProvider {
  readonly providerName: string;

  generateText(request: LlmRequest): Promise<string>;
}

export const LLM_PROVIDER = 'LLM_PROVIDER';
