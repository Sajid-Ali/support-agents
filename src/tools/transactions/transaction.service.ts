import { Injectable } from '@nestjs/common';

export interface Transaction {
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
  transactionType: 'domestic' | 'international';
  createdAt: string;
}

@Injectable()
export class TransactionService {
  private readonly transactions: Transaction[] = [
    {
      transactionId: '123456',
      status: 'pending',
      amount: 1500,
      currency: 'SAR',
      transactionType: 'international',
      createdAt: '2026-10-30T10:30:00Z',
    },
    {
      transactionId: '789012',
      status: 'completed',
      amount: 500,
      currency: 'SAR',
      transactionType: 'domestic',
      createdAt: '2026-10-29T08:15:00Z',
    },
    {
      transactionId: '345678',
      status: 'failed',
      amount: 2500,
      currency: 'SAR',
      transactionType: 'international',
      createdAt: '2026-10-28T14:00:00Z',
    },
  ];

  async findById(transactionId: string): Promise<Transaction | null> {
    return (
      this.transactions.find(
        (transaction) => transaction.transactionId === transactionId,
      ) ?? null
    );
  }
}
