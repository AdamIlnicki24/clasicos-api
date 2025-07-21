import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prismaLogger = new Logger("PrismaService");

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [{ level: "query", emit: "stdout" }],
    });
  }

  async onModuleInit() {
    await this.$connect();
    prismaLogger.log("Connected to database");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    prismaLogger.log("Disconnected from database");
  }

  async getConnectionCount(): Promise<number> {
    const result: Array<{ Variable_name: string; Value: string }> = await this.$queryRaw`
        SHOW STATUS WHERE Variable_name = 'Threads_connected'
      `;
    const raw = result[0]?.Value ?? "0";
    return Number(raw);
  }
}
