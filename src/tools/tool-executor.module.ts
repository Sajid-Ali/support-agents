import { Module } from '@nestjs/common';

import { TransactionsModule } from './transactions/transaction.module.js';
import { ToolExecutor } from './tool-executor.service.js';


@Module({
  imports: [TransactionsModule],
  providers: [ToolExecutor],
  exports: [ToolExecutor],
})
export class ToolExecutorModule {}
