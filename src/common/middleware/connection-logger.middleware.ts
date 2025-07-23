import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class ConnectionLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("DB-Connections");

  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const before = await this.prismaService.getConnectionCount();
    this.logger.log(`Before handling ${req.method} ${req.url}: ${before} connections`);

    res.on("finish", async () => {
      const after = await this.prismaService.getConnectionCount();
      this.logger.log(`After handling  ${req.method} ${req.url}: ${after} connections`);
      const delta = after - before;
      this.logger.log(`Δ connections: ${delta >= 0 ? "+" + delta : delta}`);
    });

    next();
  }
}
