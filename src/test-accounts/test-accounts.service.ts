import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TestAccount } from "@prisma/client";
import { NO_TEST_ACCOUNTS_FOUND_EXCEPTION } from "../constants/exceptions";

@Injectable()
export class TestAccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRandomTestAccount(): Promise<TestAccount> {
    const count = await this.prismaService.testAccount.count();

    if (count === 0) {
      throw new NotFoundException(NO_TEST_ACCOUNTS_FOUND_EXCEPTION);
    }

    const randomIndex = Math.floor(Math.random() * count);

    const [account] = await this.prismaService.testAccount.findMany({
      take: 1,
      skip: randomIndex,
    });

    return account;
  }
}
