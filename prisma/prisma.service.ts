import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("PrismaService");

  constructor() {
    super({
      log: [
        { level: "query", emit: "stdout" },
        { level: "info", emit: "stdout" },
        { level: "warn", emit: "stdout" },
        { level: "error", emit: "stdout" },
      ],
    });
  }

  async onModuleInit() {
    this.logger.log("Connected to database");
  }

  async getConnectionCount(): Promise<number> {
    const result: Array<{ Variable_name: string; Value: string }> = await this.$queryRaw`
      SHOW STATUS WHERE Variable_name = 'Threads_connected'
    `;
    const raw = result[0]?.Value ?? "0";
    return Number(raw);
  }
}
