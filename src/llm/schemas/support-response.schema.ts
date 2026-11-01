import { z } from 'zod';

export const SupportResponseSchema = z.object({
  category: z.enum([
    'transaction_issue',
    'account_issue',
    'card_issue',
    'other',
  ]),
  priority: z.enum(['low', 'medium', 'high']),
  summary: z.string(),
  response: z.string(),
});

export type SupportResponse = z.infer<typeof SupportResponseSchema>;
