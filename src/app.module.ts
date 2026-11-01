import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';
import { SupportModule } from './agents/support/support.module.js';
import { ClassificationModule } from './agents/classification/classification.module.js';
import { InvestigationModule } from './agents/investigation/investigation.module.js';
import { TransactionsModule } from './tools/transactions/transactions.module.js';
import { ResolutionModule } from './agents/resolution/resolution.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupportModule,
    ClassificationModule,
    InvestigationModule,
    TransactionsModule,
    ResolutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
