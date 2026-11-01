import { z } from 'zod';

export const InvestigationSchema = z.object({
  status: z.enum([
    'investigated',
    'needs_more_information',
    'not_found',
    'not_required',
  ]),
  transaction: z.object({
    transaction_id: z.string().nullable(),
    transaction_status: z.enum(['completed', 'pending', 'failed', 'unknown']),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    transaction_type: z.enum(['domestic', 'international', 'unknown']),
  }),
  findings: z.string(),
  next_action: z.string(),
  requires_human_review: z.boolean(),
});

export type InvestigationResult = z.infer<typeof InvestigationSchema>;
