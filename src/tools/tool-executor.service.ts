import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TransactionService } from './transactions/transaction.service.js';


const GetTransactionByIdSchema = z.object({
  transaction_id: z.string().min(1),
});

@Injectable()
export class ToolExecutor {
  constructor(private readonly transactionService: TransactionService) {}

  async execute(toolName: string, args: unknown): Promise<unknown> {
    switch (toolName) {
      case 'get_transaction_by_id': {
        const parsedArgs = GetTransactionByIdSchema.parse(args);

        const transaction = await this.transactionService.findById(
          parsedArgs.transaction_id,
        );

        return (
          transaction ?? {
            found: false,
            transaction_id: parsedArgs.transaction_id,
            message: 'Transaction not found.',
          }
        );
      }

      default:
        throw new Error(`Unsupported tool: ${toolName}`);
    }
  }
}
