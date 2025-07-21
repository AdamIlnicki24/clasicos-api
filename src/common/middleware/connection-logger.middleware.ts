import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class ConnectionLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("DB-Connections");

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // policz przed
    const before = await this.prisma.getConnectionCount();
    this.logger.log(`Before handling ${req.method} ${req.url}: ${before} connections`);

    // po zakończeniu odpowiedzi policz ponownie
    res.on("finish", async () => {
      const after = await this.prisma.getConnectionCount();
      this.logger.log(`After handling  ${req.method} ${req.url}: ${after} connections`);
      const delta = after - before;
      this.logger.log(`Δ connections: ${delta >= 0 ? "+" + delta : delta}`);
    });

    next();
  }
}
