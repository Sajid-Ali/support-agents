import { z } from 'zod';

export const ClassificationJsonSchema = {
  type: 'object',
  properties: {
    intent: {
      type: 'string',
      enum: [
        'check_transaction_status',
        'report_failed_transaction',
        'report_duplicate_transaction',
        'request_refund',
        'other',
      ],
    },
    category: {
      type: 'string',
      enum: ['transaction_issue', 'account_issue', 'card_issue', 'other'],
    },
    priority: {
      type: 'string',
      enum: ['low', 'medium', 'high'],
    },
    transaction_type: {
      type: 'string',
      enum: ['domestic', 'international', 'unknown'],
    },
    entities: {
      type: 'object',
      properties: {
        transaction_id: {
          anyOf: [{ type: 'string' }, { type: 'null' }],
        },
        amount: {
          anyOf: [{ type: 'number' }, { type: 'null' }],
        },
        currency: {
          anyOf: [{ type: 'string' }, { type: 'null' }],
        },
      },
      required: ['transaction_id', 'amount', 'currency'],
    },
    requires_investigation: {
      type: 'boolean',
    },
    missing_information: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'intent',
    'category',
    'priority',
    'transaction_type',
    'entities',
    'requires_investigation',
    'missing_information',
  ],
  propertyOrdering: [
    'intent',
    'category',
    'priority',
    'transaction_type',
    'entities',
    'requires_investigation',
    'missing_information',
  ],
} satisfies Record<string, unknown>;

export const ClassificationSchema = z.object({
  intent: z.enum([
    'check_transaction_status',
    'report_failed_transaction',
    'report_duplicate_transaction',
    'request_refund',
    'other',
  ]),

  category: z.enum([
    'transaction_issue',
    'account_issue',
    'card_issue',
    'other',
  ]),

  priority: z.enum(['low', 'medium', 'high']),

  transaction_type: z.enum(['domestic', 'international', 'unknown']),

  entities: z.object({
    transaction_id: z.string().nullable(),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
  }),

  requires_investigation: z.boolean(),

  missing_information: z.array(z.string()),
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;
