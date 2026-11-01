import { z } from 'zod';

export const ResolutionSchema = z.object({
  customer_response: z.string().min(1),
});

export type ResolutionResult = z.infer<typeof ResolutionSchema>;

export const ResolutionJsonSchema = {
  type: 'object',
  properties: {
    customer_response: {
      type: 'string',
    },
  },
  required: ['customer_response'],
  propertyOrdering: ['customer_response'],
} satisfies Record<string, unknown>;
