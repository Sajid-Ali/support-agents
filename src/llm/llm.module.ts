import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LLM_PROVIDER } from './interfaces/llm-provider.interface.js';
import { OpenAiProvider } from './providers/openai.provider.js';
import { ClaudeProvider } from './providers/claude.provider.js';
import { GeminiProvider } from './providers/gemini.provider.js';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LLM_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('ENV_LLM_PROVIDER');

        if (provider === 'openai') {
          return new OpenAiProvider(
            configService.getOrThrow<string>('ENV_OPENAI_API_KEY'),
            configService.getOrThrow<string>('ENV_OPENAI_MODEL'),
          );
        }

        if (provider === 'claude') {
          return new ClaudeProvider(
            configService.getOrThrow<string>('ENV_ANTHROPIC_API_KEY'),
            configService.getOrThrow<string>('ENV_ANTHROPIC_MODEL'),
          );
        }

        if (provider === 'gemini') {
          return new GeminiProvider(
            configService.getOrThrow<string>('ENV_GEMINI_API_KEY'),
            configService.getOrThrow<string>('ENV_GEMINI_MODEL'),
          );
        }

        throw new Error(`Unsupported LLM provider: ${provider}`);
      },
    },
  ],
  exports: [LLM_PROVIDER],
})
export class LlmModule {}
