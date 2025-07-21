import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class ConnectionLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("DB-Connections");

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const result: Array<{ Variable_name: string; Value: string }> = await this.prisma.$queryRaw`
          SHOW STATUS WHERE Variable_name = 'Threads_connected';
        `;
      const count = result[0]?.Value ?? "unknown";
      this.logger.log(`Active DB connections: ${count}`);
    } catch (err) {
      this.logger.error("Failed to fetch DB connection count", err);
    }
    next();
  }
}
