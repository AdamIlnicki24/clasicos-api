import { Controller, Get } from "@nestjs/common";
import { TestAccountsService } from "./test-accounts.service";
import { TestAccount } from "@prisma/client";

@Controller("test-accounts")
export class TestAccountsController {
  constructor(private readonly testAccountsService: TestAccountsService) {}
  @Get()
  async getRandomTestAccount(): Promise<TestAccount> {
    return await this.testAccountsService.getRandomTestAccount();
  }
}