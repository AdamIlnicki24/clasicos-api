import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "prisma/prisma.service";
import { FirebaseService } from "src/common/services/firebase.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, FirebaseService],
})
export class AuthModule {}
