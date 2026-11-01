import { Module } from '@nestjs/common';

import { InvestigationAgent } from './investigation.agent.js';
import { TransactionsModule } from '../../tools/transactions/transactions.module.js';

@Module({
    imports: [TransactionsModule],
    providers: [InvestigationAgent],
    exports: [InvestigationAgent],
})
export class InvestigationModule {}
