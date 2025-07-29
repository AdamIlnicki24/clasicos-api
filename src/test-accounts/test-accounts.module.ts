import { Module } from '@nestjs/common';
import { TestAccountsService } from './test-accounts.service';
import { TestAccountsController } from './test-accounts.controller';

@Module({
  controllers: [TestAccountsController],
  providers: [TestAccountsService],
})
export class TestAccountsModule {}
