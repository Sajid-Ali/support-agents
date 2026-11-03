import type { FunctionDeclaration } from '@google/genai';

export const getTransactionByIdDeclaration: FunctionDeclaration = {
  name: 'get_transaction_by_id',

  description:
    'Retrieve a transaction using its transaction ID. Use this tool when a customer asks to check the status or details of a specific transaction.',

  parametersJsonSchema: {
    type: 'object',
    properties: {
      transaction_id: {
        type: 'string',
        description: 'The unique transaction ID provided by the customer.',
      },
    },
    required: ['transaction_id'],
  },
};
